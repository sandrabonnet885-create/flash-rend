#!/bin/bash

# 🔧 Script de Diagnostic - FlashRend

echo "🔍 Diagnostic FlashRend - $(date)"
echo "=================================="
echo ""

# 1. Vérifier les variables d'environnement
echo "1️⃣  Vérification des Variables d'Environnement"
echo "---"

check_env() {
  if [ -z "${!1}" ]; then
    echo "❌ $1: MANQUANTE"
  else
    echo "✅ $1: SET"
  fi
}

check_env "DATABASE_URL"
check_env "STRIPE_SECRET_KEY"
check_env "STRIPE_WEBHOOK_SECRET"
check_env "CLERK_SECRET_KEY"
check_env "CLERK_WEBHOOK_SECRET"

echo ""

# 2. Compter les utilisateurs
echo "2️⃣  Utilisateurs en Base de Données"
echo "---"

if command -v npx &> /dev/null; then
  USER_COUNT=$(npx prisma db execute --stdin < /dev/null 2>/dev/null || echo "0")
  echo "Utilisateurs: $(npx prisma client --eval 'const p = require("@prisma/client").PrismaClient; new p().user.count()' 2>/dev/null || echo '❌ Impossible de vérifier')"
else
  echo "❌ npx non disponible"
fi

echo ""

# 3. Vérifier les migrations
echo "3️⃣  État des Migrations"
echo "---"

if [ -d "prisma/migrations" ]; then
  MIGRATION_COUNT=$(ls -1 prisma/migrations | wc -l)
  echo "✅ Migrations trouvées: $MIGRATION_COUNT"
else
  echo "❌ Aucune migration trouvée"
fi

echo ""

# 4. Vérifier les fichiers critiques
echo "4️⃣  Fichiers Critiques"
echo "---"

files=(
  "src/app/api/stripe/webhooks/route.ts"
  "src/app/api/clerk/webhook/route.ts"
  "src/app/api/users/\[clerkId\]/route.ts"
  "src/app/api/withdrawals/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file: MANQUANT"
  fi
done

echo ""

# 5. Vérifier les dépendances
echo "5️⃣  Dépendances"
echo "---"

check_package() {
  if grep -q "\"$1\"" package.json 2>/dev/null; then
    echo "✅ $1"
  else
    echo "❌ $1: MANQUANT"
  fi
}

check_package "@prisma/client"
check_package "stripe"
check_package "@clerk/nextjs"
check_package "zod"

echo ""
echo "=================================="
echo "✅ Diagnostic terminé!"
echo ""
echo "📝 Voir DEBUG_GUIDE.md pour plus de détails"
