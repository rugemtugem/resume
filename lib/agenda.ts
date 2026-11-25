import { banco } from "@/lib/db";

export interface LinhaDaAgenda {
    slug: string;
    titulo: string;
    quando_utc: string;
    status: "pendente" | "aprovado" | "publicado";
    aprovado_em: string | null;
    publicado_em: string | null;
}

/** Hora atual em milissegundos. A página do painel é montada no servidor a cada pedido. */
export function horaAtual(): number {
    return Date.now();
}

/** Todas as linhas da Agenda do blog, por slug. */
export function agendaDoBlog(): Record<string, LinhaDaAgenda> {
    const db = banco();
    if (!db) return {};
    const linhas = db.prepare("SELECT slug, titulo, quando_utc, status, aprovado_em, publicado_em FROM blog_agenda").all() as LinhaDaAgenda[];
    return Object.fromEntries(linhas.map((l) => [l.slug, l]));
}

export function aprovarPost(slug: string, titulo: string, quandoUtc: string): void {
    const db = banco();
    if (!db) throw new Error("Banco indisponível");
    db.prepare(
        `INSERT INTO blog_agenda (slug, titulo, quando_utc, status, aprovado_em) VALUES (?, ?, ?, 'aprovado', ?)
         ON CONFLICT(slug) DO UPDATE SET titulo = excluded.titulo, quando_utc = excluded.quando_utc, status = 'aprovado',
           aprovado_em = excluded.aprovado_em, publicado_em = NULL, erro = NULL`,
    ).run(slug, titulo, quandoUtc, new Date().toISOString());
}

export function desaprovarPost(slug: string): void {
    const db = banco();
    if (!db) throw new Error("Banco indisponível");
    db.prepare("UPDATE blog_agenda SET status = 'pendente', aprovado_em = NULL, publicado_em = NULL WHERE slug = ?").run(slug);
}

/** Marca como publicados os posts aprovados cujo horário venceu. Devolve os slugs que entraram no ar agora. */
export function publicarVencidos(agora = new Date()): string[] {
    const db = banco();
    if (!db) return [];
    const vencidos = db.prepare("SELECT slug FROM blog_agenda WHERE status = 'aprovado' AND quando_utc <= ?").all(agora.toISOString()) as { slug: string }[];
    const marcar = db.prepare("UPDATE blog_agenda SET status = 'publicado', publicado_em = ? WHERE slug = ?");
    for (const { slug } of vencidos) marcar.run(agora.toISOString(), slug);
    return vencidos.map((v) => v.slug);
}

/** Registra que o agendador passou, com um resumo do que fez. */
export function registrarBatimento(linha: string): void {
    banco()
        ?.prepare("INSERT INTO batimento (id, em, linha) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET em = excluded.em, linha = excluded.linha")
        .run(new Date().toISOString(), linha);
}

export function ultimoBatimento(): { em: string; linha: string } | null {
    return (banco()?.prepare("SELECT em, linha FROM batimento WHERE id = 1").get() as { em: string; linha: string } | undefined) ?? null;
}

/** Trava simples para o agendador não rodar duas vezes ao mesmo tempo. Vale por dois minutos. */
export function pegarTrava(nome: string): boolean {
    const db = banco();
    if (!db) return false;
    const agora = new Date();
    const atual = db.prepare("SELECT ate FROM trava WHERE nome = ?").get(nome) as { ate: string } | undefined;
    if (atual && atual.ate > agora.toISOString()) return false;
    db.prepare("INSERT INTO trava (nome, ate) VALUES (?, ?) ON CONFLICT(nome) DO UPDATE SET ate = excluded.ate").run(nome, new Date(agora.getTime() + 120e3).toISOString());
    return true;
}

export function soltarTrava(nome: string): void {
    banco()?.prepare("DELETE FROM trava WHERE nome = ?").run(nome);
}
