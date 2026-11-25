import { banco } from "@/lib/db";

/** Contador próprio de leituras, para a lista "Mais lidos". Guarda só o número por post, sem dado de quem leu. */
export function leituras(): Record<string, number> {
    const linhas = (banco()?.prepare("SELECT slug, total FROM blog_leitura").all() as { slug: string; total: number }[] | undefined) ?? [];
    return Object.fromEntries(linhas.map((l) => [l.slug, l.total]));
}

export function contarLeitura(slug: string): void {
    banco()?.prepare("INSERT INTO blog_leitura (slug, total) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET total = total + 1").run(slug);
}
