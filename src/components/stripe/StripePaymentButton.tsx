"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, ReactNode } from "react";

type StripePaymentButtonProps = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onError"
> & {
    amount: number;
    description: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    children: ReactNode;
};

export function StripePaymentButton({
    amount,
    description,
    onSuccess,
    onError,
    children,
    ...props
}: StripePaymentButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const handleClick = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        setIsLoading(true);

        try {
            const userInDb = await fetch(`/api/users/${user.id}`).then((res) =>
                res.json(),
            );

            if (!userInDb) {
                throw new Error(
                    "Problème avec votre compte. Veuillez vous reconnecter.",
                );
            }

            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount,
                    userEmail: user.emailAddresses[0].emailAddress,
                    userId: user.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors du paiement");
            }

            // Rediriger vers la page de paiement Stripe
            window.location.href = data.url;
            onSuccess?.();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Une erreur est survenue lors du paiement");
            onError?.(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isLoading || !amount || amount < 1}
            {...props}
        >
            {isLoading ? "Traitement..." : children}
        </Button>
    );
}
