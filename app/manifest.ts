import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Rugemtugem: integração de sistemas e soluções em IA",
        short_name: "Rugemtugem",
        description:
            "A Rugemtugem conecta site, WhatsApp e sistemas da sua empresa e cria soluções em IA para o trabalho manual sumir.",
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
