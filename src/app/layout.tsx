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
    title: "FlashRend",
    description: "Investissement cryptomonnaie simplifié & rapide.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body
                className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased font-grotesk`}
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
