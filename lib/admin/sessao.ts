import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { banco } from "@/lib/db";
import { assinarSessao, conferirSenha, DURACAO_DA_SESSAO_MS, sessaoValida } from "@/lib/admin/seguranca";

const COOKIE = "rt_admin";
const JANELA_MS = 15 * 60e3;
const MAX_TENTATIVAS = 5;

/** O admin só existe se a senha e o segredo da sessão estiverem configurados. */
export function adminConfigurado(): boolean {
    return Boolean(process.env.ADMIN_SENHA_HASH && process.env.ADMIN_SESSAO_SEGREDO && process.env.ADMIN_SESSAO_SEGREDO.length >= 32);
}

export async function adminLogado(): Promise<boolean> {
    if (!adminConfigurado()) return false;
    const jar = await cookies();
    return sessaoValida(jar.get(COOKIE)?.value, process.env.ADMIN_SESSAO_SEGREDO as string);
}

/** Usado em toda página e ação do painel: sem sessão válida, vai para o login. */
export async function exigirAdmin(): Promise<void> {
    if (!(await adminLogado())) redirect("/admin/login");
}

async function ipDoPedido(): Promise<string> {
    const h = await headers();
    return (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "local";
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
    if (n >= MAX_TENTATIVAS) return "Muitas tentativas. Espere 15 minutos e tente de novo.";

    if (!conferirSenha(senha, process.env.ADMIN_SENHA_HASH as string)) {
        db.prepare("INSERT INTO login_tentativa (ip, em) VALUES (?, ?)").run(ip, new Date().toISOString());
        return "Senha incorreta.";
    }

    const jar = await cookies();
    jar.set(COOKIE, assinarSessao(process.env.ADMIN_SESSAO_SEGREDO as string), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: DURACAO_DA_SESSAO_MS / 1000,
    });
    return null;
}

export async function sair(): Promise<void> {
    (await cookies()).delete(COOKIE);
}
