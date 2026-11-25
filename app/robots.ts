import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/admin", "/m/", "/s/"],
            },
        ],
        sitemap: "https://rugemtugem.dev/sitemap.xml",
    };
}
