"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

const steps = [
    {
        number: 1,
        title: "Créer un compte",
        description:
            "Inscrivez-vous ou connectez-vous à votre compte FlashRend en quelques secondes pour accéder à la plateforme.",
    },
    {
        number: 2,
        title: "Faire le paiement",
        description:
            "Deposez le montant que vous souhaitez investir via notre système de paiement sécurisé et rapide.",
    },
    {
        number: 3,
        title: "Attendre le décompte",
        description:
            "Nos experts positionnent votre capital et vous suiverez le décompte en temps réel jusqu'à la fin de la session.",
    },
    {
        number: 4,
        title: "Récupérer vos gains",
        description:
            "Une fois le décompte terminé, récupérez vos gains et réinvestissez ou retirez selon vos envies.",
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

                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                        Comment ça{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            marche
                        </span>
                    </h2>

                    <p className="text-sm lg:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                        Quatre étapes simples pour commencer à générer des
                        rendements rapides avec FlashRend. Le processus a été
                        conçu pour être aussi intuitif que possible.
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
                                <CardTitle className="text-xl">
                                    {step.title}
                                </CardTitle>
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
                            Commencer maintenant
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
