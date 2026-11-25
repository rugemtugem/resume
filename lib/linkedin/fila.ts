import { readFileSync } from "node:fs";
import { banco } from "@/lib/db";
import { caminhoDaMidia } from "@/lib/instagram/midia";
import { ErroDoLinkedin, lerPerfil, publicarNoLinkedin } from "@/lib/linkedin/api";
import { semTokenDoLinkedin } from "@/lib/linkedin/regras";

const APELIDO = "fabio";
const MAX_TENTATIVAS = 3;
/** O token de um app comum do LinkedIn vale 60 dias e não se renova sozinho. */
const VALIDADE_MS = 60 * 86400e3;

export interface ContaDoLinkedin {
    pessoa_urn: string;
    nome: string;
    expira_em: string;
}

export interface PostDoLinkedin {
    id: number;
    titulo: string;
    slug: string | null;
    texto: string;
    midias: string[];
    quando_utc: string;
    status: "agendado" | "publicando" | "publicado" | "erro" | "cancelado";
    tentativas: number;
    erro: string | null;
    post_urn: string | null;
    publicado_em: string | null;
}

/** Dados da conta conectada, sem o token. */
export function contaDoLinkedin(): ContaDoLinkedin | null {
    return (banco()?.prepare("SELECT pessoa_urn, nome, expira_em FROM li_conta WHERE apelido = ?").get(APELIDO) as ContaDoLinkedin | undefined) ?? null;
}

/** Credenciais para as leituras do servidor (publicação e métricas). Nunca vão para a tela. */
export function tokenDoLinkedin(): { pessoa_urn: string; token: string; expira_em: string } | null {
    return (banco()?.prepare("SELECT pessoa_urn, token, expira_em FROM li_conta WHERE apelido = ?").get(APELIDO) as { pessoa_urn: string; token: string; expira_em: string } | undefined) ?? null;
}

/** Confere o token na API e guarda a conta. O token nunca volta para a tela. */
export async function conectarLinkedin(token: string): Promise<ContaDoLinkedin> {
    const db = banco();
    if (!db) throw new Error("Banco indisponível");
    const limpo = token.trim();
    if (limpo.length < 20) throw new ErroDoLinkedin("O token colado está incompleto.");
    const perfil = await lerPerfil(limpo);
    const agora = new Date();
    db.prepare(
        `INSERT INTO li_conta (apelido, pessoa_urn, nome, token, expira_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(apelido) DO UPDATE SET pessoa_urn = excluded.pessoa_urn, nome = excluded.nome, token = excluded.token, expira_em = excluded.expira_em, atualizado_em = excluded.atualizado_em`,
    ).run(APELIDO, perfil.urn, perfil.nome, limpo, new Date(agora.getTime() + VALIDADE_MS).toISOString(), agora.toISOString());
    return contaDoLinkedin() as ContaDoLinkedin;
}

export function desconectarLinkedin(): void {
    banco()?.prepare("DELETE FROM li_conta WHERE apelido = ?").run(APELIDO);
}

interface LinhaBruta extends Omit<PostDoLinkedin, "midias"> {
    midias: string;
}

const COLUNAS = "id, titulo, slug, texto, midias, quando_utc, status, tentativas, erro, post_urn, publicado_em";
const ler = (l: LinhaBruta): PostDoLinkedin => ({ ...l, midias: JSON.parse(l.midias) as string[] });

export function filaDoLinkedin(): PostDoLinkedin[] {
    const linhas = (banco()?.prepare(`SELECT ${COLUNAS} FROM li_post WHERE status <> 'cancelado' ORDER BY quando_utc DESC LIMIT 100`).all() as LinhaBruta[] | undefined) ?? [];
    return linhas.map(ler);
}

export function agendarNoLinkedin(dados: { titulo: string; slug?: string; texto: string; midias: string[]; quandoUtc: string }): number {
    const db = banco();
    if (!db) throw new Error("Banco indisponível");
    const r = db
        .prepare("INSERT INTO li_post (titulo, slug, texto, midias, quando_utc, status, criado_em) VALUES (?, ?, ?, ?, ?, 'agendado', ?)")
        .run(dados.titulo, dados.slug ?? null, dados.texto, JSON.stringify(dados.midias), dados.quandoUtc, new Date().toISOString());
    return Number(r.lastInsertRowid);
}

/** Posts de um roteiro que ainda contam (não cancelados), do mais recente para o mais antigo. */
export function linkedinDoSlug(slug: string): PostDoLinkedin[] {
    const linhas = (banco()?.prepare(`SELECT ${COLUNAS} FROM li_post WHERE slug = ? AND status <> 'cancelado' ORDER BY id DESC`).all(slug) as LinhaBruta[] | undefined) ?? [];
    return linhas.map(ler);
}

/** Tira da fila os posts do roteiro que ainda não saíram. Usado ao aprovar de novo. */
export function cancelarLinkedinDoSlug(slug: string): number {
    return banco()?.prepare("UPDATE li_post SET status = 'cancelado' WHERE slug = ? AND status IN ('agendado', 'erro')").run(slug).changes ?? 0;
}

export function cancelarNoLinkedin(id: number): void {
    banco()?.prepare("UPDATE li_post SET status = 'cancelado' WHERE id = ? AND status IN ('agendado', 'erro')").run(id);
}

export function tentarDeNovoNoLinkedin(id: number): void {
    banco()?.prepare("UPDATE li_post SET status = 'agendado', tentativas = 0, erro = NULL, reservado_em = NULL WHERE id = ? AND status = 'erro'").run(id);
}

/** Nomes das mídias que a fila do LinkedIn ainda vai usar, para a limpeza diária não apagar. */
export function midiasEmUsoNoLinkedin(): string[] {
    const linhas = (banco()?.prepare("SELECT midias FROM li_post WHERE status IN ('agendado', 'publicando', 'erro')").all() as { midias: string }[] | undefined) ?? [];
    return linhas.flatMap((l) => JSON.parse(l.midias) as string[]);
}

/**
 * Publica os posts cujo horário venceu, com a mesma proteção do Instagram: reserva antes de sair,
 * três tentativas e o erro gravado para aparecer no painel.
 */
export async function publicarVencidosDoLinkedin(agora = new Date()): Promise<{ publicados: number; erros: number }> {
    const db = banco();
    const conta = tokenDoLinkedin();
    if (!db || !conta) return { publicados: 0, erros: 0 };

    db.prepare("UPDATE li_post SET status = 'agendado' WHERE status = 'publicando' AND reservado_em < ?").run(new Date(agora.getTime() - 15 * 60e3).toISOString());
    const vencidos = (db.prepare(`SELECT ${COLUNAS} FROM li_post WHERE status = 'agendado' AND quando_utc <= ? ORDER BY quando_utc LIMIT 5`).all(agora.toISOString()) as LinhaBruta[]).map(ler);
    let publicados = 0;
    let erros = 0;

    for (const post of vencidos) {
        const reservado = db.prepare("UPDATE li_post SET status = 'publicando', reservado_em = ?, tentativas = tentativas + 1 WHERE id = ? AND status = 'agendado'").run(agora.toISOString(), post.id);
        if (reservado.changes !== 1) continue;
        try {
            if (Date.parse(conta.expira_em) <= agora.getTime()) throw new ErroDoLinkedin("O token do LinkedIn venceu. Gere outro e conecte a conta de novo.");
            const imagens = post.midias.map((nome, i) => {
                const caminho = caminhoDaMidia(nome);
                if (!caminho) throw new ErroDoLinkedin(`A imagem ${i + 1} não está mais na pasta de mídias.`);
                return { bytes: readFileSync(caminho), descricao: `${post.titulo}, imagem ${i + 1} de ${post.midias.length}` };
            });
            const urn = await publicarNoLinkedin(conta.token, conta.pessoa_urn, post.texto, imagens);
            db.prepare("UPDATE li_post SET status = 'publicado', post_urn = ?, publicado_em = ?, erro = NULL WHERE id = ?").run(urn, new Date().toISOString(), post.id);
            publicados++;
        } catch (e) {
            const mensagem = semTokenDoLinkedin(e instanceof Error ? e.message : "erro desconhecido", conta.token).slice(0, 500);
            const esgotou = post.tentativas + 1 >= MAX_TENTATIVAS;
            db.prepare("UPDATE li_post SET status = ?, erro = ? WHERE id = ?").run(esgotou ? "erro" : "agendado", mensagem, post.id);
            erros++;
        }
    }
    return { publicados, erros };
}

