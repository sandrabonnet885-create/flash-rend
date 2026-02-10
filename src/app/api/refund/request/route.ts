import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const { amount, reason, description, userEmail, userId } = await request.json();

        // Validation des entrées
        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json(
                { error: "Montant invalide" },
                { status: 400 }
            );
        }

        if (!reason || typeof reason !== "string") {
            return NextResponse.json(
                { error: "Raison invalide" },
                { status: 400 }
            );
        }

        if (!description || description.trim().length < 10) {
            return NextResponse.json(
                { error: "Description trop courte (minimum 10 caractères)" },
                { status: 400 }
            );
        }

        if (!userEmail || !userId) {
            return NextResponse.json(
                { error: "Informations utilisateur manquantes" },
                { status: 400 }
            );
        }

        // Vérifier que l'utilisateur existe dans la base de données
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        // Vérifier que le montant ne dépasse pas le solde
        if (amount > dbUser.balance) {
            return NextResponse.json(
                { error: `Le montant demandé (${amount}€) dépasse votre solde disponible (${dbUser.balance}€)` },
                { status: 400 }
            );
        }

        // Créer la demande de remboursement
        const refundRequest = await prisma.refundRequest.create({
            data: {
                userId: dbUser.id,
                amount: parseFloat(amount.toFixed(2)),
                reason,
                description: description.trim(),
                status: "PENDING",
            },
        });

        // TODO: Envoyer une notification à l'admin
        // Vous pouvez utiliser EmailJS ou un autre service d'email
        console.log("Nouvelle demande de remboursement:", {
            id: refundRequest.id,
            user: userEmail,
            amount: refundRequest.amount,
            reason: refundRequest.reason,
        });

        return NextResponse.json({
            success: true,
            refundRequest: {
                id: refundRequest.id,
                amount: refundRequest.amount,
                status: refundRequest.status,
                createdAt: refundRequest.createdAt,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la création de la demande de remboursement:", error);

        return NextResponse.json(
            {
                error: "Une erreur est survenue lors du traitement de votre demande",
            },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
