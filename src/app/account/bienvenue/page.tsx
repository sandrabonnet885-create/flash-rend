import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

/**
 * Page de confirmation d'inscription. L'utilisateur n'y arrive qu'une seule
 * fois, depuis /account, juste après la création de son compte. C'est l'URL
 * de destination à déclarer comme objectif de conversion dans Kliken.
 */
export default async function BienvenuePage() {
    const user = await currentUser();

    return (
        <div className="mx-auto max-w-xl space-y-6 py-16 text-center">
            <h1 className="text-3xl font-bold">
                Bienvenue{user?.firstName ? `, ${user.firstName}` : ""}
            </h1>
            <p className="text-foreground/60">
                Votre compte FlashRend est créé. Vous pouvez dès maintenant
                explorer les plans et lancer votre premier investissement.
            </p>
            <Link href="/account/investments">
                <Button className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                    Voir les investissements
                </Button>
            </Link>
        </div>
    );
}
