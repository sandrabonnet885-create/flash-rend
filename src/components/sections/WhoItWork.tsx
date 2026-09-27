"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

const steps = [
    {
        number: 1,
        title: "Créer votre compte",
        description:
            "Inscrivez-vous en quelques secondes avec votre email, Google ou Apple. Aucune connaissance technique en cryptomonnaies n'est requise pour démarrer.",
    },
    {
        number: 2,
        title: "Déposer votre capital",
        description:
            "Déposez le montant que vous souhaitez investir par virement bancaire, carte ou PayPal. Vous choisissez librement votre montant de départ.",
    },
    {
        number: 3,
        title: "Suivre votre session",
        description:
            "Nos experts positionnent votre capital sur les crypto-actifs sélectionnés. Vous suivez la progression et les gains estimés en temps réel sur votre tableau de bord.",
    },
    {
        number: 4,
        title: "Récupérer vos gains",
        description:
            "À la fin de la session, retirez vos gains vers votre compte bancaire sous 24 à 48 h, ou réinvestissez-les sur une nouvelle session.",
    },
];

export default function WhoItWorkSection() {
    return (
        <section className="py-20 mt-20" id="comment-ca-marche">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Centered */}
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Mode d'emploi
                    </Badge>

                    {/* h2 formulé comme une requête de recherche. */}
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                        Comment investir en crypto{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            en 4 étapes
                        </span>
                    </h2>

                    <p className="text-sm lg:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                        Investir dans les cryptomonnaies avec FlashRend ne
                        demande ni portefeuille crypto, ni compte sur une
                        plateforme d'échange. Voici le parcours complet, de
                        l'inscription au retrait de vos gains.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {steps.map((step) => (
                        <Card
                            key={step.number}
                            className="relative flex flex-col hover:shadow-lg transition-shadow"
                        >
                            {/* Step Number */}
                            <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-linear-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {step.number}
                            </div>

                            <CardHeader className="pt-8">
                                {/* h3 plutôt que CardTitle (un div) : conserve
                                    la hiérarchie h1 > h2 > h3 pour les crawlers. */}
                                <h3 className="text-xl font-semibold leading-none">
                                    {step.title}
                                </h3>
                            </CardHeader>

                            <CardContent className="grow">
                                <p className="text-sm lg:text-base text-foreground/70 leading-relaxed">
                                    {step.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA Button - Centered */}
                <div className="flex justify-center">
                    <Link href="/login">
                        <Button size="lg" className="px-8 hover:cursor-pointer">
                            Créer mon compte FlashRend
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
