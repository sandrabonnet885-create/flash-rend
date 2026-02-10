import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

async function isAdmin(userId: string): Promise<boolean> {
    return true; // TODO: Implémenter la vérification admin
}

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user || !(await isAdmin(user.id))) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        const refunds = await prisma.refundRequest.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json({ refunds });
    } catch (error) {
        console.error("Error fetching refunds:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
