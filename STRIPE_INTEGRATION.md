# 🔐 Intégration Stripe - FlashRend

Guide complet d'intégration et de configuration de Stripe pour les paiements dans FlashRend.

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Pages créées](#pages-créées)
- [API Routes](#api-routes)
- [Variables d'environnement](#variables-denvironnement)
- [Tests](#tests)
- [Webhooks (Optional)](#webhooks-optional)

---

## 📦 Installation

### 1. Installer les packages Stripe

```bash
npm install stripe @stripe/stripe-js
# ou
pnpm add stripe @stripe/stripe-js
```

### 2. Dépendances déjà incluses

Le projet utilise déjà:

- `next`: Framework Next.js
- `react-hook-form`: Validation de formulaires
- `sonner`: Notifications toast
- `shadcn/ui`: Composants UI
- `lucide-react`: Icons

---

## ⚙️ Configuration

### 1. Créer un compte Stripe

1. Aller sur [stripe.com](https://stripe.com)
2. Créer un compte gratuit
3. Confirmer l'email
4. Activer le mode test

### 2. Variables d'environnement

Créer un fichier `.env.local` à la racine du projet:

```env
# Stripe Keys (Mode TEST)
STRIPE_SECRET_KEY=sk_test_XXX...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXX...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Où trouver ces clés?

1. Aller à **Developers** > **API keys** dans le dashboard Stripe
2. Copier:
    - **Secret key** → `STRIPE_SECRET_KEY`
    - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

⚠️ **Important**: Ne jamais commiter ces clés!

### 3. Ajouter les URLs autorisées (Webhooks)

Dans le dashboard Stripe:

1. Aller à **Developers** > **Webhooks**
2. Ajouter l'endpoint: `https://votredomaine.com/api/stripe/webhooks`
3. Sélectionner les événements (cf. section Webhooks)

---

## 🏗️ Architecture

### Structure des fichiers créés

```
src/
├── lib/
│   └── stripe.ts                 # Configuration Stripe
├── app/
│   ├── api/stripe/
│   │   ├── checkout/route.ts     # Créer session Checkout
│   │   ├── verify-session/route.ts # Vérifier paiement
│   │   └── webhooks/route.ts     # (Optional) Webhooks
│   └── account/payments/
│       ├── page.tsx              # Sélection montant
│       ├── success/page.tsx       # Après paiement réussi
│       └── cancel/page.tsx        # Après annulation
└── STRIPE_INTEGRATION.md         # Ce fichier
```

---

## 📄 Pages créées

### 1. `/account/payments` - Sélection du montant

- **Fichier**: `src/app/account/payments/page.tsx`
- **Fonctionnalités**:
    - 4 montants prédéfinis (100€, 500€, 1000€, 5000€)
    - Saisie de montant personnalisé
    - Validation du montant (minimum 1€)
    - Redirection vers Stripe Checkout
    - Loading states et error handling

### 2. `/account/payments/success` - Confirmation de paiement

- **Fichier**: `src/app/account/payments/success/page.tsx`
- **Fonctionnalités**:
    - Vérification de la session Stripe
    - Affichage des détails du paiement
    - Email et montant confirmés
    - Boutons: Retour au compte / Faire un autre paiement

### 3. `/account/payments/cancel` - Annulation

- **Fichier**: `src/app/account/payments/cancel/page.tsx`
- **Fonctionnalités**:
    - Message d'annulation
    - Option de réessayer
    - Retour au compte

---

## 🔌 API Routes

### POST `/api/stripe/checkout`

**Crée une session Stripe Checkout**

**Paramètres (Body)**:

```json
{
    "amount": 100, // Montant en euros
    "userEmail": "user@example.com", // Email de l'utilisateur
    "userId": "user_123" // ID Clerk de l'utilisateur
}
```

**Réponse (Succès)**:

```json
{
    "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Réponse (Erreur)**:

```json
{
    "error": "Montant invalide"
}
```

### GET `/api/stripe/verify-session`

**Vérifie et récupère les détails d'une session Checkout**

**Paramètres (Query)**:

- `session_id`: ID de la session Stripe

**Réponse**:

```json
{
    "id": "cs_test_...",
    "payment_status": "paid",
    "customer_email": "user@example.com",
    "amount_total": 10000, // En centimes
    "metadata": {
        "userId": "user_123",
        "amount": 100
    }
}
```

---

## 🔐 Variables d'environnement

| Variable                             | Type   | Description                                          |
| ------------------------------------ | ------ | ---------------------------------------------------- |
| `STRIPE_SECRET_KEY`                  | Secret | Clé secrète Stripe (MODE TEST)                       |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Clé publique Stripe (MODE TEST)                      |
| `NEXT_PUBLIC_APP_URL`                | Public | URL de votre application (ex: http://localhost:3000) |

### Exemple `.env.local`:

```env
# Stripe (Mode TEST)
STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijklmnopqrst
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_abcdefghijklmnopqrstuvwxyz

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# (Autres variables existantes...)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

---

## ✅ Tests

### 1. Tester en mode développement

```bash
npm run dev
```

Accéder à: `http://localhost:3000/account/payments`

### 2. Numéros de carte de test

**Stripe fournit des numéros de test**:

| Cartes                       | Numéro                | CVC            | Date  |
| ---------------------------- | --------------------- | -------------- | ----- |
| **Succès**                   | `4242 4242 4242 4242` | N'importe quel | Futur |
| **Authentification requise** | `4000 0025 0000 3155` | N'importe quel | Futur |
| **Carte refusée**            | `4000 0000 0000 0002` | N'importe quel | Futur |

### 3. Flow de test complet

1. **Aller à** `/account/payments`
2. **Sélectionner** un montant ou en entrer un
3. **Cliquer** "Procéder au paiement"
4. **Entrer** une carte de test (ex: `4242 4242 4242 4242`)
5. **Remplir** les infos de paiement
6. **Vérifier** la redirection vers `/account/payments/success`

### 4. Vérifier dans Stripe Dashboard

Dashboard → **Payments** → Voir les transactions

---

## 🪝 Webhooks (Optional)

Les webhooks permettent de traiter les paiements côté serveur en temps réel.

### Créer un endpoint Webhook

**Fichier**: `src/app/api/stripe/webhooks/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { Readable } from "stream";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Fonction helper pour lire le body brut
async function getRawBody(readable: ReadableStream<Uint8Array>) {
    let result = "";
    for await (const chunk of readable) {
        result += new TextDecoder().decode(chunk);
    }
    return result;
}

export async function POST(request: NextRequest) {
    const body = await getRawBody(request.body!);
    const signature = request.headers.get("stripe-signature")!;

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret,
        );

        // Traiter les événements
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                // TODO: Ajouter le crédit au compte utilisateur
                console.log("✅ Paiement complété:", session.id);
                break;

            case "charge.refunded":
                const charge = event.data.object;
                // TODO: Retirer le crédit du compte utilisateur
                console.log("❌ Remboursement:", charge.id);
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }
}
```

### Configuration du Webhook

1. **Aller à** Developers → Webhooks dans Stripe Dashboard
2. **Ajouter endpoint**: `https://votredomaine.com/api/stripe/webhooks`
3. **Sélectionner les événements**:
    - `checkout.session.completed`
    - `charge.refunded`
    - (Autres selon vos besoins)
4. **Copier le Signing Secret**
5. **Ajouter à `.env.local`**:
    ```env
    STRIPE_WEBHOOK_SECRET=whsec_...
    ```

### Tester les webhooks localement

Utiliser **Stripe CLI**:

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Forward les événements
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Déclencher un événement test
stripe trigger payment_intent.succeeded
```

---

## 🔄 Flow complet du paiement

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Utilisateur visite /account/payments                    │
│    - Choisit un montant                                     │
│    - Clique "Procéder au paiement"                         │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. POST /api/stripe/checkout                               │
│    - Crée une session Checkout                              │
│    - Retourne l'URL                                         │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Redirection vers Stripe Checkout                         │
│    - Utilisateur entre sa carte                             │
│    - Paiement effectué                                      │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
        ┌─────────────┐
        │ Succès?     │
        └──┬────────┬─┘
       Oui│        │Non
        ┌─▼────┐  ┌─▼──────┐
        │ SUC  │  │ CANCEL │
        └─┬────┘  └─┬──────┘
          │        │
          ▼        ▼
        /account  /account/
        payments  payments
        /success  /cancel
```

---

## 🚀 Déploiement

### Production Stripe

1. **Activer le mode production** dans Stripe Dashboard
2. **Copier les clés de production**
3. **Mettre à jour `.env.local`** (ou variables d'environnement):
    ```env
    STRIPE_SECRET_KEY=sk_live_...
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
    ```
4. **Déployer** (Vercel, Netlify, etc.)

### Vérifier avant le go-live

- [ ] Clés de production configurées
- [ ] URL de redirection correcte
- [ ] Webhooks configurés (si utilisés)
- [ ] Tests effectués avec vraies cartes
- [ ] Gestion des erreurs complète
- [ ] Logs en place

---

## 🐛 Dépannage

### Erreur: "STRIPE_SECRET_KEY is not defined"

**Solution**: Ajouter la clé dans `.env.local`

```env
STRIPE_SECRET_KEY=sk_test_...
```

### Erreur: "hostname not configured"

**Solution**: Clé publique Stripe manquante ou mal configurée dans `next.config.ts`

Vérifier qu'elle est ajoutée:

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "img.clerk.com" },
  ],
}
```

### Images Stripe not loading

**Solution**: S'assurer que `NEXT_PUBLIC_APP_URL` est correcte:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Redirection ne fonctionne pas

**Solution**: Vérifier les URLs dans `/api/stripe/checkout`:

```typescript
success_url: `${origin}/account/payments/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${origin}/account/payments/cancel`,
```

---

## 📚 Ressources

- [Documentation Stripe](https://docs.stripe.com)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Checkout Docs](https://docs.stripe.com/payments/checkout)
- [Next.js + Stripe Guide](https://docs.stripe.com/stripe-js/integrating-stripe-elements)

---

## ✨ Prochaines étapes

- [ ] Implémenter les webhooks pour enregistrer les paiements
- [ ] Ajouter un historique des paiements
- [ ] Implémenter les remboursements
- [ ] Ajouter les subscriptions
- [ ] Email de confirmation après paiement
- [ ] Dashboard des revenus (admin)

---

**Créé le**: 2 février 2026  
**Version**: 1.0.0  
**Dernière mise à jour**: 2 février 2026
