"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function DepositSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const method = searchParams.get("method") || "PayPal";
    const amount = searchParams.get("amount");

    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown <= 0) {
            router.push("/account");
            return;
        }
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, router]);

    return (
        <div className="container mx-auto px-4 py-16 max-w-lg flex flex-col items-center">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                    <CheckCircle className="relative h-20 w-20 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Dépôt confirmé !</h1>
                <p className="text-muted-foreground">
                    Votre paiement via {method} a été traité avec succès.
                    {amount && (
                        <span className="block mt-1 text-foreground font-semibold text-lg">
                            {parseFloat(amount).toFixed(2)}€ crédité sur votre
                            compte.
                        </span>
                    )}
                </p>
            </div>

            <Card className="w-full border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Que faire maintenant ?
                    </CardTitle>
                    <CardDescription>
                        Votre nouveau solde est disponible immédiatement.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button asChild className="w-full" size="lg">
                        <Link href="/account/investments">
                            Investir mes fonds
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        size="lg"
                    >
                        <Link href="/account/transactions">
                            <History className="mr-2 h-4 w-4" />
                            Voir mes transactions
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <p className="mt-6 text-sm text-muted-foreground">
                Redirection automatique vers votre compte dans{" "}
                <span className="font-semibold text-foreground">
                    {countdown}s
                </span>
                …
            </p>
        </div>
    );
}
