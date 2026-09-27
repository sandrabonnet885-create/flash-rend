import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];

async function isAdmin(userEmail: string | null): Promise<boolean> {
    if (!userEmail) return false;
    return ADMIN_EMAILS.includes(userEmail);
}

export async function GET() {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress ?? null;
        if (!user || !(await isAdmin(userEmail))) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        const settings = await prisma.bankTransferSettings.findFirst({
            where: { isActive: true },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress ?? null;
        if (!user || !(await isAdmin(userEmail))) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { accountHolder, iban, bic, bankName, instructions, isActive } = body;

        // Validation
        if (!accountHolder || !iban || !bic || !bankName) {
            return NextResponse.json(
                { error: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        // Désactiver tous les paramètres existants
        await prisma.bankTransferSettings.updateMany({
            data: { isActive: false },
        });

        // Créer ou mettre à jour les paramètres
        const settings = await prisma.bankTransferSettings.create({
            data: {
                accountHolder,
                iban,
                bic,
                bankName,
                instructions: instructions || null,
                isActive: isActive !== false,
            },
        });

        return NextResponse.json({
            success: true,
            settings,
            message: "Paramètres mis à jour avec succès",
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
