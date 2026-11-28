import { adminLogado } from "@/lib/admin/sessao";
import { roteiroPorSlug } from "@/lib/social";
import { imagemDoSlide } from "@/lib/social/slide";

export const dynamic = "force-dynamic";

/** Prévia de um slide do carrossel (1080 x 1350). Com ?rede=linkedin, o card do LinkedIn. Só para quem está logado no painel. */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string; n: string }> }) {
    if (!(await adminLogado())) return new Response("Entre no painel para ver a prévia.", { status: 401 });
    const { slug, n } = await params;
    const arquivo = roteiroPorSlug(slug);
    const indice = Number(n) - 1;
    if (!arquivo || !Number.isInteger(indice) || indice < 0 || indice >= arquivo.roteiro.slides.length) return new Response("Slide não encontrado", { status: 404 });

    const rede = new URL(request.url).searchParams.get("rede") === "linkedin" ? "linkedin" : "instagram";
    const imagem = imagemDoSlide(arquivo.roteiro, indice, rede);
    return new Response(await imagem.arrayBuffer(), { headers: { "Content-Type": "image/png", "Cache-Control": "no-store" } });
}
