import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userEmail = user.emailAddresses[0]?.emailAddress;
        if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { id } = await params;
        const { status } = await req.json();

        if (!["COMPLETED", "FAILED"].includes(status)) {
            return new NextResponse("Invalid status", { status: 400 });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!transaction) {
            return new NextResponse("Transaction not found", { status: 404 });
        }

        if (transaction.status !== "PENDING") {
            return new NextResponse("Transaction already processed", { status: 400 });
        }

        if (status === "COMPLETED") {
            // Just mark as completed, money was already deducted
            await prisma.transaction.update({
                where: { id },
                data: { status: "COMPLETED" },
            });
        } else if (status === "FAILED") {
            // Refund the user using a transaction
            await prisma.$transaction(async (tx) => {
                // Update original transaction
                await tx.transaction.update({
                    where: { id },
                    data: { status: "FAILED" }, // Or REJECTED if enum allows, using FAILED for now
                });

                // Refund balance
                const currentBalance = transaction.user.balance;
                await tx.user.update({
                    where: { id: transaction.userId },
                    data: { balance: currentBalance + transaction.amount },
                });
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_WITHDRAWAL_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
