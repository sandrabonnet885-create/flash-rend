"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BonusClaimCardProps {
    bonusClaimed: boolean;
}

export function BonusClaimCard({ bonusClaimed }: BonusClaimCardProps) {
    const [isClaiming, setIsClaiming] = useState(false);
    const router = useRouter();

    if (bonusClaimed) {
        return null; // Don't show if already claimed
    }

    const handleClaim = async () => {
        setIsClaiming(true);
        try {
            const res = await fetch("/api/bonus/claim", {
                method: "POST",
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg);
            }

            const data = await res.json();
            toast.success(`Bonus réclamé ! Nouveau solde : €${data.newBalance.toFixed(2)}`);
            router.refresh(); // Refresh to update UI
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la réclamation du bonus");
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:from-amber-500/15 hover:to-orange-500/15 transition-all">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5 text-amber-500" />
                    Bonus de Test
                </CardTitle>
                <CardDescription>
                    Réclamez votre bonus de bienvenue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                    {isClaiming ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Réclamation...
                        </>
                    ) : (
                        "Réclamer 0.50€"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
