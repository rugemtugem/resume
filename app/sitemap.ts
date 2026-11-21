import type { MetadataRoute } from "next";

/** Só URLs reais. Âncoras da home não entram, e o /resume fica de fora (noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://rugemtugem.dev",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
    ];
}
