import type { MetadataRoute } from "next";
import { absoluteUrl, privateRoutes, siteConfig } from "@/lib/seo";

/** Généré à /robots.txt. */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // Sans slash final : bloque aussi bien /account que /account/settings.
                disallow: [...privateRoutes],
            },
            // Crawlers d'IA génératives : exclus par défaut, à retirer si besoin.
            {
                userAgent: ["GPTBot", "CCBot", "ClaudeBot", "Google-Extended"],
                disallow: "/",
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
        host: siteConfig.url,
    };
}
