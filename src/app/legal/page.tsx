import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions légales",
    description:
        "Mentions légales de FlashRend SAS : éditeur du site, hébergeur, propriété intellectuelle, protection des données et cadre réglementaire applicable.",
    alternates: { canonical: "/legal" },
    robots: { index: true, follow: true },
};

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Mentions légales", path: "/legal" },
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
                        Mentions{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            légales
                        </span>
                    </h1>
                    <p className="text-foreground/60">
                        Informations légales et réglementaires
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">1. Éditeur du site</h2>
                        <div className="bg-card/50 border border-border/50 rounded-lg p-6">
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>Raison sociale :</strong> FlashRend SAS
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>Forme juridique :</strong> Société par Actions Simplifiée
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>Capital social :</strong> 100 000 €
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>Siège social :</strong> 123 Avenue de la Crypto, 75000 Paris, France
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>SIRET :</strong> 123 456 789 00012
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>RCS :</strong> Paris B 123 456 789
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>Numéro de TVA intracommunautaire :</strong> FR12 123456789
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>Email :</strong> <a href="mailto:contact@flashrend.site" className="text-amber-500 hover:text-amber-600">contact@flashrend.site</a>
                            </p>
                            <p className="text-foreground/70 leading-relaxed">
                                <strong>Téléphone :</strong> +33 (0)1 23 45 67 89 — +33 (0)6 51 94 15 46
                            </p>
                        </div>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">2. Directeur de la publication</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            <strong>Nom :</strong> [Nom du Directeur]<br />
                            <strong>Qualité :</strong> Président de FlashRend SAS
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">3. Hébergement</h2>
                        <div className="bg-card/50 border border-border/50 rounded-lg p-6">
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>Hébergeur :</strong> Vercel Inc.
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-2">
                                <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
                            </p>
                            <p className="text-foreground/70 leading-relaxed">
                                <strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600">vercel.com</a>
                            </p>
                        </div>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">4. Propriété intellectuelle</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, etc.) est la propriété exclusive de FlashRend SAS ou de ses partenaires.
                        </p>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord exprès par écrit de FlashRend SAS.
                        </p>
                        <p className="text-foreground/70 leading-relaxed">
                            La marque FlashRend, ainsi que tous les logos et visuels associés, sont des marques déposées. Toute utilisation non autorisée constitue une contrefaçon passible de poursuites.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">5. Protection des données personnelles</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            FlashRend SAS attache une grande importance à la protection de vos données personnelles et s'engage à les traiter conformément au Règlement Général sur la Protection des Données (RGPD).
                        </p>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            <strong>Responsable du traitement :</strong> FlashRend SAS
                        </p>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            <strong>Délégué à la Protection des Données (DPO) :</strong><br />
                            Email : <a href="mailto:privacy@flashrend.site" className="text-amber-500 hover:text-amber-600">privacy@flashrend.site</a>
                        </p>
                        <p className="text-foreground/70 leading-relaxed">
                            Pour plus d'informations, consultez notre <Link href="/privacy" className="text-amber-500 hover:text-amber-600">Politique de confidentialité</Link>.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.
                        </p>
                        <p className="text-foreground/70 leading-relaxed">
                            Vous pouvez désactiver les cookies dans les paramètres de votre navigateur. Notez que cela peut affecter certaines fonctionnalités du site.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">7. Réglementation financière</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            FlashRend est une plateforme d'investissement en cryptomonnaies. Les activités de FlashRend sont soumises aux réglementations suivantes :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70 mb-4">
                            <li>Enregistrement PSAN (Prestataire de Services sur Actifs Numériques) auprès de l'AMF</li>
                            <li>Conformité aux directives européennes MiFID II et AMLD5</li>
                            <li>Respect des obligations KYC (Know Your Customer) et AML (Anti-Money Laundering)</li>
                        </ul>
                        <p className="text-foreground/70 leading-relaxed">
                            <strong>Numéro d'enregistrement PSAN :</strong> [À compléter]
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">8. Avertissement sur les risques</h2>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                            <p className="text-foreground/90 leading-relaxed mb-4 font-semibold">
                                ⚠️ Avertissement important
                            </p>
                            <p className="text-foreground/70 leading-relaxed mb-4">
                                L'investissement en cryptomonnaies présente un risque de perte en capital. Les performances passées ne préjugent pas des performances futures.
                            </p>
                            <p className="text-foreground/70 leading-relaxed">
                                Les cryptomonnaies sont des actifs volatils et non régulés. Vous devez vous assurer de bien comprendre les risques avant d'investir et n'investir que des sommes que vous pouvez vous permettre de perdre.
                            </p>
                        </div>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">9. Limitation de responsabilité</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            FlashRend s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, FlashRend ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
                        </p>
                        <p className="text-foreground/70 leading-relaxed">
                            FlashRend décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">10. Liens hypertextes</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Le site peut contenir des liens vers d'autres sites web. FlashRend n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
                        </p>
                        <p className="text-foreground/70 leading-relaxed">
                            La création de liens hypertextes vers le site FlashRend nécessite une autorisation préalable écrite.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">11. Droit applicable et juridiction</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux compétents de Paris, France.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
                        </p>
                        <p className="text-foreground/70 leading-relaxed mt-4">
                            <strong>Par email :</strong> <a href="mailto:legal@flashrend.site" className="text-amber-500 hover:text-amber-600">legal@flashrend.site</a><br />
                            <strong>Par téléphone :</strong> +33 (0)1 23 45 67 89 — +33 (0)6 51 94 15 46<br />
                            <strong>Par courrier :</strong> FlashRend SAS, 123 Avenue de la Crypto, 75000 Paris, France
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
