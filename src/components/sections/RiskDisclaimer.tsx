import Link from "next/link";
import { AlertTriangle } from "lucide-react";

/**
 * Avertissement sur les risques.
 *
 * Double objectif : obligation d'information pour une communication sur des
 * actifs numériques en France, et signal E-E-A-T sur une page YMYL (finance),
 * où Google attend un avertissement explicite et des liens vers les pages
 * légales.
 */
export default function RiskDisclaimerSection() {
    return (
        <section className="py-12" id="avertissement-risques" aria-labelledby="avertissement-risques-titre">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500 mt-0.5" />
                        <div>
                            <h2
                                id="avertissement-risques-titre"
                                className="text-lg font-semibold mb-3"
                            >
                                Avertissement sur les risques
                            </h2>

                            <p className="text-sm text-foreground/70 leading-relaxed mb-3">
                                L'investissement en cryptomonnaies comporte un
                                risque élevé de perte en capital. Le marché des
                                actifs numériques est volatil et non garanti :
                                la valeur de votre investissement peut baisser
                                comme augmenter, et vous pouvez perdre tout ou
                                partie des sommes engagées. Les rendements
                                présentés sur ce site sont des estimations
                                fondées sur des sessions passées ; les
                                performances passées ne préjugent pas des
                                performances futures.
                            </p>

                            <p className="text-sm text-foreground/70 leading-relaxed mb-3">
                                Les informations publiées sur ce site ont une
                                vocation purement informative et ne constituent
                                ni un conseil en investissement, ni une
                                recommandation personnalisée, ni une
                                sollicitation d'achat ou de vente d'actifs
                                numériques. N'investissez que des sommes dont
                                vous n'avez pas besoin à court terme et
                                renseignez-vous avant de vous engager.
                            </p>

                            <p className="text-sm text-foreground/60 leading-relaxed">
                                Pour en savoir plus, consultez nos{" "}
                                <Link
                                    href="/terms"
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    conditions générales d'utilisation
                                </Link>
                                , nos{" "}
                                <Link
                                    href="/legal"
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    mentions légales
                                </Link>{" "}
                                et notre{" "}
                                <Link
                                    href="/privacy"
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    politique de confidentialité
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
