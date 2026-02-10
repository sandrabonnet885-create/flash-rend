"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Check, X, ExternalLink, TrendingUp, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Deposit = {
    id: string;
    amount: number;
    reference: string;
    transferDate: Date;
    status: "PENDING" | "APPROVED" | "REJECTED";
    proofUrl: string | null;
    adminNote: string | null;
    createdAt: Date;
    user: {
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
};

const STATUS_CONFIG = {
    PENDING: {
        label: "En attente",
        className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    },
    APPROVED: {
        label: "Approuvé",
        className: "bg-green-500/10 text-green-500 border-green-500/30",
    },
    REJECTED: {
        label: "Rejeté",
        className: "bg-red-500/10 text-red-500 border-red-500/30",
    },
};

export default function AdminBankTransfersPage() {
    const router = useRouter();
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalAmount: 0,
    });
    const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [adminNote, setAdminNote] = useState("");

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const response = await fetch("/api/admin/bank-transfers/list");
            if (response.ok) {
                const data = await response.json();
                setDeposits(data.deposits);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching deposits:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcess = async (depositId: string, status: "APPROVED" | "REJECTED") => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/admin/bank-transfers/${depositId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminNote }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setSelectedDeposit(null);
                setAdminNote("");
                fetchDeposits();
                router.refresh();
            } else {
                toast.error(data.error || "Erreur lors du traitement");
            }
        } catch (error) {
            console.error("Error processing deposit:", error);
            toast.error("Erreur serveur");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Dépôts par virement bancaire</h1>
                <p className="text-foreground/60 mt-1">
                    Gérez les demandes de dépôt par virement
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Total dépôts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            En attente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Approuvés
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Montant total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAmount.toFixed(2)}€</div>
                    </CardContent>
                </Card>
            </div>

            {/* Deposits Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Liste des dépôts</CardTitle>
                    <CardDescription>Tous les dépôts par virement bancaire</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Utilisateur</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Date virement</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deposits.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8 text-foreground/60"
                                        >
                                            Aucun dépôt trouvé
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    deposits.map((deposit) => (
                                        <TableRow key={deposit.id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {deposit.user.firstName} {deposit.user.lastName}
                                                </div>
                                                <div className="text-xs text-foreground/60">
                                                    {deposit.user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {deposit.amount.toFixed(2)}€
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {deposit.reference}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(deposit.transferDate),
                                                    "dd MMM yyyy",
                                                    { locale: fr }
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={STATUS_CONFIG[deposit.status].className}>
                                                    {STATUS_CONFIG[deposit.status].label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedDeposit(deposit)}
                                                >
                                                    Détails
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!selectedDeposit} onOpenChange={() => setSelectedDeposit(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Détails du dépôt</DialogTitle>
                        <DialogDescription>
                            Vérifiez les informations et approuvez ou rejetez le dépôt
                        </DialogDescription>
                    </DialogHeader>

                    {selectedDeposit && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-foreground/60">Utilisateur</p>
                                    <p className="font-medium">
                                        {selectedDeposit.user.firstName} {selectedDeposit.user.lastName}
                                    </p>
                                    <p className="text-xs text-foreground/60">
                                        {selectedDeposit.user.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-foreground/60">Montant</p>
                                    <p className="text-lg font-bold text-amber-500">
                                        {selectedDeposit.amount.toFixed(2)}€
                                    </p>
                                </div>
                                <div>
                                    <p className="text-foreground/60">Référence</p>
                                    <p className="font-mono">{selectedDeposit.reference}</p>
                                </div>
                                <div>
                                    <p className="text-foreground/60">Date du virement</p>
                                    <p className="font-medium">
                                        {format(new Date(selectedDeposit.transferDate), "dd MMMM yyyy", {
                                            locale: fr,
                                        })}
                                    </p>
                                </div>
                            </div>

                            {selectedDeposit.proofUrl && (
                                <div>
                                    <p className="text-sm text-foreground/60 mb-2">Preuve de virement</p>
                                    <a
                                        href={selectedDeposit.proofUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-amber-500 hover:underline flex items-center gap-1"
                                    >
                                        Voir la preuve
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}

                            {selectedDeposit.status === "PENDING" && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Note administrative (optionnel)
                                        </label>
                                        <Textarea
                                            placeholder="Ajoutez une note..."
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500/10"
                                            onClick={() => handleProcess(selectedDeposit.id, "REJECTED")}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <X className="mr-2 h-4 w-4" />
                                                    Rejeter
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={() => handleProcess(selectedDeposit.id, "APPROVED")}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Approuver
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}

                            {selectedDeposit.adminNote && (
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-foreground/60 mb-1">Note administrative</p>
                                    <p className="text-sm">{selectedDeposit.adminNote}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
