import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "images.clerk.dev",
            },
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
            },
        ],
    },
    async headers() {
        return [
            {
                // Espaces privés : les layouts sont des Client Components et ne
                // peuvent pas exporter `metadata`, on passe donc par l'en-tête.
                source: "/:path(account|admin|dashboard|api)/:rest*",
                headers: [
                    {
                        key: "X-Robots-Tag",
                        value: "noindex, nofollow, noarchive",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
