import { ImageResponse } from "next/og";
import { CATEGORIAS, postPorSlug } from "@/lib/blog";
import { fontesDaMarca } from "@/lib/social/slide";

export const revalidate = 300;

/**
 * Gerador de miniatura do post (1200 x 630), no desenho escuro da marca.
 * Usa a linha "> CAPA:" do arquivo: selo, trecho em destaque do título, até dois dados e uma nota.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = postPorSlug(slug);
    if (!post) return new Response("Post não encontrado", { status: 404 });

    const titulo = post.tituloSeo;
    const trecho = post.capa.destaque && titulo.includes(post.capa.destaque) ? post.capa.destaque : titulo.split(" ").slice(-3).join(" ");
    const posicao = titulo.lastIndexOf(trecho);
    const palavras = [
        ...titulo.slice(0, posicao).split(/\s+/).filter(Boolean).map((texto) => ({ texto, destaque: false })),
        ...trecho.split(/\s+/).filter(Boolean).map((texto) => ({ texto, destaque: true })),
        ...titulo.slice(posicao + trecho.length).split(/\s+/).filter(Boolean).map((texto) => ({ texto, destaque: false })),
    ];
    const selo = post.capa.selo || CATEGORIAS[post.categoria].nome;
    const chips = post.capa.chips.slice(0, 2);
    const tamanho = titulo.length > 60 ? 54 : titulo.length > 40 ? 64 : 76;

    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#1a202c", color: "#f7fafc", fontFamily: "Inter", position: "relative" }}>
                <div style={{ position: "absolute", top: -180, right: -120, width: 560, height: 560, borderRadius: 560, background: "#992A2B", opacity: 0.35, filter: "blur(90px)", display: "flex" }} />
                <div style={{ position: "absolute", bottom: -220, left: -100, width: 520, height: 520, borderRadius: 520, background: "#EE6936", opacity: 0.22, filter: "blur(90px)", display: "flex" }} />

                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, border: "2px solid #4a5568", background: "#2d3748", fontSize: 26, fontWeight: 600 }}>{selo}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", fontSize: tamanho, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1 }}>
                        {palavras.map((p, i) => (
                            <span key={i} style={{ marginRight: tamanho * 0.26, color: p.destaque ? "#ff8a5b" : "#f7fafc" }}>
                                {p.texto}
                            </span>
                        ))}
                    </div>
                    {chips.length > 0 && (
                        <div style={{ display: "flex", marginTop: 36 }}>
                            {chips.map((chip) => (
                                <div key={chip.rotulo} style={{ display: "flex", flexDirection: "column", marginRight: 20, padding: "16px 24px", borderRadius: 20, border: "2px solid #4a5568", background: "rgba(45,55,72,0.85)" }}>
                                    <span style={{ fontSize: 22, color: "#cbd5e0" }}>{chip.rotulo}</span>
                                    <span style={{ fontSize: 34, fontWeight: 800 }}>{chip.valor}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 }}>
                    <span style={{ color: "#cbd5e0" }}>{post.capa.nota || `${post.minutos} min de leitura`}</span>
                    <span style={{ fontWeight: 800 }}>rugemtugem.dev</span>
                </div>
            </div>
        ),
        { width: 1200, height: 630, fonts: fontesDaMarca() },
    );
}
