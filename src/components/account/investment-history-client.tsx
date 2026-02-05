"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Investment = {
    id: string;
    createdAt: string;
    endsAt: string;
    amount: number;
    multiplier: number;
    potentialReturn: number;
    status: "ACTIVE" | "COMPLETED" | "CLOSED";
};

export default function InvestmentHistoryClient() {
    const router = useRouter();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInvestments = async () => {
        try {
            const res = await fetch("/api/investments");
            if (res.ok) {
                const data = await res.json();
                setInvestments(data);
            }
        } catch (error) {
            console.error("Failed to fetch investments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
        // Poll every 30 seconds to check for status updates
        const interval = setInterval(fetchInvestments, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    const TimeRemaining = ({ endsAt, status }: { endsAt: string, status: string }) => {
        const [timeLeft, setTimeLeft] = useState<string>("");

        useEffect(() => {
            if (status !== "ACTIVE") return;

            const updateTimer = () => {
                const now = new Date().getTime();
                const end = new Date(endsAt).getTime();
                const diff = end - now;

                if (diff <= 0) {
                    setTimeLeft("Terminé (Actualisation...)");
                    // Trigger refresh slightly after
                    return;
                }

                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            };

            updateTimer();
            const timer = setInterval(updateTimer, 1000);
            return () => clearInterval(timer);
        }, [endsAt, status]);

        if (status === "COMPLETED") return <span className="text-green-600 font-medium">Terminé</span>;
        if (status === "CLOSED") return <span>Fermé</span>;
        
        return <span className="font-mono text-amber-600">{timeLeft || "Calcul..."}</span>;
    };

    if (loading) {
        return <div className="py-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>;
    }

    return (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="text-right">Retour Est.</TableHead>
                    <TableHead className="text-center">Fin dans</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {investments.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Aucun investissement pour le moment.
                        </TableCell>
                    </TableRow>
                ) : (
                    investments.map((inv) => (
                        <TableRow key={inv.id}>
                            <TableCell>
                                {format(new Date(inv.createdAt), "dd MMM HH:mm", { locale: fr })}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatCurrency(inv.amount)}
                            </TableCell>
                            <TableCell className="text-right font-bold text-green-600">
                                {formatCurrency(inv.potentialReturn)}
                            </TableCell>
                            <TableCell className="text-center">
                                <TimeRemaining endsAt={inv.endsAt} status={inv.status} />
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant={inv.status === "ACTIVE" ? "default" : "secondary"}>
                                    {inv.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
