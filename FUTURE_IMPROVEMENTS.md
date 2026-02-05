# Améliorations Futures & TODO

Ce document recense les fonctionnalités envisagées et les améliorations techniques à apporter au projet FlashRend.

## 💳 Système de Paiement (Retraits)

### État Actuel : Processus Manuel
Actuellement, les retraits fonctionnent selon un mode déclaratif :
1.  L'utilisateur fait sa demande.
2.  L'admin voit la demande et l'IBAN.
3.  L'admin effectue le virement bancaire manuellement (hors application).
4.  L'admin clique sur "Valider" dans le dashboard pour mettre à jour le statut.

### Amélioration : Automatisation via Stripe Connect
Pour automatiser les virements vers les comptes bancaires des utilisateurs, il faut implémenter **Stripe Connect**.

#### Étapes d'implémentation :
1.  **Configuration Stripe** :
    *   Activer Connect dans le dashboard Stripe.
    *   Choisir le type de compte "Express" ou "Custom" (Express est plus simple pour l'intégration, Custom offre une UI totalement personnalisée mais demande plus de dev).

2.  **Onboarding Utilisateur (KYC)** :
    *   Créer un flux pour que les utilisateurs connectent leur compte Stripe.
    *   Rediriger vers l'URL d'onboarding Stripe (`stripe.account.create` + `account_link`).
    *   Stocker le `stripe_account_id` dans la table `User`.

3.  **Gestion des Retraits** :
    *   Remplacer l'API de retrait actuelle.
    *   Utiliser `stripe.transfers.create` ou `stripe.payouts.create` vers le `stripe_account_id` de l'utilisateur.
    *   Gérer les webhooks Stripe Connect pour confirmer que l'argent est bien arrivé.

#### Avantages :
*   Virements instantanés ou J+1 automatiques.
*   Moins d'erreurs manuelles.

#### Inconvénients :
*   Frais Stripe supplémentaires (généralement 2€ par compte actif/mois + frais de virement).
*   Complexité de mise en place (KYC, conformité légale).
