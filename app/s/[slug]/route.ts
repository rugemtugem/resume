import { banco } from "@/lib/db";
import { postsPublicados } from "@/lib/blog";
import { roteiroPorSlug } from "@/lib/social";
import { destinoDoStory, diaDeBrasilia, ehRobo } from "@/lib/social/story";

export const dynamic = "force-dynamic";

/**
 * Link do adesivo dos stories: soma um clique por roteiro e por dia e leva para a página do site.
 * Guarda só a contagem: sem IP, sem cookie, nada que identifique a pessoa. Se o banco falhar, o link funciona igual.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const arquivo = roteiroPorSlug(slug);
    const postNoAr = Boolean(arquivo) && postsPublicados().some((p) => p.slug === slug);
    const destino = destinoDoStory({ slug: arquivo ? slug : "", link: arquivo?.roteiro.link ?? "", postNoAr });

    if (arquivo && !ehRobo(request.headers.get("user-agent"))) {
        try {
            banco()?.prepare("INSERT INTO story_clique (dia, slug, cliques) VALUES (?, ?, 1) ON CONFLICT(dia, slug) DO UPDATE SET cliques = cliques + 1").run(diaDeBrasilia(), slug);
        } catch (erro) {
            console.error("Clique do story não contado:", erro instanceof Error ? erro.message : erro);
        }
    }
    // Location relativo: o navegador resolve no endereço que a pessoa abriu, atrás do proxy ou em localhost.
    return new Response(null, { status: 302, headers: { Location: destino, "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
