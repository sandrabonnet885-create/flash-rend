# 🆘 Checklist de Dépannage - Données Non Enregistrées

## 📊 Symptômes Rapportés

- ✅ Authentification Clerk fonctionne (connexion OK)
- ✅ Paiement Stripe accepté (transaction Stripe OK)
- ❌ Aucune donnée en DB (User, Transaction, Balance)

---

## 🔍 Premiers Tests à Faire (5 minutes)

### 1. Vérifier qu'il y a des Utilisateurs en Base

```bash
# Accès à Prisma Studio
npx prisma studio

# Aller à l'onglet "User"
# Devez voir au moins 1 utilisateur après une connexion test
```

**Résultat Attendu**: ✅ Au moins 1 User existant
**Si ❌ Aucun utilisateur**: Webhook Clerk ne crée pas les users

---

### 2. Vérifier les Logs de Déploiement

```bash
# Vercel
vercel logs # ou voir dans Dashboard

# Netlify
# Allez à Netlify Dashboard → Functions → Voir les logs

# Local
npm run dev
# Chercher les logs [Clerk Webhook] ou [API]
```

**Chercher des messages comme**:

```
[Clerk Webhook] Received event: user.created
[Clerk Webhook] ✅ User created successfully
[Webhook] ✅ Payment processed successfully
```

**Si vous voyez des ❌ erreurs**, noter et partager

---

### 3. Tester Manuellement le Webhook Clerk

```bash
# Depuis votre machine locale
curl -X POST http://localhost:3000/api/clerk/webhook \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test" \
  -H "svix-timestamp: 1609459200" \
  -H "svix-signature: v1,test" \
  -d '{
    "type": "user.created",
    "data": {
      "id": "user_test_' $(date +%s) '",
      "email_addresses": [{"email_address": "test@example.com"}],
      "first_name": "Test",
      "last_name": "User"
    }
  }'
```

**Résultat Attendu**: `200 OK`
**Vérifier en Prisma Studio**: Un nouvel utilisateur devrait être créé

---

## 🔧 Actions Correctives (Par Ordre de Probabilité)

### Problème #1: Migrations Non Exécutées ⚠️ (60% de chance)

```bash
# Vérifier l'état
npx prisma migrate status

# Si des migrations en attente, exécuter
npx prisma migrate deploy
```

**Symptôme**: "Table User does not exist" en logs
**Solution**: Exécuter les migrations

---

### Problème #2: Webhook Clerk Non Configuré (25% de chance)

1. Aller à [Clerk Dashboard](https://dashboard.clerk.com)
2. Projet → Webhooks
3. Chercher webhook endpoint
4. Vérifier que URL est: `https://yoursite.com/api/clerk/webhook`
5. Vérifier que `CLERK_WEBHOOK_SECRET` est correct

**Symptôme**: Logs vides, pas de `[Clerk Webhook]` messages
**Solution**: Re-enregistrer le webhook

---

### Problème #3: DATABASE_URL Incorrecte (10% de chance)

```bash
# Vérifier que DB URL est valide
node -e "
const url = process.env.DATABASE_URL;
console.log('Database URL:', url ? '✅ SET' : '❌ MISSING');
if (url) {
  const parts = url.split('://');
  console.log('  Protocol:', parts[0]);
  console.log('  Host:', parts[1]?.split('@')[1]?.split('/')[0]);
}
"
```

**Symptôme**: "connect ECONNREFUSED" errors
**Solution**: Mettre à jour `DATABASE_URL`

---

### Problème #4: Webhook Stripe Non Reçu (5% de chance)

1. Aller à [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Chercher webhook endpoint: `/api/stripe/webhooks`
3. Vérifier les "Events" dans la section "Recent Events"
4. Si pas d'événement reçu, re-déclencher un paiement

**Symptôme**: Paiement réussi mais pas de logs webhook
**Solution**: Vérifier que webhook est bien enregistré

---

## 📋 Checklist Complète de Production

- [ ] **Migrations**: `npx prisma migrate status` → tout "migrated"
- [ ] **DB Connection**: Peut se connecter avec `DATABASE_URL`
- [ ] **Clerk Webhook**: Enregistré dans Dashboard avec bon secret
- [ ] **Stripe Webhook**: Enregistré dans Dashboard avec bon secret
- [ ] **Env Variables**: Toutes les variables requises sont SET
- [ ] **Logs**: Voir les messages `[Clerk Webhook]` et `[Webhook]`
- [ ] **Test**: Faire une inscription + paiement + vérifier DB

---

## 🚀 Test Complet du Flux (15 minutes)

1. **S'inscrire** via Clerk
    - Vérifier que User apparaît en Prisma Studio

2. **Faire un dépôt**
    - Aller à `/account/payments`
    - Entrer 10€
    - Utiliser carte test: `4242 4242 4242 4242`
    - Vérifier page success

3. **Vérifier la DB**
    - Ouvrir Prisma Studio
    - User.balance devrait être 10
    - Transaction de type DEPOSIT devrait exister

---

## 📞 Si Encore Bloqué

Collecter ces informations et partager:

```bash
# 1. État des migrations
npx prisma migrate status

# 2. Nombre d'utilisateurs
npx prisma studio # Screenshot

# 3. Logs récents
# Vercel: vercel logs -f
# Local: npm run dev output

# 4. Variables d'env
node -e "console.log('DB:', process.env.DATABASE_URL ? 'SET' : 'MISSING')"
```

---

**Status**: 🔴 Données non persistées - À déboguer
**Priorité**: 🔴 CRITIQUE - Blocage du système
**ETA Fix**: 30 minutes - 1 heure
