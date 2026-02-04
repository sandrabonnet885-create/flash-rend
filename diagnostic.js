#!/usr/bin/env node

/**
 * 🔧 Script de Diagnostic - FlashRend
 *
 * Usage:
 *   node diagnostic.js
 *   npm run diagnostic
 */

const fs = require("fs");
const path = require("path");
require("dotenv").config();

console.log("\n🔍 Diagnostic FlashRend - " + new Date().toLocaleString());
console.log("==================================\n");

// 1. Vérifier les variables d'environnement
console.log("1️⃣  Vérification des Variables d'Environnement");
console.log("---");

const requiredEnvVars = [
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "CLERK_SECRET_KEY",
    "CLERK_WEBHOOK_SECRET",
];

let missingEnvCount = 0;

requiredEnvVars.forEach((envVar) => {
    if (process.env[envVar]) {
        console.log(`✅ ${envVar}: SET`);
    } else {
        console.log(`❌ ${envVar}: MANQUANTE`);
        missingEnvCount++;
    }
});

console.log("");

// 2. Vérifier les fichiers critiques
console.log("2️⃣  Fichiers Critiques");
console.log("---");

const criticalFiles = [
    "src/app/api/stripe/webhooks/route.ts",
    "src/app/api/clerk/webhook/route.ts",
    "src/app/api/users/[clerkId]/route.ts",
    "src/app/api/withdrawals/route.ts",
    "prisma/schema.prisma",
];

let missingFilesCount = 0;

criticalFiles.forEach((file) => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file}: MANQUANT`);
        missingFilesCount++;
    }
});

console.log("");

// 3. Vérifier les migrations
console.log("3️⃣  État des Migrations");
console.log("---");

const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
if (fs.existsSync(migrationsDir)) {
    const migrations = fs.readdirSync(migrationsDir).filter((f) => {
        return fs.statSync(path.join(migrationsDir, f)).isDirectory();
    });
    console.log(`✅ ${migrations.length} migration(s) trouvée(s)`);
    migrations.forEach((m) => {
        console.log(`   - ${m}`);
    });
} else {
    console.log("❌ Aucune migration trouvée");
}

console.log("");

// 4. Vérifier les dépendances
console.log("4️⃣  Dépendances Critiques");
console.log("---");

const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
    };

    const requiredPackages = [
        "@prisma/client",
        "stripe",
        "@clerk/nextjs",
        "zod",
        "next",
    ];

    requiredPackages.forEach((pkg) => {
        if (dependencies[pkg]) {
            console.log(`✅ ${pkg} (${dependencies[pkg]})`);
        } else {
            console.log(`❌ ${pkg}: MANQUANT`);
        }
    });
} else {
    console.log("❌ package.json non trouvé");
}

console.log("");

// 5. Résumé
console.log("==================================");
if (missingEnvCount === 0 && missingFilesCount === 0) {
    console.log("✅ Diagnostic OK - Tout semble bon!");
    console.log("");
    console.log("📝 Prochaines étapes:");
    console.log("   1. npm run dev");
    console.log("   2. Aller à http://localhost:3000");
    console.log("   3. Faire un test de connexion/paiement");
    console.log("   4. Vérifier en Prisma Studio: npx prisma studio");
} else {
    console.log(
        `⚠️  Diagnostic: ${missingEnvCount + missingFilesCount} problème(s) détecté(s)`,
    );
    console.log("");
    console.log("📋 À corriger:");
    if (missingEnvCount > 0)
        console.log(
            `   - ${missingEnvCount} variable(s) d'environnement manquante(s)`,
        );
    if (missingFilesCount > 0)
        console.log(`   - ${missingFilesCount} fichier(s) manquant(s)`);
}

console.log("");
console.log("📚 Voir DEBUG_GUIDE.md ou TROUBLESHOOTING.md pour plus d'aide");
console.log("");
