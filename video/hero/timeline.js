// Timeline partagée (navigateur + Node). 96 BPM ; deux versions :
//   30 s (48 temps, boucle du hero) : par défaut
//   60 s (96 temps, démo complète)  : ?v=60 dans l'URL de la page, ou VERSION=60 côté Node
(function (root) {
    const VERSION =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("v") || "30"
            : process.env.VERSION || "30";

    const BPM = 96;
    const FPS = 30;
    const SPB = 60 / BPM;
    const BAR = SPB * 4;

    const V = {};

    // Version 30 s : boucle du hero.
    V["30"] = {
        BEATS: 48,
        // Scènes en temps musicaux [début, fin].
        scenes: {
            ouverture: [0, 6],
            inscription: [6, 12],
            depot: [12, 20],
            experts: [20, 30],
            suivi: [30, 38],
            retrait: [38, 44],
            boucle: [44, 48],
        },
        // Cues [temps absolu en secondes, nom, intensité] : effets sonores synchronisés à l'image.
        cues: [
            [0.0, "riser", 0.6],
            [0.6, "impact", 1],
            [1.35, "whoosh", 0.5],
            [5.1, "click", 0.5],
            [7.5, "swoosh", 0.6],
            [8.8, "click", 0.5],
            [10.4, "click", 0.5],
            [11.2, "success", 1],
            [12.4, "swoosh", 0.5],
            [13.0, "pop", 0.5],
            [13.7, "pop", 0.6],
            [14.3, "tick", 0.4],
            [14.8, "tick", 0.4],
            [15.3, "tick", 0.4],
            [15.5, "pop", 0.5],
            [16.7, "pop", 0.5],
            [18.4, "swoosh", 0.5],
            [22.0, "shimmer", 0.4],
            [23.75, "swoosh", 0.6],
            [25.25, "click", 0.5],
            [25.7, "success", 0.8],
            [27.5, "drop", 0.6],
        ],
        // Voix off : [début en secondes, texte].
        vo: [
            [0.7, "Investir dans les cryptos, sans y passer vos journées."],
            [3.95, "Créez votre compte en quelques secondes."],
            [7.75, "Déposez votre capital par PayPal ou par virement."],
            [12.75, "Nos experts des marchés le gèrent ensuite pour vous, sur Bitcoin, Ethereum et Solana."],
            [19.0, "Vous suivez votre portefeuille en temps réel."],
            [23.95, "Et vous demandez vos retraits vers votre IBAN."],
            [27.0, "Investir comporte un risque de perte en capital."],
        ],
        plan: {
            // Vitesse de lecture des écrans de l'app (1 = vitesse d'origine).
            speed: { inscription: 0.8, depot: 0.8, suivi: 1, retrait: 0.8 },
            windowEnter: 1.55,
            // Sorties de la fenêtre : [départ, durée, retour (null = ne revient pas), durée].
            aways: [[12.3, 0.75, 18.2, 1.0]],
            drop: 27.5,
            stepsOut: 27.4,
            captions: [
                { k: "FLASHREND", lines: ["Vos cryptos,", "sans y passer", "vos journées."], hl: ["journées."], in: 1.5, out: 3.3 },
                { k: "01 / INSCRIPTION", lines: ["Inscription", "en 30 secondes"], hl: ["30", "secondes"], in: 3.95, out: 7.05 },
                { k: "02 / DÉPÔT", lines: ["PayPal", "ou virement"], hl: ["virement"], in: 7.85, out: 12.0 },
                { k: "03 / GESTION", lines: ["Nos experts", "gèrent votre", "capital"], hl: ["experts"], in: 12.75, out: 18.1 },
                { k: "04 / SUIVI", lines: ["Suivez tout", "en temps réel"], hl: ["temps", "réel"], in: 19.0, out: 23.25 },
                { k: "05 / RETRAIT", lines: ["Retrait vers", "votre IBAN"], hl: ["IBAN"], in: 24.0, out: 27.15 },
            ],
        },
        music: { drumsIn: BAR, kickIn: BAR, clapIn: BAR * 2, arpIn: BAR * 4, breaks: [], end: 27.5 },
    };

    // Version 60 s : démo complète.
    V["60"] = {
        BEATS: 96,
        scenes: {
            ouverture: [0, 6],
            constat: [6, 14],
            reponse: [14, 22],
            inscription: [22, 30],
            depot: [30, 42],
            experts: [42, 58],
            suivi: [58, 70],
            retrait: [70, 78],
            confiance: [78, 86],
            cta: [86, 96],
        },
        cues: [
            [0.0, "riser", 0.6],
            [0.6, "impact", 1],
            [1.35, "whoosh", 0.5],
            [4.0, "pop", 0.5],
            [4.4, "pop", 0.4],
            [4.55, "pop", 0.4],
            [4.7, "pop", 0.4],
            [8.3, "swoosh", 0.5],
            [9.0, "impact", 0.6],
            [10.85, "swoosh", 0.5],
            [15.6, "click", 0.5],
            [18.75, "swoosh", 0.6],
            [20.3, "click", 0.5],
            [22.95, "click", 0.5],
            [24.1, "success", 1],
            [26.1, "swoosh", 0.5],
            [26.4, "pop", 0.4],
            [26.8, "pop", 0.6],
            [29.32, "tick", 0.45],
            [30.47, "tick", 0.45],
            [31.99, "tick", 0.45],
            [33.15, "pop", 0.5],
            [34.25, "pop", 0.5],
            [36.0, "swoosh", 0.5],
            [40.6, "pop", 0.6],
            [43.75, "swoosh", 0.6],
            [45.75, "click", 0.5],
            [46.35, "success", 0.8],
            [48.6, "swoosh", 0.5],
            [49.25, "pop", 0.5],
            [50.65, "pop", 0.5],
            [51.0, "pop", 0.5],
            [51.95, "pop", 0.5],
            [53.95, "impact", 0.7],
            [54.8, "pop", 0.5],
            [55.8, "shimmer", 0.5],
        ],
        vo: [
            [0.7, "Investir dans les cryptos, sans y passer vos journées."],
            [4.0, "Les marchés crypto ne dorment jamais. Les suivre demande du temps, et de l'expérience."],
            [9.1, "Avec FlashRend, vous confiez cette partie à des experts."],
            [14.0, "Créez votre compte en quelques secondes, avec Google ou Apple."],
            [19.0, "Déposez votre capital par PayPal, ou par virement bancaire."],
            [26.5, "Nos experts des marchés le gèrent ensuite pour vous : ils analysent les marchés, sélectionnent les actifs, et ajustent les positions sur Bitcoin, Ethereum et Solana."],
            [36.5, "Depuis votre tableau de bord, vous suivez votre portefeuille en temps réel, et vous êtes notifié par email à chaque étape importante."],
            [43.85, "Quand vous le souhaitez, vous demandez un retrait vers votre IBAN. Notre équipe le valide avant le virement."],
            [49.25, "Connexion sécurisée, suivi transparent, et un support à votre écoute."],
            [53.9, "FlashRend. Créez votre compte sur flashrend point site."],
            [57.15, "Investir comporte un risque de perte en capital."],
        ],
        plan: {
            speed: { inscription: 0.6, depot: 0.55, suivi: 0.67, retrait: 0.6 },
            windowEnter: 11.0,
            aways: [
                [26.05, 0.75, 35.7, 1.0],
                [48.55, 0.75, null, 0],
            ],
            drop: null,
            stepsOut: 48.55,
            // Notification email dans la fenêtre pendant le suivi (temps absolu).
            toast: 40.6,
            // Minutage interne du schéma experts (secondes depuis le début de la scène), calé sur la voix.
            experts: { a: 0.15, l1: 0.35, b: 0.55, rows: [3.07, 4.22, 5.74], l2: 6.4, c: 6.9, l3: 7.6, d: 8.0, out: 9.2, end: 9.9 },
            // Instants clés des nouvelles scènes (secondes depuis le début de la scène), calés sur la voix.
            constat: { clock: 0.25, cards: [0.45, 0.6, 0.75], out: 4.35 },
            reponse: { logo: 0.25, out: 1.85 },
            confiance: { items: [0.5, 1.9, 2.25, 3.2], out: 4.65 },
            cta: { logo: 0.2, word: 0.4, button: 1.05, url: 2.0 },
            captions: [
                { k: "FLASHREND", lines: ["Vos cryptos,", "sans y passer", "vos journées."], hl: ["journées."], in: 1.5, out: 3.45 },
                { k: "24 H / 24", lines: ["Les marchés", "ne dorment", "jamais"], hl: ["jamais"], in: 4.1, out: 8.4 },
                { k: "LA SOLUTION", lines: ["FlashRend", "s'en occupe"], hl: ["FlashRend"], in: 9.2, out: 13.45 },
                { k: "01 / INSCRIPTION", lines: ["Inscription", "en 30 secondes"], hl: ["30", "secondes"], in: 14.0, out: 18.4 },
                { k: "02 / DÉPÔT", lines: ["PayPal", "ou virement"], hl: ["virement"], in: 19.05, out: 25.9 },
                { k: "03 / GESTION", lines: ["Nos experts", "gèrent votre", "capital"], hl: ["experts"], in: 26.55, out: 35.9 },
                { k: "04 / SUIVI", lines: ["Suivez tout", "en temps réel"], hl: ["temps", "réel"], in: 36.55, out: 43.4 },
                { k: "05 / RETRAIT", lines: ["Retrait vers", "votre IBAN"], hl: ["IBAN"], in: 44.05, out: 48.4 },
                { k: "CONFIANCE", lines: ["Sécurisé", "et transparent"], hl: ["transparent"], in: 49.05, out: 53.4 },
            ],
        },
        music: { drumsIn: BAR * 2, kickIn: BAR * 4 - SPB, clapIn: BAR * 6 - SPB, arpIn: BAR * 8 - SPB, breaks: [[26.25, 36.25]], end: 57.5 },
    };

    const cfg = V[VERSION] || V["30"];
    const BEATS = cfg.BEATS;
    const DUR = BEATS * SPB;
    const sec = (beat) => beat * SPB;
    const sceneSec = (name) => (cfg.scenes[name] ? cfg.scenes[name].map(sec) : null);

    const TL = {
        VERSION,
        BPM,
        FPS,
        BEATS,
        SPB,
        BAR,
        DUR,
        FRAMES: DUR * FPS,
        scenes: cfg.scenes,
        cues: cfg.cues,
        vo: cfg.vo,
        plan: cfg.plan,
        music: cfg.music,
        sec,
        sceneSec,
    };
    root.TL = TL;
    if (typeof module !== "undefined") module.exports = { TL };
})(typeof window !== "undefined" ? window : globalThis);
