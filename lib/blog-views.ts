import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Contador próprio de leituras, para a lista "Mais lidos". Guarda só o número por post, sem dado de quem leu.
 * Fica em DATA_DIR (no servidor, o volume). No Passo 3 passa para o banco da Agenda.
 */
const PASTA = process.env.DATA_DIR || join(process.cwd(), ".dados");
const ARQUIVO = join(PASTA, "blog-leituras.json");

export function leituras(): Record<string, number> {
    try {
        return JSON.parse(readFileSync(ARQUIVO, "utf8")) as Record<string, number>;
    } catch {
        return {};
    }
}

export function contarLeitura(slug: string): void {
    try {
        if (!existsSync(PASTA)) mkdirSync(PASTA, { recursive: true });
        const atual = leituras();
        atual[slug] = (atual[slug] || 0) + 1;
        writeFileSync(ARQUIVO, JSON.stringify(atual));
    } catch {
        // Sem permissão de escrita, o blog segue funcionando sem a lista de mais lidos.
    }
}
