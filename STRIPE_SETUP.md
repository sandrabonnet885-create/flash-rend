# Configuration de Stripe

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Clés Stripe (disponibles dans le tableau de bord Stripe)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URL de base de l'application (sans le / final)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Configuration requise

1. Installez le SDK Stripe :
```bash
pnpm add stripe @stripe/stripe-js
```

2. Pour les webhooks, installez les types :
```bash
pnpm add -D @types/stripe
```

## Mise en place des webhooks

1. Installez l'outil en ligne de commande Stripe :
```bash
pnpm add -g stripe-cli
```

2. Connectez-vous à votre compte Stripe :
```bash
stripe login
```

3. Démarrez le forward des webhooks en local :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

4. Copiez la clé secrète des webhooks dans votre `.env.local`

## Configuration du tableau de bord Stripe

1. Activez les webhooks dans le [tableau de bord Stripe](https://dashboard.stripe.com/webhooks)
2. Ajoutez l'URL de votre webhook : `https://votredomaine.com/api/stripe/webhooks`
3. Sélectionnez les événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## Tests

Utilisez les cartes de test Stripe :
- Numéro : 4242 4242 4242 4242 (fonctionne pour tous les codes postaux et dates futures)
- CVC : n'importe quel code à 3 chiffres
- Date d'expiration : toute date future

## Déploiement

Assurez-vous de configurer les variables d'environnement dans votre hébergeur :
- Vercel : Paramètres du projet → Variables d'environnement
- Netlify : Paramètres du site → Variables d'environnement
- Autre : Consultez la documentation de votre hébergeur

## Dépannage

- **Erreurs de clé API** : Vérifiez que `STRIPE_SECRET_KEY` est correcte et correspond à l'environnement (test/production)
- **Webhooks non reçus** : Vérifiez que l'URL du webhook est correcte et que le point de terminaison est accessible depuis Internet
- **Paiements en attente** : Vérifiez que vous gérez correctement les statuts de paiement dans votre code

## Sécurité

- Ne commettez jamais de clés secrètes dans votre dépôt git
- Utilisez des variables d'environnement pour toutes les informations sensibles
- Activez la protection contre la fraude dans le tableau de bord Stripe
- Mettez régulièrement à jour le SDK Stripe pour bénéficier des dernières corrections de sécurité
