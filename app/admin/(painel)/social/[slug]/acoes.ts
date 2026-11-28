"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { exigirAdmin } from "@/lib/admin/sessao";
import { brasiliaParaUtc } from "@/lib/admin/seguranca";
import { agendaDoBlog, aprovarPost } from "@/lib/agenda";
import { visivelNaAgenda } from "@/lib/admin/seguranca";
import { todosOsPosts } from "@/lib/blog";
import { agendarPost, cancelarCarrosseisDoSlug, cancelarReelsDoSlug } from "@/lib/instagram/fila";
import { caminhoDaMidia, salvarDocumento, salvarImagem } from "@/lib/instagram/midia";
import { agendarNoLinkedin, cancelarLinkedinDoSlug } from "@/lib/linkedin/fila";
import { comLink } from "@/lib/linkedin/regras";
import { roteiroPorSlug } from "@/lib/social";
import { pdfDeImagens } from "@/lib/social/pdf";
import { imagemDoSlide } from "@/lib/social/slide";

export interface Retorno {
    erro: string | null;
    ok: string | null;
}

/**
 * Aprovação única: aprova o post do blog (se o roteiro tiver um) e agenda o carrossel no mesmo horário.
 * Se o roteiro tiver texto para o LinkedIn e a caixa estiver marcada, agenda também o post de lá, com os cards do
 * LinkedIn em um documento (PDF), que a rede mostra como carrossel.
 * O agendador publica o blog antes do Instagram no mesmo ciclo, então o post já está no ar quando o carrossel sai.
 */
export async function acaoAprovarTudo(_anterior: Retorno, dados: FormData): Promise<Retorno> {
    await exigirAdmin();
    const slug = String(dados.get("slug") || "");
    const quando = brasiliaParaUtc(String(dados.get("quando") || ""));
    const arquivo = roteiroPorSlug(slug);
    if (!arquivo) return { erro: "Roteiro não encontrado.", ok: null };
    if (!quando) return { erro: "Escolha a data e a hora.", ok: null };
    if (arquivo.problemas.length > 0) return { erro: `Corrija o arquivo antes de aprovar: ${arquivo.problemas.join(" ")}`, ok: null };

    const post = todosOsPosts().find((p) => p.slug === slug);
    if (post?.rascunho) return { erro: "O post do blog ainda tem a linha Rascunho: sim. Tire a linha do arquivo para aprovar.", ok: null };

    try {
        // As imagens são geradas primeiro: se alguma falhar, nada é aprovado nem agendado pela metade.
        const nomes: string[] = [];
        for (let i = 0; i < arquivo.roteiro.slides.length; i++) {
            const png = Buffer.from(await imagemDoSlide(arquivo.roteiro, i).arrayBuffer());
            nomes.push(await salvarImagem(png, `${slug}-${i + 1}`));
        }
        const trocados = cancelarCarrosseisDoSlug(slug);
        agendarPost({ tipo: "carrossel", titulo: arquivo.roteiro.tema, slug, midias: nomes, legenda: arquivo.roteiro.legenda, quandoUtc: quando });
        // Post que já está no ar não é tocado: mudar a data dele para o horário do carrossel o tiraria do blog até lá.
        const postNoAr = visivelNaAgenda(agendaDoBlog()[slug]);
        if (post && !postNoAr) aprovarPost(post.slug, post.titulo, quando);

        const paraLinkedin = Boolean(arquivo.roteiro.linkedin) && dados.get("linkedin") === "sim";
        let trocadosNoLinkedin = 0;
        if (paraLinkedin) {
            const site = process.env.SITE_URL || "https://rugemtugem.dev";
            const caminho = arquivo.roteiro.link || (post ? `/blog/${slug}` : "/");
            trocadosNoLinkedin = cancelarLinkedinDoSlug(slug);
            // O LinkedIn recebe cards próprios, juntos em um PDF: ele mostra como carrossel, uma página inteira por vez.
            const paginas = [];
            for (let i = 0; i < arquivo.roteiro.slides.length; i++) {
                const png = Buffer.from(await imagemDoSlide(arquivo.roteiro, i, "linkedin").arrayBuffer());
                paginas.push({ jpeg: await sharp(png).flatten({ background: "#1a202c" }).jpeg({ quality: 90, progressive: false }).toBuffer(), largura: 1080, altura: 1350 });
            }
            const documento = salvarDocumento(pdfDeImagens(paginas, arquivo.roteiro.tema), `${slug.slice(0, 30)}-linkedin`);
            agendarNoLinkedin({ titulo: arquivo.roteiro.tema, slug, texto: comLink(arquivo.roteiro.linkedin, site, caminho, slug), midias: [documento], quandoUtc: quando });
        }

        for (const caminho of ["/", "/blog", `/blog/${slug}`, "/blog/rss.xml", "/sitemap.xml", "/admin", "/admin/instagram", "/admin/linkedin", `/admin/social/${slug}`]) revalidatePath(caminho);
        const partes = [post && !postNoAr ? "Post do blog aprovado." : "", `Carrossel de ${nomes.length} slides agendado.`, trocados > 0 ? "O carrossel que estava na fila foi trocado por este." : "", paraLinkedin ? "Post do LinkedIn agendado." : "", trocadosNoLinkedin > 0 ? "O post do LinkedIn que estava na fila foi trocado por este." : ""];
        return { erro: null, ok: partes.filter(Boolean).join(" ") };
    } catch (e) {
        return { erro: e instanceof Error ? e.message : "Não foi possível agendar.", ok: null };
    }
}

/**
 * Agenda o Reels do roteiro. O vídeo e a capa foram gerados no navegador e já estão na pasta de mídias
 * (enviados por /admin/midia); aqui chegam só os nomes. A legenda é a mesma do carrossel.
 */
export async function acaoAgendarReels(_anterior: Retorno, dados: FormData): Promise<Retorno> {
    await exigirAdmin();
    const slug = String(dados.get("slug") || "");
    const quando = brasiliaParaUtc(String(dados.get("quando") || ""));
    const video = String(dados.get("video") || "");
    const capa = String(dados.get("capa") || "");
    const arquivo = roteiroPorSlug(slug);
    if (!arquivo || !arquivo.roteiro.reels) return { erro: "Este roteiro não tem a seção do Reels.", ok: null };
    if (!quando) return { erro: "Escolha a data e a hora.", ok: null };
    if (arquivo.problemas.length > 0) return { erro: `Corrija o arquivo antes de agendar: ${arquivo.problemas.join(" ")}`, ok: null };
    if (!video.endsWith(".mp4") || !caminhoDaMidia(video) || !capa.endsWith(".jpg") || !caminhoDaMidia(capa)) return { erro: "O vídeo ou a capa não chegaram ao servidor. Gere o vídeo de novo.", ok: null };

    try {
        const trocados = cancelarReelsDoSlug(slug);
        agendarPost({ tipo: "reels", titulo: `${arquivo.roteiro.tema} (Reels)`, slug, midias: [video, capa], legenda: arquivo.roteiro.legenda, quandoUtc: quando });
        for (const caminho of ["/admin/instagram", `/admin/social/${slug}`]) revalidatePath(caminho);
        return { erro: null, ok: `Reels agendado.${trocados > 0 ? " O Reels que estava na fila foi trocado por este." : ""}` };
    } catch (e) {
        return { erro: e instanceof Error ? e.message : "Não foi possível agendar.", ok: null };
    }
}
