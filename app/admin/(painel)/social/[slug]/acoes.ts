"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin/sessao";
import { brasiliaParaUtc } from "@/lib/admin/seguranca";
import { aprovarPost } from "@/lib/agenda";
import { todosOsPosts } from "@/lib/blog";
import { agendarPost, cancelarCarrosseisDoSlug } from "@/lib/instagram/fila";
import { salvarImagem } from "@/lib/instagram/midia";
import { roteiroPorSlug } from "@/lib/social";
import { imagemDoSlide } from "@/lib/social/slide";

export interface Retorno {
    erro: string | null;
    ok: string | null;
}

/**
 * Aprovação única: aprova o post do blog (se o roteiro tiver um) e agenda o carrossel no mesmo horário.
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
        if (post) aprovarPost(post.slug, post.titulo, quando);

        for (const caminho of ["/", "/blog", `/blog/${slug}`, "/blog/rss.xml", "/sitemap.xml", "/admin", "/admin/instagram", `/admin/social/${slug}`]) revalidatePath(caminho);
        const partes = [post ? "Post do blog aprovado." : "", `Carrossel de ${nomes.length} slides agendado.`, trocados > 0 ? "O carrossel que estava na fila foi trocado por este." : ""];
        return { erro: null, ok: partes.filter(Boolean).join(" ") };
    } catch (e) {
        return { erro: e instanceof Error ? e.message : "Não foi possível agendar.", ok: null };
    }
}
