"use client";

import { useState, useEffect } from "react";
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
import { Input } from "../ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";

const processingMessages = [
    "🔍 Vérification de votre montant...",
    "📊 Analyse de l'indice du marché crypto...",
    "⚡ Évaluation des opportunités Bitcoin...",
    "🔗 Scan des tendances Ethereum...",
    "🚀 Détection des monnaies à haut potentiel...",
    "💡 Application de nos algorithmes d'experts...",
    "✅ Calcul de vos gains potentiels...",
];

export default function SimulationSection() {
    const [montant, setMontant] = useState<string>("1000");
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedGain, setDisplayedGain] = useState(0);
    const [isCountingUp, setIsCountingUp] = useState(false);

    // Handle messages progression
    useEffect(() => {
        if (!isSimulating) return;

        if (currentMessageIndex < processingMessages.length) {
            const timer = setTimeout(() => {
                setCurrentMessageIndex((prev) => prev + 1);
            }, 800);

            return () => clearTimeout(timer);
        } else {
            // Messages finished, start the counter animation
            const montantNum = parseFloat(montant) || 0;
            const multiplier = Math.random() * (10 - 9) + 9; // Random between 9 and 10
            const gain = montantNum * multiplier;
            setResult(gain);
            setIsCountingUp(true);
        }
    }, [isSimulating, currentMessageIndex, montant]);

    // Handle counter animation
    useEffect(() => {
        if (!isCountingUp || !result) return;

        let current = 0;
        const increment = result / 60; // Animate over 60 frames
        let frames = 0;

        const counter = setInterval(() => {
            frames++;
            current += increment;

            if (frames >= 60) {
                setDisplayedGain(result);
                clearInterval(counter);
                setIsCountingUp(false);
                setIsSimulating(false);
            } else {
                setDisplayedGain(current);
            }
        }, 16); // ~60fps

        return () => clearInterval(counter);
    }, [isCountingUp, result]);

    const handleSimulate = () => {
        if (!montant || parseFloat(montant) <= 0) {
            alert("Veuillez entrer un montant valide");
            return;
        }

        setIsSimulating(true);
        setCurrentMessageIndex(0);
        setDisplayedGain(0);
        setResult(null);
    };

    const montantNum = parseFloat(montant) || 0;
    const gain = result || 0;
    const percentage =
        montantNum > 0
            ? (((gain - montantNum) / montantNum) * 100).toFixed(0)
            : 0;

    return (
        <section className="py-20 mt-20" id="simulation">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Centered */}
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Simulateur
                    </Badge>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                        Simulez vos{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            gains
                        </span>
                    </h2>

                    <p className="text-sm lg:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                        Découvrez les rendements approximatifs que vous pouvez
                        obtenir. Entrez votre montant d'investissement et
                        laissez nos experts calculer vos gains potentiels.
                    </p>
                </div>

                {/* Simulation Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Input Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Montant à investir</CardTitle>
                            <CardDescription>En euros (€)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Montant
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-foreground/60">
                                        €
                                    </span>
                                    <Input
                                        type="number"
                                        placeholder="1000"
                                        value={montant}
                                        onChange={(e) =>
                                            setMontant(e.target.value)
                                        }
                                        disabled={isSimulating}
                                        min="1"
                                        className="text-lg"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleSimulate}
                                disabled={isSimulating}
                                size="lg"
                                className="w-full"
                            >
                                {isSimulating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Simulation en cours...
                                    </>
                                ) : (
                                    "Simuler"
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Result Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Votre gain approximatif</CardTitle>
                            <CardDescription>
                                Résultat de la simulation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isSimulating ? (
                                <div className="space-y-4">
                                    {processingMessages
                                        .slice(0, currentMessageIndex + 1)
                                        .map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 text-sm animate-fadeIn"
                                            >
                                                {idx === currentMessageIndex ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mt-0.5 text-amber-500 shrink-0" />
                                                ) : (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                )}
                                                <span className="text-foreground/70">
                                                    {msg}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            ) : result !== null ? (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-foreground/60 mb-2">
                                            Montant investi
                                        </p>
                                        <p className="text-3xl font-bold">
                                            €{montantNum.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="h-px bg-border" />

                                    <div>
                                        <p className="text-sm text-foreground/60 mb-2">
                                            Gain potentiel
                                        </p>
                                        <p className="text-4xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                            €{displayedGain.toFixed(2)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-foreground/60 mb-1">
                                            Rendement
                                        </p>
                                        <p className="text-lg font-semibold text-green-500">
                                            +{percentage}%
                                        </p>
                                    </div>

                                    <Link href="/login" className="block pt-2">
                                        <Button className="w-full hover:cursor-pointer">
                                            Investir maintenant
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-foreground/60">
                                        Entrez un montant et cliquez sur
                                        "Simuler" pour voir vos gains potentiels
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
