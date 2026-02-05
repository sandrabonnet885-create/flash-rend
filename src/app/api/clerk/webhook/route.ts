import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("[Clerk Webhook] CLERK_WEBHOOK_SECRET is not set");
        throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.warn("[Clerk Webhook] Missing svix headers");
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("[Clerk Webhook] Signature verification failed:", err);
        return new Response("Error occured", { status: 400 });
    }

    const eventType = evt.type;
    console.log(`[Clerk Webhook] Received event: ${eventType}`);

    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name } = evt.data;

        console.log(`[Clerk Webhook] Creating user: ${id}`);
        console.log(
            `[Clerk Webhook] Event data:`,
            JSON.stringify(evt.data, null, 2),
        );
        console.log(
            `[Clerk Webhook] Email addresses:`,
            JSON.stringify(email_addresses, null, 2),
        );

        if (!email_addresses || email_addresses.length === 0) {
            console.error("[Clerk Webhook] ❌ No email addresses provided");
            return NextResponse.json(
                { error: "No email addresses provided" },
                { status: 400 },
            );
        }

        try {
            const userEmail = email_addresses[0].email_address;
            console.log(`[Clerk Webhook] Using email: ${userEmail}`);

            // 1. D'abord, vérifier si un utilisateur avec ce Clerk ID existe déjà
            const existingUserByClerkId = await prisma.user.findUnique({
                where: { clerkId: id },
            });

            if (existingUserByClerkId) {
                console.log(`[Clerk Webhook] User already exists with Clerk ID: ${id}. Updating...`);
                const updatedUser = await prisma.user.update({
                    where: { clerkId: id },
                    data: {
                        email: userEmail,
                        firstName: first_name || "",
                        lastName: last_name || "",
                    },
                });
                console.log(`[Clerk Webhook] ✅ User updated successfully: ${updatedUser.id}`);
                return new Response("", { status: 200 });
            }

            // 2. Si non, vérifier si un utilisateur avec cet email existe déjà
            const existingUserByEmail = await prisma.user.findUnique({
                where: { email: userEmail },
            });

            if (existingUserByEmail) {
                console.log(
                    `[Clerk Webhook] ⚠️ Email ${userEmail} already taken by user ${existingUserByEmail.id}. Linking to new Clerk ID: ${id}`,
                );
                const linkedUser = await prisma.user.update({
                    where: { email: userEmail },
                    data: {
                        clerkId: id,
                        firstName: first_name || "",
                        lastName: last_name || "",
                    },
                });
                console.log(`[Clerk Webhook] ✅ User account linked successfully: ${linkedUser.id}`);
                return new Response("", { status: 200 });
            }

            // 3. Si aucun des deux, créer un nouvel utilisateur
            console.log(`[Clerk Webhook] Creating new user...`);
            const newUser = await prisma.user.create({
                data: {
                    clerkId: id,
                    email: userEmail,
                    firstName: first_name || "",
                    lastName: last_name || "",
                    balance: 0,
                },
            });

            console.log(
                `[Clerk Webhook] ✅ User created successfully: ${newUser.id}`,
                `Email: ${newUser.email}`,
            );
        } catch (error) {
            console.error(
                "[Clerk Webhook] ❌ Error processing user:",
                error instanceof Error ? error.message : String(error),
            );
            console.error("[Clerk Webhook] Full error:", error);
            return NextResponse.json(
                { error: "Error processing user" },
                { status: 500 },
            );
        }
    } else if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name } = evt.data;

        console.log(`[Clerk Webhook] Updating user: ${id}`);
        console.log(
            `[Clerk Webhook] Update data:`,
            JSON.stringify(
                { id, email_addresses, first_name, last_name },
                null,
                2,
            ),
        );

        try {
            const updatedUser = await prisma.user.update({
                where: { clerkId: id },
                data: {
                    email: email_addresses?.[0]?.email_address,
                    firstName: first_name || undefined,
                    lastName: last_name || undefined,
                },
            });

            console.log(
                `[Clerk Webhook] ✅ User updated successfully: ${updatedUser.id}`,
            );
        } catch (error) {
            console.error(
                "[Clerk Webhook] ❌ Error updating user:",
                error instanceof Error ? error.message : String(error),
            );
        }
    } else if (eventType === "user.deleted") {
        const { id } = evt.data;

        console.log(`[Clerk Webhook] Deleting user: ${id}`);

        try {
            // Supprimer toutes les données associées
            await prisma.$transaction(async (tx) => {
                const deletedTransactions = await tx.transaction.deleteMany({
                    where: { user: { clerkId: id } },
                });

                const deletedBankAccounts = await tx.bankAccount.deleteMany({
                    where: { user: { clerkId: id } },
                });

                const deletedUser = await tx.user.delete({
                    where: { clerkId: id },
                });

                console.log(
                    `[Clerk Webhook] Deleted ${deletedTransactions.count} transactions`,
                );
                console.log(
                    `[Clerk Webhook] Deleted ${deletedBankAccounts.count} bank accounts`,
                );
            });

            console.log(`[Clerk Webhook] ✅ User deleted successfully: ${id}`);
        } catch (error) {
            console.error(
                "[Clerk Webhook] ❌ Error deleting user:",
                error instanceof Error ? error.message : String(error),
            );
        }
    } else {
        console.log(`[Clerk Webhook] ⚠️  Unhandled event type: ${eventType}`);
    }

    console.log(`[Clerk Webhook] ✅ Event processed successfully`);
    return new Response("", { status: 200 });
}
