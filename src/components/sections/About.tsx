"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function AboutSection() {
    return (
        <section className="py-20 mt-20" id="qui-sommes-nous">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="flex flex-col justify-center">
                        <Badge variant="outline" className="w-fit mb-4">
                            À propos de FlashRend
                        </Badge>

                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Qui sommes-
                            <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                nous
                            </span>
                            ?
                        </h2>

                        <p className="text-sm lg:text-base text-foreground/70 mb-4 leading-relaxed">
                            FlashRend est une plateforme d'investissement en
                            cryptomonnaies opérée depuis la France par une équipe
                            de spécialistes des marchés crypto. Nos analystes
                            suivent en continu Bitcoin, Ethereum, Solana et les
                            principaux altcoins pour identifier les opportunités
                            d'entrée sur des sessions courtes.
                        </p>

                        <p className="text-sm lg:text-base text-foreground/70 mb-4 leading-relaxed">
                            Concrètement, vous n'avez ni portefeuille à
                            configurer, ni plateforme d'échange à maîtriser, ni
                            graphique à surveiller. Vous déposez le montant de
                            votre choix, nos experts le positionnent sur les
                            crypto-actifs qu'ils ont sélectionnés, et chaque
                            étape reste visible depuis votre tableau de bord :
                            montant engagé, progression de la session et gains
                            estimés en temps réel.
                        </p>

                        <p className="text-sm lg:text-base text-foreground/70 mb-8 leading-relaxed">
                            Cette approche combine expertise humaine et analyse
                            de marché pour rendre l'investissement crypto
                            accessible aux débutants, sans leur demander de
                            devenir traders. Les performances passées ne
                            préjugent pas des performances futures et un
                            investissement en cryptomonnaies comporte un risque
                            de perte en capital.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="#comment-ca-marche">
                                <Button size="lg">
                                    Découvrir comment investir
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Images */}
                    <div className="relative h-96 sm:h-125">
                        {/* Main About Image - Center */}
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="relative w-80 h-80 lg:w-100 lg:h-100 rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/about.png"
                                    alt="Équipe d'experts FlashRend analysant les marchés de cryptomonnaies"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Crypto Icons - Top Left - Large */}
                        <div className="absolute top-8 left-10 lg:top-16 lg:left-20 w-6 h-6 z-20 bg-yellow-950 rounded-full">
                            <Image
                                src="/bitcoin.png"
                                alt="Bitcoin (BTC)"
                                fill
                                className="object-contain opacity-60 p-1"
                            />
                        </div>

                        {/* Crypto Icons - Top Right - Medium */}
                        <div className="absolute top-4 right-6 lg:top-10 lg:right-16 w-6 h-6 z-15 bg-purple-200 rounded-full">
                            <Image
                                src="/ethereum.png"
                                alt="Ethereum (ETH)"
                                fill
                                className="object-contain opacity-70 p-1"
                            />
                        </div>

                        {/* Crypto Icons - Bottom Left - Small */}
                        <div className="absolute bottom-4 left-8 lg:bottom-12 lg:left-20 w-6 h-6 z-15 bg-green-950 rounded-full">
                            <Image
                                src="/solana.png"
                                alt="Solana (SOL)"
                                fill
                                className="object-contain opacity-50 p-1"
                            />
                        </div>

                        {/* Crypto Icons - Bottom Right - Extra Large */}
                        <div className="absolute bottom-8 right-6 lg:bottom-20 lg:right-24 w-6 h-6 z-20 bg-red-950 rounded-full">
                            <Image
                                src="/doge.png"
                                alt="Dogecoin (DOGE)"
                                fill
                                className="object-contain opacity-65 p1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
