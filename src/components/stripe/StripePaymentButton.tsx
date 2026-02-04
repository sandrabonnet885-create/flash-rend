"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface StripePaymentButtonProps {
    amount: number;
    description: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    className?: string;
    children?: React.ReactNode;
}

export function StripePaymentButton({
    amount,
    description,
    onSuccess,
    onError,
    className = "",
    children,
}: StripePaymentButtonProps) {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        if (!user) {
            toast.error(
                "Veuvez-vous vous connecter pour effectuer un paiement"
            );
            return;
        }

        if (amount < 1) {
            toast.error("Le montant doit être supérieur à 0");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    userEmail: user.emailAddresses[0]?.emailAddress,
                    userId: user.id,
                    description,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.error || "Erreur lors de la création du paiement"
                );
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
                onSuccess?.();
            }
        } catch (error) {
            console.error("Payment error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue";
            toast.error(`Erreur de paiement: ${errorMessage}`);
            onError?.(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handlePayment}
            disabled={isLoading || amount < 1}
            className={`${className} gap-2`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Traitement...
                </>
            ) : (
                <>
                    <CreditCard className="h-4 w-4" />
                    {children || `Payer ${amount.toFixed(2)}€`}
                </>
            )}
        </Button>
    );
}
