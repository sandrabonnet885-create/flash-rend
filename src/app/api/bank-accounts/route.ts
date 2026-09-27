import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const bankAccounts = await prisma.bankAccount.findMany({
            where: { user: { clerkId: user.id } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(bankAccounts);
    } catch (error) {
        console.error("[BANK_ACCOUNTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { iban, bic, bankName, accountHolder } = body;

        if (!iban || !accountHolder) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Find database user to link
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        const bankAccount = await prisma.bankAccount.create({
            data: {
                userId: dbUser.id,
                iban,
                bic,
                bankName: bankName || "Banque inconnue",
                accountHolder,
                isDefault: false, // Could be logic to make first one default
            },
        });

        return NextResponse.json(bankAccount);
    } catch (error) {
        console.error("[BANK_ACCOUNTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
