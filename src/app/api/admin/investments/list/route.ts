import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];

async function isAdmin(userEmail: string | null): Promise<boolean> {
    if (!userEmail) return false;
    return ADMIN_EMAILS.includes(userEmail);
}

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress ?? null;
        if (!user || !(await isAdmin(userEmail))) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        const investments = await prisma.investment.findMany({
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

        const stats = {
            total: investments.length,
            active: investments.filter((i) => i.status === "ACTIVE").length,
            totalAmount: investments.reduce((sum, i) => sum + i.amount, 0),
            totalReturns: investments.reduce((sum, i) => sum + i.potentialReturn, 0),
        };

        return NextResponse.json({ investments, stats });
    } catch (error) {
        console.error("Error fetching investments:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
