/**
 * Source unique des questions/réponses : affichées par la section FAQ
 * et exposées à Google via le JSON-LD `FAQPage` de la page d'accueil.
 *
 * Les questions sont formulées telles qu'elles sont tapées dans un moteur de
 * recherche, et chaque réponse commence par une phrase qui se suffit à
 * elle-même — c'est celle que Google reprend en extrait enrichi.
 */
export const faqItems = [
    {
        id: "item-1",
        question: "Comment fonctionne FlashRend ?",
        answer: "FlashRend est une plateforme d'investissement en cryptomonnaies gérée par des experts. Vous déposez votre capital, nos spécialistes le positionnent sur les crypto-actifs qu'ils ont sélectionnés, puis vous récupérez le résultat de la session au bout de quelques heures. Vous n'avez ni portefeuille crypto à créer, ni plateforme d'échange à maîtriser : chaque étape reste visible depuis votre tableau de bord.",
    },
    {
        id: "item-2",
        question: "Quels sont les rendements potentiels ?",
        answer: "Les rendements observés sur nos sessions se situent généralement entre 900 % et 1000 % du capital engagé, selon les conditions du marché. Utilisez notre simulateur pour estimer un ordre de grandeur à partir de votre montant. Ces chiffres sont des estimations et non une garantie : le marché des cryptomonnaies est volatil, les performances passées ne préjugent pas des performances futures et un investissement comporte un risque de perte en capital.",
    },
    {
        id: "item-3",
        question: "Quel est le montant minimum pour investir en crypto ?",
        answer: "Il n'y a pas de montant minimum imposé sur FlashRend. La plupart de nos utilisateurs commencent par 100 € pour prendre en main la plateforme avant d'augmenter leur mise, et il n'existe pas non plus de plafond. N'investissez que des sommes dont vous n'avez pas besoin à court terme.",
    },
    {
        id: "item-4",
        question: "Combien de temps dure une session d'investissement ?",
        answer: "Une session dure généralement quelques heures. Une fois votre dépôt validé, nos experts sélectionnent les positions, puis un décompte démarre sur votre tableau de bord : vous y suivez la progression et les gains estimés en temps réel jusqu'à la clôture de la session.",
    },
    {
        id: "item-5",
        question: "Mon argent est-il en sécurité sur FlashRend ?",
        answer: "Les fonds transitent par des prestataires de paiement agréés (carte bancaire, virement SEPA, PayPal) et la plateforme utilise des portefeuilles sécurisés ainsi qu'un chiffrement des données conforme au RGPD. Cela protège vos fonds et vos données contre la fraude technique, mais ne supprime pas le risque de marché : la valeur des cryptomonnaies peut baisser et vous pouvez perdre tout ou partie du capital investi.",
    },
    {
        id: "item-6",
        question: "Comment retirer mes gains ?",
        answer: "Vous pouvez demander un retrait dès que votre session d'investissement est terminée, directement depuis votre espace personnel. Les virements sont traités sous 24 à 48 heures ouvrées vers le compte bancaire enregistré sur votre profil, sans frais de retrait.",
    },
    {
        id: "item-7",
        question: "Y a-t-il des frais sur FlashRend ?",
        answer: "L'inscription, les dépôts et les retraits sont gratuits. FlashRend se rémunère uniquement par une commission prélevée sur les gains générés : votre capital initial n'est pas entamé par des frais de plateforme. Le taux de commission dépend du package d'investissement choisi et vous est indiqué avant la validation de votre dépôt.",
    },
    {
        id: "item-8",
        question: "Faut-il déclarer ses gains crypto aux impôts en France ?",
        answer: "Oui. En France, les plus-values réalisées sur des actifs numériques par un particulier sont imposables et doivent être déclarées à l'administration fiscale, en principe via le prélèvement forfaitaire unique. FlashRend ne se substitue pas à un conseiller fiscal : rapprochez-vous d'un professionnel ou du site officiel impots.gouv.fr pour votre situation personnelle.",
    },
    {
        id: "item-9",
        question: "Faut-il des connaissances en crypto pour commencer ?",
        answer: "Non, aucune connaissance technique n'est nécessaire. La plateforme a été conçue pour les débutants : vous n'avez pas à choisir les crypto-actifs, à lire des graphiques ni à gérer de clés privées. Il vous suffit de créer un compte, de choisir un montant et de suivre votre session depuis le tableau de bord.",
    },
    {
        id: "item-10",
        question: "Comment contacter le support FlashRend ?",
        answer: "Notre équipe support est joignable 24h/24 et 7j/7 via le formulaire de contact du site, par email à contact@flashrend.site ou par le chat en direct présent sur chaque page. Le délai de réponse moyen est inférieur à une heure.",
    },
] as const;
