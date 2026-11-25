import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { problemasDaLegenda } from "@/lib/instagram/regras";
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
    const problemas = [...problemasDoRoteiro(roteiro), ...(roteiro.legenda ? problemasDaLegenda(roteiro.legenda) : [])];
    return { slug, roteiro, problemas };
}

/** Roteiro de um slug, ou null se o arquivo não existir. */
export function roteiroPorSlug(slug: string): RoteiroDoArquivo | null {
    if (!SLUG.test(slug) || !existsSync(join(PASTA, `${slug}.md`))) return null;
    return carregar(slug);
}

/** Todos os roteiros da pasta content/social. */
export function roteirosSociais(): RoteiroDoArquivo[] {
    if (!existsSync(PASTA)) return [];
    return readdirSync(PASTA)
        .filter((nome) => nome.endsWith(".md") && SLUG.test(nome.slice(0, -3)))
        .map((nome) => carregar(nome.slice(0, -3)))
        .sort((a, b) => a.slug.localeCompare(b.slug));
}
