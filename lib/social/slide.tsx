import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { palavrasDoTitulo } from "@/lib/social/roteiro";
import type { Roteiro, Slide } from "@/lib/social/roteiro";

/** Tamanho do card do feed do Instagram (4:5). */
export const LARGURA = 1080;
export const ALTURA = 1350;

const COR = {
    fundo: "#1a202c",
    painel: "#2d3748",
    linha: "#4a5568",
    texto: "#f7fafc",
    suave: "#cbd5e0",
    vinho: "#992A2B",
    vinhoClaro: "#ff6b6b",
    laranja: "#EE6936",
    laranjaClaro: "#ff8a5b",
};

type Peso = 400 | 600 | 800;
let fontes: { name: string; data: Buffer; weight: Peso; style: "normal" }[] | null = null;

/** Inter em três pesos, lida do disco uma vez. Sem isso a imagem sai sem negrito. */
export function fontesDaMarca() {
    if (!fontes) {
        fontes = ([400, 600, 800] as Peso[]).map((weight) => ({
            name: "Inter",
            data: readFileSync(join(process.cwd(), "lib", "social", "fontes", `inter-latin-${weight}-normal.woff`)),
            weight,
            style: "normal" as const,
        }));
    }
    return fontes;
}

function Titulo({ texto, tamanho }: { texto: string; tamanho: number }) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: tamanho, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.5 }}>
            {palavrasDoTitulo(texto).map((p, i) => (
                <span key={i} style={{ marginRight: tamanho * 0.26, color: p.destaque ? COR.laranjaClaro : COR.texto }}>
                    {p.texto}
                </span>
            ))}
        </div>
    );
}

const tamanhoDoTitulo = (texto: string, grande: number) => (texto.length > 80 ? grande * 0.72 : texto.length > 50 ? grande * 0.85 : grande);

function Corpo({ slide }: { slide: Slide }) {
    if (slide.tipo === "capa") {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Titulo texto={slide.titulo} tamanho={tamanhoDoTitulo(slide.titulo, 104)} />
                {slide.nota && <div style={{ display: "flex", marginTop: 44, fontSize: 44, lineHeight: 1.3, color: COR.suave }}>{slide.nota}</div>}
            </div>
        );
    }
    if (slide.tipo === "pontos") {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Titulo texto={slide.titulo} tamanho={tamanhoDoTitulo(slide.titulo, 72)} />
                <div style={{ display: "flex", flexDirection: "column", marginTop: 48 }}>
                    {slide.linhas.map((linha, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 22, padding: "28px 32px", borderRadius: 28, border: `2px solid ${COR.linha}`, background: COR.painel }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 68, height: 68, borderRadius: 68, marginRight: 28, background: COR.vinho, fontSize: 36, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                            <div style={{ display: "flex", flex: 1, fontSize: 42, lineHeight: 1.25 }}>{linha}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    if (slide.tipo === "numero") {
        const tamanho = slide.valor.length <= 4 ? 300 : slide.valor.length <= 6 ? 230 : slide.valor.length <= 8 ? 180 : 150;
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: tamanho, fontWeight: 800, lineHeight: 1, letterSpacing: -4, color: COR.laranjaClaro }}>{slide.valor}</div>
                <div style={{ display: "flex", marginTop: 36 }}>
                    <Titulo texto={slide.titulo} tamanho={tamanhoDoTitulo(slide.titulo, 64)} />
                </div>
                {slide.nota && <div style={{ display: "flex", marginTop: 28, fontSize: 42, lineHeight: 1.3, color: COR.suave }}>{slide.nota}</div>}
                <div style={{ display: "flex", marginTop: 40, paddingTop: 28, borderTop: `2px solid ${COR.linha}`, fontSize: 34, lineHeight: 1.3, color: COR.suave }}>Fonte: {slide.fonte}</div>
            </div>
        );
    }
    if (slide.tipo === "duo") {
        const painel = (rotulo: string, texto: string, cor: string) => (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 28, padding: "36px 40px", borderRadius: 32, border: `3px solid ${cor}`, background: COR.painel }}>
                <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: cor }}>{rotulo}</div>
                <div style={{ display: "flex", marginTop: 14, fontSize: 46, fontWeight: 600, lineHeight: 1.25 }}>{texto}</div>
            </div>
        );
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Titulo texto={slide.titulo} tamanho={tamanhoDoTitulo(slide.titulo, 72)} />
                <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
                    {painel("Antes", slide.antes, COR.laranjaClaro)}
                    {painel("Depois", slide.depois, COR.vinhoClaro)}
                </div>
            </div>
        );
    }
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Titulo texto={slide.titulo} tamanho={tamanhoDoTitulo(slide.titulo, 88)} />
            {slide.nota && <div style={{ display: "flex", marginTop: 36, fontSize: 44, lineHeight: 1.3, color: COR.suave }}>{slide.nota}</div>}
            <div style={{ display: "flex", marginTop: 56 }}>
                <div style={{ display: "flex", padding: "30px 48px", borderRadius: 999, background: COR.laranja, fontSize: 46, fontWeight: 800 }}>{slide.botao || "Diagnóstico gratuito"}</div>
            </div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 40, color: COR.suave }}>O link está na bio.</div>
        </div>
    );
}

/**
 * Desenha o story (1080 x 1920) a partir da capa do roteiro. Zona segura: 250 no topo e 340 no rodapé,
 * onde o Instagram põe os próprios botões. O quadro tracejado marca onde colar o adesivo de link.
 */
export function imagemDoStory(roteiro: Roteiro): ImageResponse {
    const capa = roteiro.slides[0];
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "250px 72px 340px", background: COR.fundo, color: COR.texto, fontFamily: "Inter", position: "relative" }}>
                <div style={{ position: "absolute", top: -200, right: -220, width: 820, height: 820, borderRadius: 820, background: COR.vinho, opacity: 0.4, filter: "blur(130px)", display: "flex" }} />
                <div style={{ position: "absolute", bottom: -240, left: -200, width: 760, height: 760, borderRadius: 760, background: COR.laranja, opacity: 0.22, filter: "blur(130px)", display: "flex" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", padding: "14px 32px", borderRadius: 999, border: `2px solid ${COR.linha}`, background: COR.painel, fontSize: 36, fontWeight: 600 }}>{roteiro.categoria || "Rugemtugem"}</div>
                    <div style={{ display: "flex", fontSize: 36, fontWeight: 800 }}>rugemtugem.dev</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Titulo texto={capa.titulo} tamanho={tamanhoDoTitulo(capa.titulo, 112)} />
                    {capa.nota && <div style={{ display: "flex", marginTop: 48, fontSize: 48, lineHeight: 1.3, color: COR.suave }}>{capa.nota}</div>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ display: "flex", fontSize: 44, fontWeight: 600 }}>Toque no link para ver</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 28, width: 640, height: 150, borderRadius: 36, border: `4px dashed ${COR.linha}`, fontSize: 34, color: COR.linha }}>adesivo de link aqui</div>
                </div>
            </div>
        ),
        { width: LARGURA, height: 1920, fonts: fontesDaMarca() },
    );
}

/** Desenha um slide do carrossel. O índice começa em zero. */
export function imagemDoSlide(roteiro: Roteiro, indice: number): ImageResponse {
    const slide = roteiro.slides[indice];
    const total = roteiro.slides.length;
    const ultimo = indice === total - 1;

    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: COR.fundo, color: COR.texto, fontFamily: "Inter", position: "relative" }}>
                <div style={{ position: "absolute", top: -220, right: -180, width: 680, height: 680, borderRadius: 680, background: COR.vinho, opacity: 0.38, filter: "blur(110px)", display: "flex" }} />
                <div style={{ position: "absolute", bottom: -260, left: -160, width: 620, height: 620, borderRadius: 620, background: COR.laranja, opacity: 0.2, filter: "blur(110px)", display: "flex" }} />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex" }}>
                        {roteiro.slides.map((_, i) => (
                            <div key={i} style={{ display: "flex", flex: 1, height: 8, borderRadius: 8, marginRight: i === total - 1 ? 0 : 10, background: i <= indice ? COR.laranjaClaro : COR.linha }} />
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                        <div style={{ display: "flex", padding: "12px 28px", borderRadius: 999, border: `2px solid ${COR.linha}`, background: COR.painel, fontSize: 32, fontWeight: 600 }}>{roteiro.categoria || "Rugemtugem"}</div>
                        <div style={{ display: "flex", fontSize: 32, fontWeight: 600, color: COR.suave }}>
                            {indice + 1} de {total}
                        </div>
                    </div>
                </div>

                <Corpo slide={slide} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 34 }}>
                    <span style={{ fontWeight: 800 }}>rugemtugem.dev</span>
                    <span style={{ color: COR.suave }}>{ultimo ? "Fábio Rugemtugem" : "Arraste para o lado"}</span>
                </div>
            </div>
        ),
        { width: LARGURA, height: ALTURA, fonts: fontesDaMarca() },
    );
}
