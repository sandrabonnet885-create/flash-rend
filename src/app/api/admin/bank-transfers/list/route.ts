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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        const where = status ? { status: status as any } : {};

        const deposits = await prisma.bankTransferDeposit.findMany({
            where,
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const stats = {
            total: deposits.length,
            pending: deposits.filter((d) => d.status === "PENDING").length,
            approved: deposits.filter((d) => d.status === "APPROVED").length,
            rejected: deposits.filter((d) => d.status === "REJECTED").length,
            totalAmount: deposits.reduce((sum, d) => sum + d.amount, 0),
        };

        return NextResponse.json({ deposits, stats });
    } catch (error) {
        console.error("Error fetching bank transfers:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
