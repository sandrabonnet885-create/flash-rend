import { NextRequest, NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";
import prisma from "@/lib/prisma";

const MIN_DEPOSIT_AMOUNT = 10; // Montant minimum en EUR
const CURRENCY = "EUR";

// Configure PayPal environment
// Utiliser PAYPAL_MODE="sandbox" ou "live" pour contrôler indépendamment de NODE_ENV
// Cela permet de tester en sandbox même sur Vercel (production)
const isSandbox = process.env.PAYPAL_MODE !== "live";

const Environment = isSandbox
    ? paypal.core.SandboxEnvironment
    : paypal.core.LiveEnvironment;

const client = new paypal.core.PayPalHttpClient(
    new Environment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!,
    ),
);

export async function POST(req: NextRequest) {
    try {
        const { amount, userId } = await req.json();

        if (!amount || !userId) {
            return NextResponse.json(
                { error: "Champs requis manquants" },
                { status: 400 },
            );
        }

        const parsedAmount = parseFloat(amount);

        // Validation du montant minimum
        if (isNaN(parsedAmount) || parsedAmount < MIN_DEPOSIT_AMOUNT) {
            return NextResponse.json(
                {
                    error: `Le montant minimum de dépôt est de ${MIN_DEPOSIT_AMOUNT}€`,
                },
                { status: 400 },
            );
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: CURRENCY,
                        value: parsedAmount.toFixed(2), // Format précis 2 décimales
                    },
                    custom_id: userId, // Store clerkId for linkage after capture
                },
            ],
        });

        const order = await client.execute(request);

        return NextResponse.json({ id: order.result.id });
    } catch (error: any) {
        console.error("[PAYPAL_CREATE_ORDER]", error);
        return NextResponse.json(
            {
                error:
                    error.message ||
                    "Erreur lors de la création de la commande",
            },
            { status: 500 },
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { orderID } = await req.json();

        if (!orderID) {
            return NextResponse.json(
                { error: "orderID manquant" },
                { status: 400 },
            );
        }

        // Idempotence : vérifier si cet ordre a déjà été capturé et traité
        const existingTransaction = await prisma.transaction.findFirst({
            where: { paypalOrderId: orderID },
        });

        if (existingTransaction) {
            console.log(`[PAYPAL_CAPTURE] Order ${orderID} already processed.`);
            return NextResponse.json({
                status: "ALREADY_PROCESSED",
                message: "Ce paiement a déjà été traité",
            });
        }

        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({} as any);

        const capture = await client.execute(request);
        const captureResult = capture.result;

        if (captureResult.status === "COMPLETED") {
            const purchaseUnit = captureResult.purchase_units[0];
            const captureInfo = purchaseUnit.payments.captures[0];
            const amountValue = captureInfo.amount.value;
            const captureCurrency = captureInfo.amount.currency_code;
            const userId = purchaseUnit.custom_id;

            // Validation de la devise retournée par PayPal
            if (captureCurrency !== CURRENCY) {
                console.error(
                    `[PAYPAL_CAPTURE] Unexpected currency: ${captureCurrency}`,
                );
                return NextResponse.json(
                    { error: `Devise inattendue: ${captureCurrency}` },
                    { status: 400 },
                );
            }

            console.log(
                `[PAYPAL_CAPTURE] Payment captured for user ${userId}: ${amountValue} ${captureCurrency}`,
            );

            if (userId) {
                await prisma.$transaction(async (tx) => {
                    // Double vérification dans la transaction (race condition)
                    const alreadyExists = await tx.transaction.findFirst({
                        where: { paypalOrderId: orderID },
                    });
                    if (alreadyExists) return;

                    await tx.user.update({
                        where: { clerkId: userId },
                        data: {
                            balance: { increment: parseFloat(amountValue) },
                        },
                    });

                    const dbUser = await tx.user.findUnique({
                        where: { clerkId: userId },
                        select: { id: true },
                    });

                    if (!dbUser)
                        throw new Error(
                            "Utilisateur introuvable après mise à jour",
                        );

                    await tx.transaction.create({
                        data: {
                            userId: dbUser.id,
                            amount: parseFloat(amountValue),
                            type: "DEPOSIT",
                            status: "COMPLETED",
                            description: `Dépôt PayPal`,
                            reference: captureResult.id,
                            method: "PAYPAL",
                            currency: CURRENCY,
                            paypalOrderId: orderID,
                        },
                    });
                });
            }
        }

        return NextResponse.json(captureResult);
    } catch (error: any) {
        console.error("[PAYPAL_CAPTURE_ORDER]", error);
        return NextResponse.json(
            { error: error.message || "Erreur lors de la capture du paiement" },
            { status: 500 },
        );
    }
}
