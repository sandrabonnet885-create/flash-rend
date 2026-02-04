import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schémas de validation
const updateUserSchema = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    email: z.string().email().optional(),
});

type UpdateUserInput = z.infer<typeof updateUserSchema>;

// GET /api/users/[clerkId]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ clerkId: string }> },
) {
    try {
        const { clerkId } = await params;

        console.log(`[API] Fetching user with Clerk ID: ${clerkId}`);

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: {
                transactions: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
                bankAccounts: true,
            },
        });

        if (!user) {
            console.warn(`[API] User not found with Clerk ID: ${clerkId}`);
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 },
            );
        }

        console.log(`[API] ✅ User fetched successfully: ${user.id}`);
        return NextResponse.json(user);
    } catch (error) {
        console.error("[API] ❌ Error fetching user:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PATCH /api/users/[clerkId] - Mettre à jour le profil
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ clerkId: string }> },
) {
    try {
        const { clerkId } = await params;

        console.log(`[API] Updating user with Clerk ID: ${clerkId}`);

        // Parser et valider le body
        const body = await request.json();
        const validatedData = updateUserSchema.parse(body);

        // Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            console.warn(`[API] User not found with Clerk ID: ${clerkId}`);
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 },
            );
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { clerkId },
            data: validatedData,
        });

        console.log(
            `[API] ✅ User updated successfully: ${user.id}`,
            `Fields updated: ${Object.keys(validatedData).join(", ")}`,
        );

        return NextResponse.json(updatedUser);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.warn("[API] Validation error:", error.issues);
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: error.issues.map((e) => ({
                        path: e.path.join("."),
                        message: e.message,
                    })),
                },
                { status: 400 },
            );
        }

        console.error("[API] ❌ Error updating user:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/users/[clerkId] - Supprimer le compte
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ clerkId: string }> },
) {
    try {
        const { clerkId } = await params;

        console.log(`[API] Deleting user with Clerk ID: ${clerkId}`);

        // Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            console.warn(`[API] User not found with Clerk ID: ${clerkId}`);
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 },
            );
        }

        // Supprimer toutes les données associées dans une transaction
        await prisma.$transaction(async (tx) => {
            // Supprimer les transactions
            await tx.transaction.deleteMany({
                where: { userId: user.id },
            });

            // Supprimer les comptes bancaires
            await tx.bankAccount.deleteMany({
                where: { userId: user.id },
            });

            // Supprimer l'utilisateur
            await tx.user.delete({
                where: { id: user.id },
            });
        });

        console.log(
            `[API] ✅ User deleted successfully: ${user.id}`,
            `Email: ${user.email}`,
        );

        return NextResponse.json({
            success: true,
            message: "Compte supprimé avec succès",
            userId: user.id,
        });
    } catch (error) {
        console.error("[API] ❌ Error deleting user:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
