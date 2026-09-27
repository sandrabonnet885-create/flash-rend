"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        name: "Sophie Martin",
        role: "Investisseuse depuis 6 mois",
        avatar: "/avatars/avatar-1.jpg",
        rating: 5,
        content: "FlashRend a complètement transformé ma façon d'investir. Les rendements sont impressionnants et le processus est d'une simplicité déconcertante. J'ai déjà doublé mon investissement initial !",
    },
    {
        name: "Thomas Dubois",
        role: "Entrepreneur",
        avatar: "/avatars/avatar-2.jpg",
        rating: 5,
        content: "En tant qu'entrepreneur, je n'ai pas le temps de suivre les marchés crypto. FlashRend s'occupe de tout et les résultats parlent d'eux-mêmes. Service exceptionnel !",
    },
    {
        name: "Marie Laurent",
        role: "Étudiante en finance",
        avatar: "/avatars/avatar-3.jpg",
        rating: 5,
        content: "J'étais sceptique au début, mais après mon premier investissement, j'ai été bluffée par la rapidité et la transparence. Une plateforme que je recommande sans hésitation.",
    },
    {
        name: "Alexandre Petit",
        role: "Développeur",
        avatar: "/avatars/avatar-4.jpg",
        rating: 5,
        content: "Interface intuitive, équipe réactive et rendements au rendez-vous. FlashRend est devenu mon outil principal pour faire fructifier mon épargne.",
    },
    {
        name: "Camille Bernard",
        role: "Chef de projet",
        avatar: "/avatars/avatar-5.jpg",
        rating: 5,
        content: "Les experts de FlashRend ont une vraie maîtrise du marché crypto. Leurs analyses sont précises et les opportunités qu'ils identifient sont toujours rentables.",
    },
    {
        name: "Lucas Moreau",
        role: "Investisseur confirmé",
        avatar: "/avatars/avatar-6.jpg",
        rating: 5,
        content: "J'ai testé plusieurs plateformes d'investissement crypto, mais FlashRend se démarque clairement par sa performance et sa fiabilité. Un vrai game-changer !",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-20 relative overflow-hidden" id="temoignages">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Témoignages
                    </Badge>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        Avis de nos{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            investisseurs
                        </span>
                    </h2>
                    <p className="text-foreground/70 max-w-2xl mx-auto">
                        Entrepreneurs, étudiants, débutants en cryptomonnaies ou
                        investisseurs confirmés : voici comment nos utilisateurs
                        décrivent leur expérience de la plateforme FlashRend.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 group"
                        >
                            <CardContent className="p-6">
                                {/* Quote Icon */}
                                <div className="mb-4 text-amber-500/20 group-hover:text-amber-500/40 transition-colors">
                                    <Quote className="h-8 w-8" />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-4 w-4 fill-amber-500 text-amber-500"
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-foreground/80 mb-6 leading-relaxed text-sm">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                            <span className="text-lg font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-xs text-foreground/60">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
                        <div className="text-3xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                            5,000+
                        </div>
                        <p className="text-sm text-foreground/60">Investisseurs actifs</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
                        <div className="text-3xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                            98%
                        </div>
                        <p className="text-sm text-foreground/60">Taux de satisfaction</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
                        <div className="text-3xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                            €2M+
                        </div>
                        <p className="text-sm text-foreground/60">Rendements générés</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
                        <div className="text-3xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                            24/7
                        </div>
                        <p className="text-sm text-foreground/60">Support disponible</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
