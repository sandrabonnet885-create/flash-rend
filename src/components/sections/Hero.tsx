import Link from "next/link";
import ColorBends from "../ColorBends";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function HeroSection() {
    return (
        <section
            className="min-h-[90vh] relative flex items-center justify-center overflow-hidden"
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

            <div className="relative z-10 text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <Badge variant="outline" className="mb-4">
                    Bienvenue à FlashRend
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                    Investissement{" "}
                    <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        Simplifié & Rapide
                    </span>
                </h1>

                <p className="text-sm sm:text-base text-foreground/70 mb-8 leading-relaxed">
                    Découvrez la façon la plus simple et la plus rapide
                    d'investir dans les cryptomonnaies. Commencez votre voyage
                    financier en quelques minutes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="#simulation">
                        <Button size="lg" className="w-full sm:w-auto">
                            Commencer la simulation
                        </Button>
                    </Link>
                    <Link href="#qui-sommes-nous">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            En savoir plus
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
