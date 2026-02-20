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
import { Building2, CreditCard, Wallet } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
        },
        {
            title: "PayPal",
            description:
                "Paiement rapide et sécurisé avec votre compte PayPal.",
            icon: Wallet, // Use Wallet for now, or find a specific PayPal icon if available in Lucide or import SVG
            href: "/account/deposit/paypal",
            color: "text-sky-500",
            bgColor: "bg-sky-500/10",
            processingTime: "Instantané",
            minAmount: "10€",
        },
    ];

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
                        className="group"
                    >
                        <Card className="h-full transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5">
                            <CardHeader>
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                                        method.bgColor,
                                    )}
                                >
                                    <method.icon
                                        className={cn("w-6 h-6", method.color)}
                                    />
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
                                    className="w-full mt-6 group-hover:bg-amber-500 group-hover:text-white transition-colors"
                                    variant="outline"
                                >
                                    Choisir
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
