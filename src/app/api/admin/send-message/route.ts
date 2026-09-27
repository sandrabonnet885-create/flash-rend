import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { sendAdminMessageEmail } from "@/lib/email";

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        if (!user || !userEmail || !ADMIN_EMAILS.includes(userEmail)) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const body = await request.json();
        const { userId, email, subject, message } = body;

        if (!subject || typeof subject !== "string" || !subject.trim()) {
            return NextResponse.json({ error: "Le sujet est requis" }, { status: 400 });
        }

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "Le message est requis" }, { status: 400 });
        }

        let recipient: { email: string; firstName?: string | null };

        if (userId) {
            const targetUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!targetUser) {
                return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
            }
            recipient = { email: targetUser.email, firstName: targetUser.firstName };
        } else if (email && typeof email === "string") {
            if (!EMAIL_REGEX.test(email.trim())) {
                return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
            }
            recipient = { email: email.trim() };
        } else {
            return NextResponse.json(
                { error: "Un utilisateur ou une adresse email est requis" },
                { status: 400 }
            );
        }

        await sendAdminMessageEmail(recipient, subject.trim(), message.trim());

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_SEND_MESSAGE]", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export const dynamic = "force-dynamic";
