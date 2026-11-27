import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { banco } from "@/lib/db";
import { assinarSessao, conferirSenha, DURACAO_DA_SESSAO_MS, sessaoValida } from "@/lib/admin/seguranca";

const COOKIE = "rt_admin";
const JANELA_MS = 15 * 60e3;
const MAX_TENTATIVAS = 5;
const MAX_TENTATIVAS_NO_TOTAL = 30;

/** O admin só existe se a senha e o segredo da sessão estiverem configurados. */
export function adminConfigurado(): boolean {
    const hash = process.env.ADMIN_SENHA_HASH || "";
    // Formato exato do que o scripts/gerar-senha.mjs produz: sal de 16 bytes e resumo de 64 bytes.
    return /^scrypt:[A-Za-z0-9_-]{22}:[A-Za-z0-9_-]{86}$/.test(hash) && Boolean(process.env.ADMIN_SESSAO_SEGREDO && process.env.ADMIN_SESSAO_SEGREDO.length >= 32);
}

/** Época atual das sessões. Sem banco vale zero, e o painel continua funcionando. */
function epocaDaSessao(): number {
    try {
        const linha = banco()?.prepare("SELECT valor FROM config WHERE chave = 'sessao_epoca'").get() as { valor: string } | undefined;
        return Number(linha?.valor ?? 0) || 0;
    } catch {
        return 0;
    }
}

/**
 * Opções do cookie: não é lido por script da página, só viaja em pedidos do próprio site,
 * só por HTTPS em produção e só para os endereços do painel (o site público nunca o recebe).
 */
const OPCOES_DO_COOKIE = { httpOnly: true, sameSite: "strict" as const, secure: process.env.NODE_ENV === "production", path: "/admin" };

export async function adminLogado(): Promise<boolean> {
    if (!adminConfigurado()) return false;
    const jar = await cookies();
    return sessaoValida(jar.get(COOKIE)?.value, process.env.ADMIN_SESSAO_SEGREDO as string, Date.now(), epocaDaSessao());
}

/** Usado em toda página e ação do painel: sem sessão válida, vai para o login. */
export async function exigirAdmin(): Promise<void> {
    if (!(await adminLogado())) redirect("/admin/login");
}

async function ipDoPedido(): Promise<string> {
    const h = await headers();
    // O último valor é o que o proxy da frente (Traefik) acrescentou. Os anteriores podem ter sido inventados por quem pediu.
    const encaminhado = (h.get("x-forwarded-for") || "").split(",").pop()?.trim();
    return (encaminhado || h.get("x-real-ip") || "local").slice(0, 64);
}

/** Tenta entrar. Devolve a mensagem de erro, ou null se deu certo. */
export async function entrar(senha: string): Promise<string | null> {
    if (!adminConfigurado()) return "O painel não está configurado neste servidor.";
    const db = banco();
    if (!db) return "O banco de dados não está disponível.";

    const ip = await ipDoPedido();
    const desde = new Date(Date.now() - JANELA_MS).toISOString();
    db.prepare("DELETE FROM login_tentativa WHERE em < ?").run(desde);
    const { n } = db.prepare("SELECT COUNT(*) AS n FROM login_tentativa WHERE ip = ? AND em >= ?").get(ip, desde) as { n: number };
    // Teto geral, para quem troca de endereço a cada tentativa.
    const { total } = db.prepare("SELECT COUNT(*) AS total FROM login_tentativa WHERE em >= ?").get(desde) as { total: number };
    if (n >= MAX_TENTATIVAS || total >= MAX_TENTATIVAS_NO_TOTAL) return "Muitas tentativas. Espere 15 minutos e tente de novo.";

    if (!conferirSenha(senha, process.env.ADMIN_SENHA_HASH as string)) {
        db.prepare("INSERT INTO login_tentativa (ip, em) VALUES (?, ?)").run(ip, new Date().toISOString());
        return "Senha incorreta.";
    }

    const jar = await cookies();
    jar.set(COOKIE, assinarSessao(process.env.ADMIN_SESSAO_SEGREDO as string, Date.now(), epocaDaSessao()), { ...OPCOES_DO_COOKIE, maxAge: DURACAO_DA_SESSAO_MS / 1000 });
    return null;
}

/** Sai do painel: apaga o cookie deste navegador e invalida qualquer cópia dele, em qualquer lugar. */
export async function sair(): Promise<void> {
    try {
        banco()
            ?.prepare("INSERT INTO config (chave, valor) VALUES ('sessao_epoca', '1') ON CONFLICT(chave) DO UPDATE SET valor = CAST(CAST(valor AS INTEGER) + 1 AS TEXT)")
            .run();
    } catch {
        // Sem banco não dá para invalidar as cópias; o cookie deste navegador é apagado do mesmo jeito.
    }
    const jar = await cookies();
    jar.set(COOKIE, "", { ...OPCOES_DO_COOKIE, maxAge: 0 });
}
