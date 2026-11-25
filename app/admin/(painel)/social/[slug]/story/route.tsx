import { adminLogado } from "@/lib/admin/sessao";
import { roteiroPorSlug } from "@/lib/social";
import { imagemDoStory } from "@/lib/social/slide";

export const dynamic = "force-dynamic";

/** Imagem do story (1080 x 1920). Com ?baixar=1 o navegador salva o arquivo em vez de abrir. */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    if (!(await adminLogado())) return new Response("Entre no painel para ver o story.", { status: 401 });
    const { slug } = await params;
    const arquivo = roteiroPorSlug(slug);
    if (!arquivo || arquivo.roteiro.slides.length === 0) return new Response("Roteiro não encontrado", { status: 404 });

    const cabecalhos: Record<string, string> = { "Content-Type": "image/png", "Cache-Control": "no-store" };
    if (new URL(request.url).searchParams.has("baixar")) cabecalhos["Content-Disposition"] = `attachment; filename="story-${slug}.png"`;
    return new Response(await imagemDoStory(arquivo.roteiro).arrayBuffer(), { headers: cabecalhos });
}
