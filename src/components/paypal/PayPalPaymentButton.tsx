"use client";

import { useEffect, useState } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// This values are the default ones from the documentation
// You should change them in your .env file
const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "EUR",
    intent: "capture",
};

interface PayPalPaymentButtonProps {
    amount: number;
    onSuccess: () => void;
    onError: (error: Error) => void;
}

const ButtonWrapper = ({
    amount,
    onSuccess,
    onError,
}: PayPalPaymentButtonProps) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const { user } = useUser();

    return (
        <>
            {isPending && (
                <div className="flex justify-center p-4">
                    <Loader2 className="animate-spin" />
                </div>
            )}
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect", label: "pay" }}
                disabled={false}
                forceReRender={[amount, "EUR", { layout: "vertical" }]}
                fundingSource={undefined}
                createOrder={async (data: any, actions: any) => {
                    try {
                        const response = await fetch("/api/paypal", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                amount: amount,
                                userId: user?.id,
                                userEmail:
                                    user?.primaryEmailAddress?.emailAddress,
                            }),
                        });

                        const orderData = await response.json();

                        if (orderData.id) {
                            return orderData.id;
                        } else {
                            const errorDetail = orderData?.details?.[0];
                            const errorMessage = errorDetail
                                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                : JSON.stringify(orderData);

                            throw new Error(errorMessage);
                        }
                    } catch (error) {
                        console.error(error);
                        onError(error as Error);
                        // Return a dummy order id to avoid button error display if needed, but better to handle error
                        return "";
                    }
                }}
                onApprove={async (data: any, actions: any) => {
                    try {
                        const response = await fetch("/api/paypal", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                orderID: data.orderID,
                            }),
                        });

                        const orderData = await response.json();
                        const errorDetail = orderData?.details?.[0];

                        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                            return actions.restart();
                        } else if (errorDetail) {
                            // (2) Other non-recoverable errors -> Show a failure message
                            throw new Error(
                                `${errorDetail.description} (${orderData.debug_id})`,
                            );
                        } else {
                            // (3) Successful transaction -> Show confirmation or thank you message
                            // Or go to a success page
                            onSuccess();
                        }
                    } catch (error) {
                        console.error(error);
                        onError(error as Error);
                    }
                }}
                onError={(err: any) => {
                    console.error("PayPal Checkout onError", err);
                    onError(err as Error);
                }}
            />
        </>
    );
};

export default function PayPalPaymentButton({
    amount,
    onSuccess,
    onError,
}: PayPalPaymentButtonProps) {
    return (
        <PayPalScriptProvider options={initialOptions}>
            <ButtonWrapper
                amount={amount}
                onSuccess={onSuccess}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
}
