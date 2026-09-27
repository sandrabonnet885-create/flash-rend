# 🔧 Guide de Debugging - Données Non Enregistrées

## 🔍 Problème Identifié

Authentification fonctionne ✅ mais aucune donnée en DB ❌

---

## 📋 Checklist de Debugging

### 1. **Vérifier que les Utilisateurs sont Créés**

```bash
# Via Prisma Studio (local)
npx prisma studio

# Via CLI
npx prisma db execute --stdin < query.sql
SELECT * FROM "User";
```

**Possible Issue**: Webhook Clerk ne crée pas l'utilisateur

- [ ] Aller à Clerk Dashboard → Webhooks
- [ ] Vérifier que `user.created` est sélectionné
- [ ] Vérifier que l'endpoint webhook est correcte: `/api/clerk/webhook`
- [ ] Vérifier que `CLERK_WEBHOOK_SECRET` est configuré

---

### 2. **Tester le Webhook Clerk Localement**

```bash
# Terminal 1: Démarrer l'app
npm run dev

# Terminal 2: Trigger un événement Clerk (ex: user.created)
curl -X POST http://localhost:3000/api/clerk/webhook \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test123" \
  -H "svix-timestamp: 1609459200" \
  -H "svix-signature: v1,test" \
  -d '{
    "type": "user.created",
    "data": {
      "id": "user_test123",
      "email_addresses": [{"email_address": "test@example.com"}],
      "first_name": "Test",
      "last_name": "User"
    }
  }'
```

**Expected Response**: `200 OK`

Vérifier les logs:

```
[Clerk Webhook] Received event: user.created
[Clerk Webhook] Creating user: user_test123
[Clerk Webhook] ✅ User created successfully: ...
```

---

### 3. **Vérifier la Connexion à la Base de Données**

```bash
# Test connection
npx prisma db execute --stdin < check_connection.sql

# Via Node REPL
node -e "
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log('Connected! Users count:', count);
  process.exit(0);
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
"
```

**Possible Issues**:

- [ ] `DATABASE_URL` incorrecte ou vide
- [ ] Base de données non accessible
- [ ] Migrations non exécutées

---

### 4. **Vérifier les Migrations**

```bash
# Voir l'état des migrations
npx prisma migrate status

# Exécuter les migrations en attente
npx prisma migrate deploy

# Force reset (⚠️ ATTENTION: Supprime tout)
npx prisma migrate reset --force
```

**Possible Issue**: Les tables n'existent pas en base

---

### 5. **Tester le Flux de Paiement Stripe**

```bash
# Terminal 1: Écouter les webhooks
stripe listen --forward-to http://localhost:3000/api/stripe/webhooks

# Terminal 2: Déclencher un test
stripe trigger checkout.session.completed
```

**Expected in Logs**:

```
[Webhook] Received event: checkout.session.completed
[Webhook] Processing checkout session: cs_test_...
[Webhook] ✅ Payment processed successfully for user ...
```

---

### 6. **Vérifier les Variables d'Environnement**

```bash
# Vérifier que toutes les variables sont définies
node -e "
const required = [
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_WEBHOOK_SECRET',
];
required.forEach(v => {
  const val = process.env[v];
  console.log(v + ':', val ? '✅ SET' : '❌ MISSING');
});
"
```

---

### 7. **Activer les Logs Détaillés**

Ajouter ceci au démarrage de l'app (`next.config.ts` ou `.env`):

```env
# Pour Prisma
DEBUG=prisma:*

# Ou dans package.json scripts
"dev": "DEBUG=prisma:* next dev"
```

---

## 🚨 Scénarios Courants

### Scenario 1: Utilisateur NON créé à la connexion

**Symptômes**:

- Connexion avec Clerk fonctionne ✅
- Pas de User en base ❌

**Solution**:

1. Vérifier webhook Clerk est configuré et actif
2. Checker logs du webhook pour voir les erreurs
3. Forcer création: Aller à `/api/users/[clerkId]` → POST un utilisateur

### Scenario 2: Paiement OK mais Transaction NON créée

**Symptômes**:

- Paiement accepté par Stripe ✅
- Pas de Transaction en base ❌
- Solde utilisateur n'a pas changé ❌

**Solution**:

1. Vérifier webhook Stripe est enregistré dans Dashboard
2. Vérifier `STRIPE_WEBHOOK_SECRET` est correct
3. Checker logs du webhook Stripe
4. Vérifier l'utilisateur existe en base (Scenario 1)

### Scenario 3: Tous les Webhooks OK mais Données à Moitié Enregistrées

**Symptômes**:

- Utilisateur créé ✅
- Mais Transaction pas créée, ou solde pas mis à jour

**Solution**:

1. Vérifier les transactions Prisma sont atomiques
2. Checker pour erreurs de type dans schema
3. Vérifier que `user.id` est correct dans Transaction

---

## 📊 Checklist de Vérification Production

- [ ] `DATABASE_URL` pointe vers bonne DB
- [ ] Migrations exécutées: `npx prisma migrate deploy`
- [ ] Webhook Clerk enregistré dans Dashboard
- [ ] Webhook Stripe enregistré dans Dashboard
- [ ] Tous les secrets dans variables d'environnement
- [ ] Logs visibles: vérifier console de Vercel/Netlify
- [ ] Test complet du flux: S'inscrire → Faire un paiement → Vérifier DB

---

## 🔗 Liens Utiles

- [Prisma Logging](https://www.prisma.io/docs/orm/reference/error-reference)
- [Clerk Webhooks](https://clerk.com/docs/webhooks/overview)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Vercel Logs](https://vercel.com/docs/monitoring/logs)

---

## 🆘 Besoin d'Aide?

Exécuter ce diagnostic complet et partager les logs:

```bash
# 1. Check env
node -e "console.log('DB:', process.env.DATABASE_URL ? '✅' : '❌')"

# 2. Count users
npx prisma studio

# 3. Check webhooks
# Allez manuellement à Clerk/Stripe Dashboard

# 4. Test webhook
curl -X POST http://localhost:3000/api/clerk/webhook \
  -H "Content-Type: application/json" \
  -H "svix-id: test" -H "svix-timestamp: 1" \
  -H "svix-signature: v1,test" \
  -d '{...}'

# 5. Share logs output
```
