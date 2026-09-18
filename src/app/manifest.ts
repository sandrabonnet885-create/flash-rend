import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

/** Généré à /manifest.webmanifest (PWA + critère Lighthouse). */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteConfig.title,
        short_name: siteConfig.name,
        description: siteConfig.description,
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0a0a0a",
        theme_color: "#0a0a0a",
        lang: siteConfig.lang,
        dir: "ltr",
        categories: ["finance", "business"],
        icons: [
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/logo.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
