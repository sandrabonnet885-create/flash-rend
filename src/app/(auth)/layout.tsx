import type { Metadata } from "next";

/** Les écrans d'authentification n'ont aucune valeur SEO et ne doivent pas être indexés. */
export const metadata: Metadata = {
    title: "Connexion",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false },
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
