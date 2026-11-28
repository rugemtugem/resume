import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { adminLogado } from "@/lib/admin/sessao";
import { PASTA_DE_DADOS } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Entrega uma trilha de música para o gerador de Reels. As trilhas (livres, do Mixkit) ficam na pasta de dados,
 * fora do repositório, e só são servidas para quem está logado: o painel usa, mas elas não ficam para download público.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ nome: string }> }) {
    if (!(await adminLogado())) return new Response("Entre no painel.", { status: 401 });
    const { nome } = await params;
    if (!/^[a-z0-9-]{1,40}$/.test(nome)) return new Response("Não encontrado", { status: 404 });
    const caminho = join(PASTA_DE_DADOS, "trilhas", `${nome}.mp3`);
    if (!existsSync(caminho)) return new Response("Não encontrado", { status: 404 });
    return new Response(new Uint8Array(readFileSync(caminho)), { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, max-age=3600" } });
}
