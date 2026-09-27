"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { faqItems } from "@/lib/faq-data";



export default function FAQSection() {
    return (
        <section className="py-20 mt-20" id="faq">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Centered */}
                <div className="md:text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Questions fréquentes
                    </Badge>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                        Questions fréquentes sur{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            l'investissement crypto
                        </span>
                    </h2>

                    <p className="text-sm lg:text-base text-foreground/70 leading-relaxed">
                        Montant minimum, durée d'une session, retrait des gains,
                        frais, fiscalité française : voici les réponses aux
                        questions que nos utilisateurs posent le plus souvent
                        avant de se lancer.
                    </p>
                </div>

                {/* Accordion */}
                <Accordion type="single" collapsible className="w-full mb-12">
                    {faqItems.map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="text-base font-semibold hover:text-amber-600 transition-colors">
                                {item.question}
                            </AccordionTrigger>
                            {/* forceMount : sans lui, Radix démonte le contenu
                                fermé et aucune réponse n'apparaît dans le HTML
                                servi aux crawlers. Le repli visuel est assuré
                                par `data-[state=closed]:hidden` dans
                                ui/accordion.tsx. */}
                            <AccordionContent
                                forceMount
                                className="text-foreground/70 leading-relaxed"
                            >
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* CTA Buttons - Centered */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/login">
                        <Button size="lg" className="hover:cursor-pointer">
                            Ouvrir un compte
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button
                            size="lg"
                            variant="outline"
                            className="hover:cursor-pointer"
                        >
                            Nous contacter
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
