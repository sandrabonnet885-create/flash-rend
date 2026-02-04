import prisma from "./prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";

interface CreateTransactionParams {
    userId: string;
    amount: number;
    type: TransactionType;
    status?: TransactionStatus;
    description?: string;
    reference?: string;
    metadata?: Record<string, any>;
    stripePaymentId?: string;
    bankAccountId?: string;
}

export async function createTransaction(params: CreateTransactionParams) {
    const {
        userId,
        amount,
        type,
        status = "PENDING",
        description,
        reference,
        metadata,
        stripePaymentId,
        bankAccountId,
    } = params;

    return prisma.transaction.create({
        data: {
            userId,
            amount,
            type,
            status,
            description,
            reference,
            metadata,
            stripePaymentId,
            bankAccountId,
        },
    });
}

export async function getUserTransactions(userId: string) {
    return prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            bankAccount: true,
        },
    });
}

export async function updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
    metadata: Record<string, any> = {},
) {
    return prisma.transaction.update({
        where: { id: transactionId },
        data: {
            status,
            metadata: {
                ...metadata,
                updatedAt: new Date().toISOString(),
            },
        },
    });
}
