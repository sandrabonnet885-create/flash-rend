import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        // Récupérer l'utilisateur de la base de données
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        // Récupérer toutes les demandes de remboursement de l'utilisateur
        const refundRequests = await prisma.refundRequest.findMany({
            where: { userId: dbUser.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            refundRequests,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des demandes de remboursement:", error);

        return NextResponse.json(
            {
                error: "Une erreur est survenue lors de la récupération des demandes",
            },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
