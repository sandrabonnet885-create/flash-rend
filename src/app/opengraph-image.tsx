import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = "FlashRend - Investissement crypto simplifié et rapide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image de partage générée à la volée (Open Graph + Twitter).
 * Évite de servir le logo carré 3000x3000 qui est recadré par les réseaux.
 */
export default async function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background:
                        "linear-gradient(135deg, #0a0a0a 0%, #111827 55%, #1e1b4b 100%)",
                    padding: "72px 80px",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            background:
                                "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                        }}
                    />
                    <div
                        style={{
                            fontSize: 38,
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: -1,
                        }}
                    >
                        {siteConfig.name}
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            fontSize: 76,
                            fontWeight: 700,
                            color: "#ffffff",
                            lineHeight: 1.05,
                            letterSpacing: -2,
                        }}
                    >
                        Investissement crypto
                    </div>
                    <div
                        style={{
                            fontSize: 76,
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: -2,
                            color: "#fbbf24",
                        }}
                    >
                        simplifié et rapide
                    </div>
                    <div
                        style={{
                            marginTop: 28,
                            fontSize: 30,
                            color: "#cbd5e1",
                            maxWidth: 900,
                            lineHeight: 1.35,
                        }}
                    >
                        Confiez votre capital à nos experts et suivez vos gains
                        en temps réel depuis votre tableau de bord.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgba(255,255,255,0.14)",
                        paddingTop: 28,
                        fontSize: 26,
                        color: "#94a3b8",
                    }}
                >
                    <div style={{ display: "flex" }}>
                        {siteConfig.url.replace(/^https?:\/\//, "")}
                    </div>
                    <div style={{ display: "flex", color: "#fbbf24" }}>
                        Bitcoin · Ethereum · Solana
                    </div>
                </div>
            </div>
        ),
        size
    );
}
