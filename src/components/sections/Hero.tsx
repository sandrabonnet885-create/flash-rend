import Link from "next/link";
import ColorBends from "../ColorBends";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function HeroSection() {
    return (
        <section
            className="min-h-[90vh] relative isolate flex items-center justify-center overflow-hidden py-16 sm:py-24"
            id="hero"
        >
            <ColorBends
                colors={["#D4AF37", "#B8860B", "#AA7F2E", "#8B6914"]}
                rotation={0}
                speed={0.2}
                scale={1}
                frequency={1}
                warpStrength={1}
                mouseInfluence={1}
                parallax={0.5}
                noise={0.1}
                transparent
                autoRotate={0}
                className="absolute! inset-0! w-auto! h-auto! m-0! -z-10"
                style={{ position: "absolute", inset: 0, zIndex: -10 }}
            />

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    <Badge variant="outline" className="mb-4">
                        Plateforme d'investissement en cryptomonnaies
                    </Badge>
    
                    {/* Unique h1 de la page : porte le mot-clé principal. */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        Investissement crypto{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            simplifié & rapide
                        </span>
                    </h1>
    
                    <p className="text-sm sm:text-base text-foreground/70 mb-8 leading-relaxed max-w-3xl mx-auto">
                        Investir dans les cryptomonnaies sans y passer vos journées :
                        déposez votre capital, nos experts le positionnent sur
                        Bitcoin, Ethereum et Solana, et vous suivez la progression de
                        votre session en temps réel depuis votre tableau de bord.
                    </p>
    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* Ancres explicites : le texte du lien décrit sa destination. */}
                        <Link href="#simulation">
                            <Button size="lg" className="w-full sm:w-auto">
                                Simuler mon investissement
                            </Button>
                        </Link>
                        <Link href="#comment-ca-marche">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Comment ça marche
                            </Button>
                        </Link>
                    </div>
                </div>
    
                {/* Démo 60 s : muette au départ (condition de la lecture automatique),
                    les contrôles natifs permettent d'activer la voix off. */}
                <div className="mt-12 sm:mt-16 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
                    <video
                        className="block w-full aspect-video"
                        src="/videos/demo60.mp4"
                        poster="/videos/demo60-poster.jpg"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        preload="metadata"
                        aria-label="Démonstration de la plateforme FlashRend en 60 secondes"
                    />
                </div>
            </div>
        </section>
    );
}
