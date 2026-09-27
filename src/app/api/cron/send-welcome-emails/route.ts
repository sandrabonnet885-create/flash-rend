import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: Request) {
    try {
        // Vérifier l'autorisation (secret token pour les cron jobs)
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Trouver les utilisateurs qui n'ont pas reçu l'email de bienvenue
        const users = await prisma.user.findMany({
            where: {
                welcomeEmailSent: false,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });

        let sentCount = 0;
        const errors: string[] = [];

        // Envoyer l'email de bienvenue à chaque utilisateur
        for (const user of users) {
            try {
                await sendWelcomeEmail(user);
                
                // Marquer l'email comme envoyé
                await prisma.user.update({
                    where: { id: user.id },
                    data: { welcomeEmailSent: true },
                });
                
                sentCount++;
            } catch (error) {
                console.error(`Error sending welcome email to ${user.email}:`, error);
                errors.push(user.email);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Welcome emails sent to ${sentCount} users`,
            totalUsers: users.length,
            sentCount,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Error in send-welcome-emails cron:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
