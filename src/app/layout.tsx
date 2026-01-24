import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    display: "swap",
});

const spaceMono = Space_Mono({
    weight: ["400", "700"],
    variable: "--font-space-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "FlashRend - Investissement Crypto Simplifié",
    description:
        "Investissement en cryptomonnaies simplifié et rapide. Obtenez des rendements exceptionnels (900-1000%) en quelques heures avec nos experts.",
    keywords: [
        "crypto",
        "investissement",
        "bitcoin",
        "ethereum",
        "rendement",
        "cryptomonnaie",
    ],
    authors: [{ name: "FlashRend Team" }],
    openGraph: {
        type: "website",
        locale: "fr_FR",
        url: "https://flashrend.com",
        siteName: "FlashRend",
        title: "FlashRend - Investissement Crypto Simplifié & Rapide",
        description:
            "Investissement en cryptomonnaies simplifié et rapide. Obtenez des rendements exceptionnels (900-1000%) en quelques heures avec nos experts.",
        images: [
            {
                url: "https://flashrend.com/logo.png",
                width: 1200,
                height: 630,
                alt: "FlashRend - Investissement Crypto",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "FlashRend - Investissement Crypto Simplifié",
        description:
            "Investissement en cryptomonnaies simplifié et rapide. Rendements exceptionnels en quelques heures.",
        images: ["https://flashrend.com/logo.png"],
        creator: "@FlashRend",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    verification: {
        google: "google-site-verification-code",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
            <body
                className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased font-grotesk scroll-smooth`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
