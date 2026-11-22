import type { MetadataRoute } from "next";
import { CASOS } from "@/data/casos";
import { SERVICOS } from "@/data/servicos";
import { postsPublicados } from "@/lib/blog";

const BASE = "https://rugemtugem.dev";

export const revalidate = 300;

/** Só URLs reais. Âncoras da home não entram, e o /resume fica de fora (noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
    const agora = new Date();
    const pagina = (caminho: string, priority: number): MetadataRoute.Sitemap[number] => ({
        url: `${BASE}${caminho}`,
        lastModified: agora,
        changeFrequency: "monthly",
        priority,
    });

    return [
        pagina("", 1),
        pagina("/servicos", 0.9),
        ...SERVICOS.map((s) => pagina(`/servicos/${s.slug}`, 0.8)),
        pagina("/casos", 0.9),
        ...CASOS.map((c) => pagina(`/casos/${c.slug}`, 0.8)),
        pagina("/projetos", 0.8),
        pagina("/blog", 0.7),
        ...postsPublicados()
            .filter((post) => !post.rascunho)
            .map((post) => ({ ...pagina(`/blog/${post.slug}`, 0.7), lastModified: new Date(post.publicadoEm) })),
        pagina("/privacidade", 0.2),
    ];
}
