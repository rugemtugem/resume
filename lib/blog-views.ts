import { banco } from "@/lib/db";
import { diaDeBrasilia } from "@/lib/social/story";

/** Contador próprio de leituras, para a lista "Mais lidos". Guarda só o número por post, sem dado de quem leu. */
export function leituras(): Record<string, number> {
    const linhas = (banco()?.prepare("SELECT slug, total FROM blog_leitura").all() as { slug: string; total: number }[] | undefined) ?? [];
    return Object.fromEntries(linhas.map((l) => [l.slug, l.total]));
}

/** Soma um pedido de contato ao dia, com o canal que a pessoa marcou. Só a contagem: nome, e-mail e mensagem não são guardados. */
export function contarLead(origem: string): void {
    try {
        banco()?.prepare("INSERT INTO lead_dia (dia, origem, total) VALUES (?, ?, 1) ON CONFLICT(dia, origem) DO UPDATE SET total = total + 1").run(diaDeBrasilia(), origem);
    } catch (erro) {
        console.error("Pedido de contato não contado:", erro instanceof Error ? erro.message : erro);
    }
}

export function contarLeitura(slug: string): void {
    const db = banco();
    if (!db) return;
    db.prepare("INSERT INTO blog_leitura (slug, total) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET total = total + 1").run(slug);
    // A mesma leitura entra na contagem por dia, que alimenta o painel de métricas.
    db.prepare("INSERT INTO blog_leitura_dia (dia, slug, total) VALUES (?, ?, 1) ON CONFLICT(dia, slug) DO UPDATE SET total = total + 1").run(diaDeBrasilia(), slug);
}
