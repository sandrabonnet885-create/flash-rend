import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Valider le type d'image
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
        }

        // Limiter la taille (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Fichier trop volumineux (max 5MB)' }, { status: 400 });
        }

        // Upload vers Vercel Blob
        const blob = await put(`bank-transfers/${user.id}/${Date.now()}-${file.name}`, file, {
            access: 'public',
        });

        return NextResponse.json({
            url: blob.url,
            pathname: blob.pathname,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'upload' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
