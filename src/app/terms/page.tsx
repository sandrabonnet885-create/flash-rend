import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions générales d'utilisation",
    description:
        "Conditions générales d'utilisation de FlashRend : accès au service, obligations des utilisateurs, investissements, retraits, risques et responsabilités.",
    alternates: { canonical: "/terms" },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={breadcrumbSchema([
                    {
                        name: "Conditions générales d'utilisation",
                        path: "/terms",
                    },
                ])}
            />
            {/* Header */}
            <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à l'accueil
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        Conditions{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            d'utilisation
                        </span>
                    </h1>
                    <p className="text-foreground/60">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">1. Acceptation des conditions</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            En accédant et en utilisant la plateforme FlashRend, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                        </p>
                        <p className="text-foreground/70 leading-relaxed">
                            FlashRend se réserve le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur dès leur publication sur le site.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">2. Description du service</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            FlashRend est une plateforme d'investissement en cryptomonnaies qui permet aux utilisateurs de réaliser des investissements gérés par nos experts. Notre service comprend :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>Analyse et sélection d'opportunités d'investissement crypto</li>
                            <li>Gestion automatisée des investissements</li>
                            <li>Suivi en temps réel des performances</li>
                            <li>Système de retrait sécurisé</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">3. Inscription et compte utilisateur</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Pour utiliser FlashRend, vous devez créer un compte en fournissant des informations exactes et complètes. Vous êtes responsable de :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70 mb-4">
                            <li>La confidentialité de vos identifiants de connexion</li>
                            <li>Toutes les activités effectuées sous votre compte</li>
                            <li>La notification immédiate de toute utilisation non autorisée</li>
                        </ul>
                        <p className="text-foreground/70 leading-relaxed">
                            Vous devez avoir au moins 18 ans pour créer un compte et utiliser nos services.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">4. Investissements et risques</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            <strong>Avertissement important :</strong> L'investissement en cryptomonnaies comporte des risques importants, notamment la perte totale du capital investi. Les performances passées ne garantissent pas les résultats futurs.
                        </p>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            En utilisant FlashRend, vous reconnaissez et acceptez que :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>Les marchés de cryptomonnaies sont volatils et imprévisibles</li>
                            <li>Vous pouvez perdre tout ou partie de votre investissement</li>
                            <li>FlashRend ne garantit aucun rendement spécifique</li>
                            <li>Vous investissez à vos propres risques</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">5. Frais et paiements</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            FlashRend peut facturer des frais pour certains services. Tous les frais applicables seront clairement affichés avant toute transaction. Les frais comprennent :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>Frais de gestion sur les investissements</li>
                            <li>Frais de retrait (le cas échéant)</li>
                            <li>Frais de transaction blockchain</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">6. Retraits</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Les demandes de retrait sont traitées selon les conditions suivantes :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>Montant minimum de retrait : 1€</li>
                            <li>Délai de traitement : 1 à 3 jours ouvrables</li>
                            <li>Vérification d'identité requise pour les montants importants</li>
                            <li>Les retraits sont effectués vers le compte bancaire enregistré</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">7. Politique de remboursement</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            FlashRend s'engage à traiter équitablement toutes les demandes de remboursement légitimes. Les utilisateurs peuvent soumettre une demande de remboursement dans les cas suivants :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70 mb-4">
                            <li>Problème technique empêchant l'utilisation du service</li>
                            <li>Transaction non autorisée sur votre compte</li>
                            <li>Service non reçu conformément aux conditions</li>
                            <li>Problème lié à un investissement spécifique</li>
                        </ul>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            <strong>Procédure de demande :</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70 mb-4">
                            <li>Accédez à la section "Remboursements" de votre compte</li>
                            <li>Remplissez le formulaire de demande en détaillant votre situation</li>
                            <li>Fournissez toutes les informations nécessaires à l'examen de votre demande</li>
                            <li>Notre équipe examinera votre demande sous 5-7 jours ouvrables</li>
                        </ul>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            <strong>Conditions importantes :</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>Le montant demandé ne peut pas dépasser votre solde disponible</li>
                            <li>Les demandes frauduleuses peuvent entraîner la suspension du compte</li>
                            <li>Les remboursements sont effectués vers le compte bancaire enregistré</li>
                            <li>Un remboursement approuvé sera traité sous 3-5 jours ouvrables</li>
                            <li>FlashRend se réserve le droit de refuser une demande si elle ne respecte pas les conditions</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">8. Propriété intellectuelle</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Tous les contenus présents sur FlashRend (textes, graphiques, logos, icônes, images, clips audio, téléchargements numériques) sont la propriété de FlashRend ou de ses fournisseurs de contenu et sont protégés par les lois sur la propriété intellectuelle.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">8. Propriété intellectuelle</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Tous les contenus présents sur FlashRend (textes, graphiques, logos, icônes, images, clips audio, téléchargements numériques) sont la propriété de FlashRend ou de ses fournisseurs de contenu et sont protégés par les lois sur la propriété intellectuelle.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">9. Limitation de responsabilité</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Dans les limites autorisées par la loi, FlashRend ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>L'utilisation ou l'impossibilité d'utiliser le service</li>
                            <li>Les pertes d'investissement</li>
                            <li>Les erreurs ou interruptions de service</li>
                            <li>Les violations de sécurité</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">10. Résiliation</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            FlashRend se réserve le droit de suspendre ou de résilier votre compte à tout moment, avec ou sans préavis, en cas de violation des présentes conditions ou pour toute autre raison jugée appropriée.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">11. Droit applicable</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Les présentes conditions sont régies par le droit français. Tout litige relatif à l'interprétation ou à l'exécution des présentes sera soumis aux tribunaux compétents de Paris, France.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à :
                        </p>
                        <p className="text-foreground/70 leading-relaxed mt-4">
                            Email : <a href="mailto:contact@flashrend.site" className="text-amber-500 hover:text-amber-600">contact@flashrend.site</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
