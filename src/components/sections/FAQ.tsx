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

const faqItems = [
    {
        id: "item-1",
        question: "Comment fonctionne FlashRend ?",
        answer: "FlashRend vous permet d'investir en cryptomonnaies via une plateforme gérée par nos experts. Vous deposez votre capital, nos spécialistes le positionnent sur les meilleures opportunités, et vous recevez vos gains après quelques heures. Le processus est entièrement transparent et sécurisé.",
    },
    {
        id: "item-2",
        question: "Quels sont les rendements potentiels ?",
        answer: "Nos rendements sont généralement entre 900% et 1000% de votre investissement initial, selon les conditions du marché. Cela signifie que pour 1000€ investis, vous pourrez potentiellement récupérer entre 9000€ et 10000€. Utilisez notre simulateur pour estimer vos gains spécifiques.",
    },
    {
        id: "item-3",
        question: "Quel est le montant minimum pour investir ?",
        answer: "Vous pouvez commencer avec un montant aussi petit que vous le souhaitez. Beaucoup de nos utilisateurs commencent par 100€ pour tester la plateforme. Il n'y a pas de montant maximum non plus.",
    },
    {
        id: "item-4",
        question: "Combien de temps cela prend-il ?",
        answer: "Le processus complet prend généralement quelques heures. Après avoir effectué votre paiement, nos experts identifient les meilleures opportunités d'investissement. Vous pouvez suivre la progression en temps réel sur votre tableau de bord.",
    },
    {
        id: "item-5",
        question: "Est-ce que mon argent est sécurisé ?",
        answer: "Oui, votre investissement est entièrement sécurisé. Nous utilisons des portefeuilles sécurisés et des protocoles de sécurité bancaire. Nos experts sont certifiés et suivent des normes strictes de gestion d'actifs.",
    },
    {
        id: "item-6",
        question: "Puis-je retirer mon argent à tout moment ?",
        answer: "Vous pouvez retirer vos gains dès que la session d'investissement est terminée. Les retraits sont traités dans les 24 à 48 heures vers votre compte bancaire. Pas de frais cachés.",
    },
    {
        id: "item-7",
        question: "Y a-t-il des frais ?",
        answer: "FlashRend ne prélève une commission que sur vos gains. Votre capital initial reste intact. Les commissions varient selon le type de package d'investissement choisi. Il n'y a pas de frais cachés ou de frais d'inscription.",
    },
    {
        id: "item-8",
        question: "Comment puis-je contacter le support ?",
        answer: "Notre équipe de support est disponible 24/7. Vous pouvez nous contacter via le formulaire de contact sur notre site, par email, ou par chat en direct. Nous répondons généralement en moins d'une heure.",
    },
];

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
                        FAQ{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            FlashRend
                        </span>
                    </h2>

                    <p className="text-sm lg:text-base text-foreground/70 leading-relaxed">
                        Vous avez des questions ? Trouvez les réponses aux
                        questions les plus fréquemment posées par nos
                        utilisateurs.
                    </p>
                </div>

                {/* Accordion */}
                <Accordion type="single" collapsible className="w-full mb-12">
                    {faqItems.map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="text-base font-semibold hover:text-amber-600 transition-colors">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-foreground/70 leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* CTA Buttons - Centered */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/login">
                        <Button size="lg" className="hover:cursor-pointer">
                            Commencez maintenant
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
