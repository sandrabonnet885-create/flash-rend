import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
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
                        Politique de{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            confidentialité
                        </span>
                    </h1>
                    <p className="text-foreground/60">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            FlashRend s'engage à protéger la confidentialité et la sécurité de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations.
                        </p>
                        <p className="text-foreground/70 leading-relaxed">
                            En utilisant nos services, vous acceptez les pratiques décrites dans cette politique.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">2. Données collectées</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Nous collectons différents types d'informations pour fournir et améliorer nos services :
                        </p>
                        
                        <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Informations que vous nous fournissez</h3>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70 mb-4">
                            <li>Nom et prénom</li>
                            <li>Adresse email</li>
                            <li>Numéro de téléphone</li>
                            <li>Informations bancaires (IBAN, BIC)</li>
                            <li>Documents d'identité (pour la vérification KYC)</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Données collectées automatiquement</h3>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>Adresse IP</li>
                            <li>Type de navigateur et appareil</li>
                            <li>Pages visitées et durée des visites</li>
                            <li>Données de localisation approximative</li>
                            <li>Cookies et technologies similaires</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">3. Utilisation des données</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Nous utilisons vos données personnelles pour :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>Créer et gérer votre compte utilisateur</li>
                            <li>Traiter vos investissements et transactions</li>
                            <li>Effectuer les vérifications de sécurité et de conformité (KYC/AML)</li>
                            <li>Vous envoyer des notifications importantes sur votre compte</li>
                            <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
                            <li>Prévenir la fraude et assurer la sécurité de la plateforme</li>
                            <li>Respecter nos obligations légales et réglementaires</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">4. Partage des données</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li><strong>Prestataires de services :</strong> Fournisseurs de paiement, hébergement, analyse</li>
                            <li><strong>Obligations légales :</strong> Autorités gouvernementales, tribunaux, régulateurs</li>
                            <li><strong>Protection des droits :</strong> Pour faire respecter nos conditions ou protéger nos droits</li>
                            <li><strong>Avec votre consentement :</strong> Dans d'autres cas avec votre autorisation explicite</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">5. Sécurité des données</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li>Chiffrement SSL/TLS pour toutes les transmissions de données</li>
                            <li>Stockage sécurisé des données sensibles</li>
                            <li>Authentification à deux facteurs disponible</li>
                            <li>Surveillance continue de la sécurité</li>
                            <li>Accès limité aux données personnelles</li>
                            <li>Audits de sécurité réguliers</li>
                        </ul>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">6. Conservation des données</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Les données de transaction sont conservées pendant au moins 5 ans conformément aux réglementations financières.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">7. Vos droits (RGPD)</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                            <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
                            <li><strong>Droit de rectification :</strong> Corriger les données inexactes ou incomplètes</li>
                            <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                            <li><strong>Droit à la limitation :</strong> Limiter le traitement de vos données</li>
                            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                            <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                            <li><strong>Droit de retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
                        </ul>
                        <p className="text-foreground/70 leading-relaxed mt-4">
                            Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@flashrend.site" className="text-amber-500 hover:text-amber-600">privacy@flashrend.site</a>
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">8. Cookies</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Nous utilisons des cookies et technologies similaires pour :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/70 mb-4">
                            <li>Maintenir votre session de connexion</li>
                            <li>Mémoriser vos préférences</li>
                            <li>Analyser l'utilisation du site</li>
                            <li>Améliorer la sécurité</li>
                        </ul>
                        <p className="text-foreground/70 leading-relaxed">
                            Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">9. Transferts internationaux</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Vos données peuvent être transférées et stockées dans des pays en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont en place pour protéger vos données conformément au RGPD.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">10. Modifications de la politique</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons de tout changement important par email ou via une notification sur la plateforme.
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                            Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
                        </p>
                        <p className="text-foreground/70 leading-relaxed">
                            <strong>Délégué à la Protection des Données (DPO)</strong><br />
                            Email : <a href="mailto:privacy@flashrend.site" className="text-amber-500 hover:text-amber-600">privacy@flashrend.site</a><br />
                            Adresse : 123 Avenue de la Crypto, 75000 Paris, France
                        </p>
                        <p className="text-foreground/70 leading-relaxed mt-4">
                            Vous avez également le droit de déposer une plainte auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
