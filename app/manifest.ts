import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Fábio Soares — Especialista em Tecnologia & IA",
        short_name: "Fábio Soares",
        description:
            "Transformo ideias em produtos digitais que vendem — com código limpo, design estratégico e Inteligência Artificial.",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a1a",
        theme_color: "#6366f1",
        icons: [
            {
                src: "/images/favicon.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/images/favicon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
