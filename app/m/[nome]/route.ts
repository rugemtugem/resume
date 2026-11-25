import { readFileSync, statSync } from "node:fs";
import { caminhoDaMidia } from "@/lib/instagram/midia";
import { TIPOS_DE_MIDIA } from "@/lib/instagram/regras";

export const dynamic = "force-dynamic";

/** Entrega a mídia que a API do Instagram baixa. O nome é conferido antes: só arquivos da pasta de mídias. */
export async function GET(_request: Request, { params }: { params: Promise<{ nome: string }> }) {
    const { nome } = await params;
    const caminho = caminhoDaMidia(nome);
    if (!caminho) return new Response("Não encontrado", { status: 404 });

    const extensao = nome.split(".").pop() as string;
    const tamanho = statSync(caminho).size;
    return new Response(new Uint8Array(readFileSync(caminho)), {
        headers: {
            "Content-Type": TIPOS_DE_MIDIA[extensao],
            "Content-Length": String(tamanho),
            "Cache-Control": "public, max-age=86400",
            "X-Robots-Tag": "noindex",
        },
    });
}
