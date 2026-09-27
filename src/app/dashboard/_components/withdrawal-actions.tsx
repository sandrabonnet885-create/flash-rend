"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function WithdrawalActions({ transactionId }: { transactionId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAction = async (status: "COMPLETED" | "FAILED") => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/withdrawals/${transactionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) throw new Error("Erreur serveur");

            toast.success(status === "COMPLETED" ? "Retrait validé" : "Retrait refusé");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 justify-end">
            <Button
                size="sm"
                variant="outline"
                className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-600"
                onClick={() => handleAction("FAILED")}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="text-green-500 border-green-500/20 hover:bg-green-500/10 hover:text-green-600"
                onClick={() => handleAction("COMPLETED")}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
        </div>
    );
}
