import { banco } from "@/lib/db";
import { ErroDoInstagram, lerConta, lerCota, publicarCarrossel, publicarImagem, renovarToken } from "@/lib/instagram/graph";
import { enderecoDaMidia, limparOrfas } from "@/lib/instagram/midia";
import { semToken } from "@/lib/instagram/regras";
import type { TipoDePost } from "@/lib/instagram/regras";

const APELIDO = "rugemtugem";
const MAX_TENTATIVAS = 3;

export interface ContaGuardada {
    ig_user_id: string;
    username: string;
    account_type: string;
    expira_em: string;
    atualizado_em: string;
}

export interface PostDaFila {
    id: number;
    tipo: TipoDePost;
    titulo: string;
    slug: string | null;
    midias: string[];
    legenda: string;
    quando_utc: string;
    status: "agendado" | "publicando" | "publicado" | "erro" | "cancelado";
    tentativas: number;
    erro: string | null;
    permalink: string | null;
    publicado_em: string | null;
}

/** Dados da conta conectada, sem o token. */
export function contaConectada(): ContaGuardada | null {
    return (
        (banco()?.prepare("SELECT ig_user_id, username, account_type, expira_em, atualizado_em FROM ig_conta WHERE apelido = ?").get(APELIDO) as ContaGuardada | undefined) ?? null
    );
}

function tokenDaConta(): { ig_user_id: string; token: string; expira_em: string } | null {
    return (banco()?.prepare("SELECT ig_user_id, token, expira_em FROM ig_conta WHERE apelido = ?").get(APELIDO) as { ig_user_id: string; token: string; expira_em: string } | undefined) ?? null;
}

/** Confere o token na API e guarda a conta. O token nunca volta para a tela. */
export async function conectarConta(token: string): Promise<ContaGuardada> {
    const db = banco();
    if (!db) throw new Error("Banco indisponível");
    const limpo = token.trim();
    if (limpo.length < 20) throw new ErroDoInstagram("O token colado está incompleto.");
    const conta = await lerConta(limpo);
    const agora = new Date();
    db.prepare(
        `INSERT INTO ig_conta (apelido, ig_user_id, username, account_type, token, expira_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(apelido) DO UPDATE SET ig_user_id = excluded.ig_user_id, username = excluded.username, account_type = excluded.account_type,
           token = excluded.token, expira_em = excluded.expira_em, atualizado_em = excluded.atualizado_em`,
    ).run(APELIDO, conta.ig_user_id, conta.username, conta.account_type, limpo, new Date(agora.getTime() + 60 * 86400e3).toISOString(), agora.toISOString());
    return contaConectada() as ContaGuardada;
}

export function desconectarConta(): void {
    banco()?.prepare("DELETE FROM ig_conta WHERE apelido = ?").run(APELIDO);
}

export async function cotaDaConta(): Promise<{ usados: number; total: number } | null> {
    const conta = tokenDaConta();
    if (!conta) return null;
    try {
        return await lerCota(conta.ig_user_id, conta.token);
    } catch {
        return null;
    }
}

interface LinhaBruta extends Omit<PostDaFila, "midias"> {
    midias: string;
}

const COLUNAS = "id, tipo, titulo, slug, midias, legenda, quando_utc, status, tentativas, erro, permalink, publicado_em";
const ler = (l: LinhaBruta): PostDaFila => ({ ...l, midias: JSON.parse(l.midias) as string[] });

export function filaDoInstagram(): PostDaFila[] {
    const linhas = (banco()?.prepare(`SELECT ${COLUNAS} FROM ig_post WHERE status <> 'cancelado' ORDER BY quando_utc DESC LIMIT 100`).all() as LinhaBruta[] | undefined) ?? [];
    return linhas.map(ler);
}

export function agendarPost(dados: { tipo: TipoDePost; titulo: string; slug?: string; midias: string[]; legenda: string; quandoUtc: string }): number {
    const db = banco();
    if (!db) throw new Error("Banco indisponível");
    const r = db
        .prepare("INSERT INTO ig_post (apelido, tipo, titulo, slug, midias, legenda, quando_utc, status, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?, 'agendado', ?)")
        .run(APELIDO, dados.tipo, dados.titulo, dados.slug ?? null, JSON.stringify(dados.midias), dados.legenda, dados.quandoUtc, new Date().toISOString());
    return Number(r.lastInsertRowid);
}

/** Cancela um post que ainda não saiu. */
export function cancelarPost(id: number): void {
    banco()?.prepare("UPDATE ig_post SET status = 'cancelado' WHERE id = ? AND status IN ('agendado', 'erro')").run(id);
}

/** Recoloca na fila um post que deu erro, para sair no próximo tique. */
export function tentarDeNovo(id: number): void {
    banco()?.prepare("UPDATE ig_post SET status = 'agendado', tentativas = 0, erro = NULL, reservado_em = NULL WHERE id = ? AND status = 'erro'").run(id);
}

/**
 * Publica os posts cujo horário venceu. Cada post é reservado antes de sair, para não publicar duas vezes.
 * Depois de três tentativas com erro, o post para e o erro fica gravado para aparecer no painel.
 */
export async function publicarVencidosDoInstagram(agora = new Date()): Promise<{ publicados: number; erros: number }> {
    const db = banco();
    const conta = tokenDaConta();
    if (!db || !conta) return { publicados: 0, erros: 0 };

    // Reserva travada há mais de 15 minutos volta para a fila: o tique anterior caiu no meio.
    db.prepare("UPDATE ig_post SET status = 'agendado' WHERE status = 'publicando' AND reservado_em < ?").run(new Date(agora.getTime() - 15 * 60e3).toISOString());

    const vencidos = (db.prepare(`SELECT ${COLUNAS} FROM ig_post WHERE status = 'agendado' AND quando_utc <= ? ORDER BY quando_utc LIMIT 5`).all(agora.toISOString()) as LinhaBruta[]).map(ler);
    let publicados = 0;
    let erros = 0;

    for (const post of vencidos) {
        const reservado = db.prepare("UPDATE ig_post SET status = 'publicando', reservado_em = ?, tentativas = tentativas + 1 WHERE id = ? AND status = 'agendado'").run(agora.toISOString(), post.id);
        if (reservado.changes !== 1) continue;
        try {
            const urls = post.midias.map(enderecoDaMidia);
            const resultado = post.tipo === "carrossel" ? await publicarCarrossel(conta.ig_user_id, conta.token, urls, post.legenda) : await publicarImagem(conta.ig_user_id, conta.token, urls[0], post.legenda);
            db.prepare("UPDATE ig_post SET status = 'publicado', media_id = ?, permalink = ?, publicado_em = ?, erro = NULL WHERE id = ?").run(resultado.media_id, resultado.permalink, new Date().toISOString(), post.id);
            publicados++;
        } catch (e) {
            const mensagem = semToken(e instanceof Error ? e.message : "erro desconhecido", conta.token).slice(0, 500);
            const esgotou = post.tentativas + 1 >= MAX_TENTATIVAS;
            db.prepare("UPDATE ig_post SET status = ?, erro = ? WHERE id = ?").run(esgotou ? "erro" : "agendado", mensagem, post.id);
            erros++;
        }
    }
    return { publicados, erros };
}

/** Uma vez por dia: renova o token que vence em até 15 dias e apaga mídias sem uso. */
export async function manutencaoDiaria(agora = new Date()): Promise<string> {
    const db = banco();
    if (!db) return "";
    const partes: string[] = [];
    const conta = tokenDaConta();
    if (conta && Date.parse(conta.expira_em) - agora.getTime() < 15 * 86400e3) {
        try {
            const novo = await renovarToken(conta.token);
            db.prepare("UPDATE ig_conta SET token = ?, expira_em = ?, atualizado_em = ? WHERE apelido = ?").run(novo.token, new Date(agora.getTime() + novo.segundos * 1000).toISOString(), agora.toISOString(), APELIDO);
            partes.push("Token do Instagram renovado.");
        } catch (e) {
            partes.push(semToken(`Falha ao renovar o token: ${e instanceof Error ? e.message : "erro"}`, conta.token));
        }
    }
    const emUso = new Set<string>();
    for (const l of db.prepare("SELECT midias FROM ig_post WHERE status IN ('agendado', 'publicando', 'erro')").all() as { midias: string }[]) {
        for (const nome of JSON.parse(l.midias) as string[]) emUso.add(nome);
    }
    const apagadas = limparOrfas(emUso);
    if (apagadas > 0) partes.push(`${apagadas} mídias sem uso apagadas.`);
    return partes.join(" ");
}
