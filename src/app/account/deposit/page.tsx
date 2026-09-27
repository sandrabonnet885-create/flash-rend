"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, Wallet, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DepositSelectionPage() {
    const { user } = useUser();
    const router = useRouter();

    const depositMethods = [
        {
            title: "Virement Bancaire",
            description:
                "Dépôt sécurisé via virement bancaire standard (SEPA).",
            icon: Building2,
            href: "/account/deposit/bank-transfer",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            processingTime: "1-3 jours ouvrés",
            minAmount: "100€",
            comingSoon: false,
        },
        {
            title: "PayPal",
            description:
                "Paiement rapide et sécurisé avec votre compte PayPal.",
            icon: Wallet,
            href: "/account/deposit/paypal",
            color: "text-sky-500",
            bgColor: "bg-sky-500/10",
            processingTime: "Instantané",
            minAmount: "10€",
            comingSoon: false,
        },
        {
            title: "Carte Bancaire",
            description: "Dépôt instantané par carte de crédit ou débit.",
            icon: CreditCard,
            href: "/account/deposit/card",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            processingTime: "Instantané",
            minAmount: "10€",
            comingSoon: true, // Temporairement désactivé
        },
    ];

    const handleMethodClick = (
        method: (typeof depositMethods)[0],
        e: React.MouseEvent,
    ) => {
        if (method.comingSoon) {
            e.preventDefault();
            toast.info(
                "Bientôt disponible ! Utilisez Virement Bancaire ou PayPal pour l'instant.",
            );
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Veuillez vous connecter pour accéder à cette page.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">Faire un dépôt</h1>
                <p className="text-muted-foreground">
                    Choisissez votre méthode de paiement préférée pour ajouter
                    des fonds à votre compte.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {depositMethods.map((method) => (
                    <Link
                        key={method.title}
                        href={method.href}
                        className={cn(
                            "group",
                            method.comingSoon && "cursor-pointer",
                        )}
                        onClick={(e) => handleMethodClick(method, e)}
                    >
                        <Card
                            className={cn(
                                "h-full transition-all",
                                method.comingSoon
                                    ? "opacity-60 border-dashed hover:border-muted-foreground/40"
                                    : "hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5",
                            )}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                                            method.bgColor,
                                        )}
                                    >
                                        <method.icon
                                            className={cn(
                                                "w-6 h-6",
                                                method.color,
                                            )}
                                        />
                                    </div>
                                    {method.comingSoon && (
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                            <Clock className="w-3 h-3" />
                                            Bientôt
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="text-xl">
                                    {method.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {method.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Délai:</span>
                                        <span className="font-medium text-foreground">
                                            {method.processingTime}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Min:</span>
                                        <span className="font-medium text-foreground">
                                            {method.minAmount}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    className={cn(
                                        "w-full mt-6 transition-colors",
                                        method.comingSoon
                                            ? "opacity-50 cursor-not-allowed"
                                            : "group-hover:bg-amber-500 group-hover:text-white",
                                    )}
                                    variant="outline"
                                    disabled={method.comingSoon}
                                >
                                    {method.comingSoon
                                        ? "Bientôt disponible"
                                        : "Choisir"}
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
