import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { join } from "node:path";
import sharp from "sharp";
import { PASTA_DE_DADOS } from "@/lib/db";
import { NOME_DE_MIDIA } from "@/lib/instagram/regras";

/**
 * Mídias que o Instagram baixa por endereço público. Ficam na pasta de dados (o volume do servidor),
 * e não em public/, porque o container é recriado a cada deploy.
 */
export const PASTA_DE_MIDIA = join(PASTA_DE_DADOS, "midia");

/** Recebe a imagem enviada, converte para JPEG (o Instagram não aceita PNG) e devolve o nome do arquivo. */
export async function salvarImagem(dados: Buffer, prefixo: string): Promise<string> {
    if (!existsSync(PASTA_DE_MIDIA)) mkdirSync(PASTA_DE_MIDIA, { recursive: true });
    const imagem = sharp(dados, { failOn: "error" });
    const meta = await imagem.metadata();
    if (!meta.width || !meta.height) throw new Error("O arquivo enviado não é uma imagem.");
    const proporcao = meta.width / meta.height;
    if (proporcao < 0.79 || proporcao > 1.92) {
        throw new Error(`Imagem de ${meta.width} x ${meta.height} fica fora da proporção aceita pelo Instagram (de 4:5 a 1,91:1).`);
    }
    const limpo = prefixo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "midia";
    const nome = `${limpo}-${randomBytes(5).toString("hex")}.jpg`;
    await imagem.flatten({ background: "#ffffff" }).jpeg({ quality: 90 }).toFile(join(PASTA_DE_MIDIA, nome));
    return nome;
}

export function caminhoDaMidia(nome: string): string | null {
    if (!NOME_DE_MIDIA.test(nome)) return null;
    const caminho = join(PASTA_DE_MIDIA, nome);
    return existsSync(caminho) ? caminho : null;
}

/** Endereço público da mídia. É este que a API do Instagram baixa. */
export function enderecoDaMidia(nome: string): string {
    const site = (process.env.SITE_URL || "https://rugemtugem.dev").replace(/\/+$/, "");
    return `${site}/m/${nome}`;
}

/** Apaga mídias com mais de 48 horas que nenhum post da fila usa. */
export function limparOrfas(emUso: Set<string>): number {
    if (!existsSync(PASTA_DE_MIDIA)) return 0;
    const limite = Date.now() - 48 * 3600e3;
    let apagadas = 0;
    for (const nome of readdirSync(PASTA_DE_MIDIA)) {
        if (!NOME_DE_MIDIA.test(nome) || emUso.has(nome)) continue;
        const caminho = join(PASTA_DE_MIDIA, nome);
        if (statSync(caminho).mtimeMs < limite) {
            unlinkSync(caminho);
            apagadas++;
        }
    }
    return apagadas;
}
