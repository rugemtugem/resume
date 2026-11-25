import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { banco } from "@/lib/db";
import { problemasDaLegenda } from "@/lib/instagram/regras";
import { problemasDoTexto } from "@/lib/linkedin/regras";
import { lerRoteiro, problemasDoRoteiro } from "@/lib/social/roteiro";
import type { Roteiro } from "@/lib/social/roteiro";

const PASTA = join(process.cwd(), "content", "social");
const SLUG = /^[a-z0-9-]{1,80}$/;

export interface RoteiroDoArquivo {
    slug: string;
    roteiro: Roteiro;
    problemas: string[];
}

function carregar(slug: string): RoteiroDoArquivo {
    const roteiro = lerRoteiro(readFileSync(join(PASTA, `${slug}.md`), "utf8"));
    const problemas = [...problemasDoRoteiro(roteiro), ...(roteiro.legenda ? problemasDaLegenda(roteiro.legenda) : []), ...(roteiro.linkedin ? problemasDoTexto(roteiro.linkedin) : [])];
    return { slug, roteiro, problemas };
}

/** Roteiro de um slug, ou null se o arquivo não existir. */
export function roteiroPorSlug(slug: string): RoteiroDoArquivo | null {
    if (!SLUG.test(slug) || !existsSync(join(PASTA, `${slug}.md`))) return null;
    return carregar(slug);
}

/** Cliques no link do story de um roteiro: total e por dia (os 14 dias mais recentes com clique). */
export function cliquesDoStory(slug: string): { total: number; dias: { dia: string; cliques: number }[] } {
    try {
        const dias = (banco()?.prepare("SELECT dia, cliques FROM story_clique WHERE slug = ? ORDER BY dia DESC LIMIT 14").all(slug) as { dia: string; cliques: number }[] | undefined) ?? [];
        const total = (banco()?.prepare("SELECT COALESCE(SUM(cliques), 0) AS n FROM story_clique WHERE slug = ?").get(slug) as { n: number } | undefined)?.n ?? 0;
        return { total, dias };
    } catch {
        return { total: 0, dias: [] };
    }
}

/** Endereço que vai no adesivo de link do story. */
export function linkDoStory(slug: string): string {
    return `${(process.env.SITE_URL || "https://rugemtugem.dev").replace(/\/+$/, "")}/s/${slug}`;
}

/** Todos os roteiros da pasta content/social. */
export function roteirosSociais(): RoteiroDoArquivo[] {
    if (!existsSync(PASTA)) return [];
    return readdirSync(PASTA)
        .filter((nome) => nome.endsWith(".md") && SLUG.test(nome.slice(0, -3)))
        .map((nome) => carregar(nome.slice(0, -3)))
        .sort((a, b) => a.slug.localeCompare(b.slug));
}
