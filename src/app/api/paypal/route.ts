import { NextRequest, NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";
import prisma from "@/lib/prisma"; // Adjust path if needed

// Configure PayPal environment
const Environment =
    process.env.NODE_ENV === "production"
        ? paypal.core.LiveEnvironment
        : paypal.core.SandboxEnvironment;

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
                { error: "Missing required fields" },
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
                        currency_code: "EUR",
                        value: amount.toString(),
                    },
                    custom_id: userId, // Store userId to link payment later
                },
            ],
        });

        const order = await client.execute(request);

        return NextResponse.json({ id: order.result.id });
    } catch (error: any) {
        console.error("Error creating PayPal order:", error);
        return NextResponse.json(
            { error: error.message || "Error creating order" },
            { status: 500 },
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { orderID } = await req.json();

        if (!orderID) {
            return NextResponse.json(
                { error: "Missing orderID" },
                { status: 400 },
            );
        }

        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        // Cast to any to bypass strict type check for empty body in capture request
        request.requestBody({} as any);

        const capture = await client.execute(request);
        const captureResult = capture.result;

        // Check if transaction is completed
        if (captureResult.status === "COMPLETED") {
            const purchaseUnit = captureResult.purchase_units[0];
            const amountValue = purchaseUnit.payments.captures[0].amount.value;
            const userId = purchaseUnit.custom_id; // Retrieve userId from custom_id

            console.log(
                `Payment captured successfully for user ${userId}: ${amountValue} EUR`,
            );

            try {
                if (userId) {
                    await prisma.$transaction(async (tx) => {
                        // Update user balance
                        await tx.user.update({
                            where: { id: userId },
                            data: {
                                balance: { increment: parseFloat(amountValue) },
                            },
                        });

                        // Create transaction record
                        await tx.transaction.create({
                            data: {
                                userId: userId,
                                amount: parseFloat(amountValue),
                                type: "DEPOSIT",
                                status: "COMPLETED",
                                description: `Dépôt PayPal`,
                                reference: captureResult.id,
                                method: "PAYPAL",
                                paypalOrderId: captureResult.id,
                            },
                        });
                    });
                }
            } catch (dbError) {
                console.error("Database update error:", dbError);
                // The payment was captured on PayPal's side, but we failed to update our DB.
                // This is a critical state that might need manual intervention or an admin alert.
                return NextResponse.json(
                    {
                        error: "Payment captured but database update failed",
                        capture: captureResult,
                    },
                    { status: 500 },
                );
            }
        }

        return NextResponse.json(captureResult);
    } catch (error: any) {
        console.error("Error capturing PayPal order:", error);
        return NextResponse.json(
            { error: error.message || "Error capturing order" },
            { status: 500 },
        );
    }
}
