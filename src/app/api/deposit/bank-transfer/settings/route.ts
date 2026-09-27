import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.bankTransferSettings.findFirst({
            where: { isActive: true },
        });

        if (!settings) {
            // Retourner les paramètres par défaut si aucun n'existe
            return NextResponse.json({
                accountHolder: "CHLOE MELODIE PECHOUX",
                iban: "FR76 1723 8000 0100 3187 9560 175",
                bic: "SCSYFRP2",
                bankName: "PCS",
                instructions: "Veuillez effectuer votre virement en utilisant les informations ci-dessus. N'oubliez pas d'indiquer votre référence unique dans le libellé du virement.",
                isActive: true,
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching bank transfer settings:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
