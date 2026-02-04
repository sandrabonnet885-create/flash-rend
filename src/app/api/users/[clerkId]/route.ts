import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { clerkId: string } },
) {
    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: params.clerkId },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 },
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
