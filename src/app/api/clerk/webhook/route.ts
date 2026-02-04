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

        try {
            const newUser = await prisma.user.create({
                data: {
                    clerkId: id,
                    email: email_addresses[0].email_address,
                    firstName: first_name,
                    lastName: last_name,
                    balance: 0,
                },
            });

            console.log(
                `[Clerk Webhook] ✅ User created successfully: ${newUser.id}`,
                `Email: ${newUser.email}`,
            );
        } catch (error) {
            console.error(
                "[Clerk Webhook] ❌ Error creating user in database:",
                error,
            );
            return NextResponse.json(
                { error: "Error creating user in database" },
                { status: 500 },
            );
        }
    } else if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name } = evt.data;

        console.log(`[Clerk Webhook] Updating user: ${id}`);

        try {
            const updatedUser = await prisma.user.update({
                where: { clerkId: id },
                data: {
                    email: email_addresses?.[0]?.email_address,
                    firstName: first_name,
                    lastName: last_name,
                },
            });

            console.log(
                `[Clerk Webhook] ✅ User updated successfully: ${updatedUser.id}`,
            );
        } catch (error) {
            console.error("[Clerk Webhook] ❌ Error updating user:", error);
        }
    } else if (eventType === "user.deleted") {
        const { id } = evt.data;

        console.log(`[Clerk Webhook] Deleting user: ${id}`);

        try {
            // Supprimer toutes les données associées
            await prisma.$transaction(async (tx) => {
                await tx.transaction.deleteMany({
                    where: { user: { clerkId: id } },
                });

                await tx.bankAccount.deleteMany({
                    where: { user: { clerkId: id } },
                });

                await tx.user.delete({
                    where: { clerkId: id },
                });
            });

            console.log(`[Clerk Webhook] ✅ User deleted successfully: ${id}`);
        } catch (error) {
            console.error("[Clerk Webhook] ❌ Error deleting user:", error);
        }
    }

    console.log(`[Clerk Webhook] ✅ Event processed successfully`);
    return new Response("", { status: 200 });
}
