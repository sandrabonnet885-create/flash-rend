// Compositeur : fond, fenêtre d'app, contenus (scènes), cartons, flou de mouvement, grain.
// Point d'entrée pour render.mjs : window.renderFrame(f) -> dataURL de l'image f.

const cv = document.getElementById("c");
const ctx = cv.getContext("2d");
cv.width = W;
cv.height = H;

// Mise en page par format (16:9 / 9:16). En vertical, marges de sécurité des réseaux :
// haut ~250 px, bas ~220 px, bord droit ~120 px (boutons j'aime / commentaires).
const LY =
    FMT === "v"
        ? {
              capX: 80, capMaxW: 900, capSize: 112, capY: 525,
              stepsX0: 200, stepsGap: 170, stepsY: 1530, stepsLabel: 20,
              disc: { x: W / 2, y: 1650, size: 30, align: "center", lines: ["Investir dans les crypto-actifs comporte", "un risque de perte en capital."] },
              winScale: 1, winDX: 0, awayX: 1150,
          }
        : {
              capX: 130, capMaxW: 640, capSize: 112, capY: 500,
              stepsX0: 190, stepsGap: 136, stepsY: 790, stepsLabel: 18,
              disc: { x: 130, y: 1036, size: 26, align: "left", lines: ["Investir dans les crypto-actifs comporte un risque de perte en capital."] },
              winScale: 1.08, winDX: 22, awayX: 1250,
          };
const IMG = {};
const S = (n) => TL.sceneSec(n);
const PLAN = TL.plan;
const OPEN_SLOW = 0.7;

const T_INSC = S("inscription")[0];
const T_DEPOT = S("depot")[0];
const T_EXPERTS = S("experts")[0];
const T_SUIVI = S("suivi")[0];
const T_RETRAIT = S("retrait")[0];
const SPEED = PLAN.speed;

// Fin de l'écran de connexion -> apparition de la barre latérale.
const T_SIDEBAR = T_INSC + (1.9 + 0.15) / SPEED.inscription;
// Retour de la fenêtre après la scène experts (première sortie).
const T_BACK = PLAN.aways[0][2];

// Transitions balayées entre écrans de l'app.
const WHIPS = [T_DEPOT, T_RETRAIT];
const WHIP_HALF = 0.45;

// Écrans de l'app : [scène, affiché à partir de, jusqu'à, origine du temps local, vitesse].
const SCREENS = [
    ["inscription", 0, T_DEPOT, T_INSC, SPEED.inscription],
    ["depot", T_DEPOT, T_EXPERTS, T_DEPOT, SPEED.depot],
    ["suivi", T_EXPERTS, T_RETRAIT, T_SUIVI, SPEED.suivi],
    ["retrait", T_RETRAIT, TL.DUR, T_RETRAIT, SPEED.retrait],
];

// Cartons (texte de gauche). `hl` = mots en dégradé.
const CAPTIONS = PLAN.captions;

const STEPS = ["Inscription", "Dépôt", "Gestion", "Suivi", "Retrait"];
const STEP_MARKS = [T_INSC, T_DEPOT, T_EXPERTS, T_SUIVI, T_RETRAIT];

const URLS = [
    [0, "flashrend.site/login"],
    [T_SIDEBAR, "flashrend.site/account"],
    [T_DEPOT, "flashrend.site/account/deposit"],
    [T_BACK, "flashrend.site/account"],
    [T_RETRAIT, "flashrend.site/account/payments/withdrawals"],
];

// Scènes dessinées hors de la fenêtre d'app, si la version les contient.
const OVERLAYS = ["constat", "reponse", "experts", "confiance", "cta"].filter((n) => TL.scenes[n]);

// Fond : noir zinc + nappes or du hero (ColorBends), grille de points, vignette
let GRID;
function makeGrid() {
    GRID = document.createElement("canvas");
    GRID.width = W + 96;
    GRID.height = H + 96;
    const g = GRID.getContext("2d");
    g.fillStyle = "#fff";
    for (let y = 0; y < GRID.height; y += 48) {
        for (let x = 0; x < GRID.width; x += 48) {
            g.beginPath();
            g.arc(x, y, 1.5, 0, TAU);
            g.fill();
        }
    }
}

function background(c, t) {
    c.fillStyle = P.bg;
    c.fillRect(0, 0, W, H);
    const ph = (t / TL.DUR) * TAU; // périodique sur la durée -> boucle parfaite
    const blobs = [
        [1480 + 240 * Math.sin(ph), 260 + 110 * Math.cos(ph * 2), 860, P.gold[0], 0.2],
        [360 + 220 * Math.cos(ph), 940 + 90 * Math.sin(ph * 2), 780, P.gold[1], 0.17],
        [1050 + 300 * Math.sin(ph + 2), 760 + 140 * Math.sin(ph * 3), 680, P.gold[3], 0.15],
    ];
    const sx = W / 1920;
    const sy = H / 1080;
    blobs.forEach(([bx, by, br, col, a]) => {
        const x = bx * sx;
        const y = by * sy;
        const r = br * Math.max(sx, sy) * (FMT === "v" ? 0.75 : 1);
        const g = c.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, col + Math.round(a * 255).toString(16).padStart(2, "0"));
        g.addColorStop(1, col + "00");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
    });
    // Grille qui dérive d'exactement 1 cellule sur la durée, et respire sur chaque mesure.
    const off = ((t / TL.DUR) * 48) % 48;
    const bar = kick(t % (TL.SPB * 4), 0, 0.8);
    c.save();
    c.globalAlpha = 0.045 + 0.02 * bar;
    c.drawImage(GRID, -off, -off);
    c.restore();
    const v = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.7)");
    c.fillStyle = v;
    c.fillRect(0, 0, W, H);
}

// Fenêtre d'application
function windowXform(t) {
    const enter = anim(t, PLAN.windowEnter, 1.3, E.outQuint);
    const away = PLAN.aways.reduce(
        (a, [o, od, b, bd]) => a + anim(t, o, od, E.inOutCubic) - (b == null ? 0 : anim(t, b, bd, E.inOutCubic)),
        0,
    );
    const exit = PLAN.drop == null ? 0 : anim(t, PLAN.drop, 1.5, E.inCubic);
    return {
        x: (1 - enter) * 1100 + away * LY.awayX + LY.winDX,
        y: Math.sin((t / 15) * TAU) * 6 + exit * (H - WIN.y + 150),
        rot: (1 - enter) * 0.12 + away * 0.06 - exit * 0.08,
        s: (0.88 + 0.12 * enter) * LY.winScale,
        on: t > PLAN.windowEnter && exit < 1 && away < 1,
    };
}

function urlAt(t) {
    let cur = URLS[0];
    let prev = URLS[0];
    for (const u of URLS) if (t >= u[0]) [prev, cur] = [cur, u];
    return { cur: cur[1], prev: prev[1], p: anim(t, cur[0], 0.4, E.outCubic) };
}

function sidebar(c, t) {
    const show = anim(t, T_SIDEBAR, 0.7, E.outQuint);
    if (show <= 0) return;
    c.save();
    c.translate(-(1 - show) * SB, 0);
    c.fillStyle = "#111114";
    c.fillRect(0, 0, SB, CH);
    c.fillStyle = P.line;
    c.fillRect(SB - 1, 0, 1, CH);
    const items = ["grid", "down", "chart", "up", "gear"];
    const iy = (i) => 52 + i * 70;
    // Élément actif : [instant du changement, index].
    const act = [
        [T_SIDEBAR, 0],
        [T_DEPOT, 1],
        [T_BACK, 0],
        [T_RETRAIT, 3],
    ];
    let k = 0;
    act.forEach((a, i) => t >= a[0] && (k = i));
    const from = act[Math.max(0, k - 1)][1];
    const to = act[k][1];
    const y = lerp(iy(from), iy(to), anim(t, act[k][0], 0.6, E.outQuint));
    fillRR(c, 12, y - 26, SB - 24, 52, 14, "rgba(234,179,8,0.16)");
    c.fillStyle = P.y400;
    c.fillRect(0, y - 16, 4, 32);
    items.forEach((n, i) => icon(c, n, SB / 2, iy(i), 26, i === to ? P.y400 : P.fg3, 2.2));
    c.restore();
}

function drawScreen(c, scr, t) {
    const [name, , until, origin, speed] = scr;
    c.save();
    SC[name](c, clamp(t - origin, 0, until - origin) * speed);
    c.restore();
}

function content(c, t) {
    sidebar(c, t);
    c.save();
    if (t > T_SIDEBAR) {
        c.beginPath();
        c.rect(SB, 0, CW - SB, CH);
        c.clip();
    }
    const wi = WHIPS.findIndex((b) => Math.abs(t - b) < WHIP_HALF);
    let cur = 0;
    SCREENS.forEach((s, i) => t >= s[1] && (cur = i));
    if (wi >= 0) {
        const b = WHIPS[wi];
        const p = E.inOutCubic((t - (b - WHIP_HALF)) / (WHIP_HALF * 2));
        const ni = SCREENS.findIndex((s) => s[1] === b);
        c.save();
        c.translate(-p * CW, 0);
        drawScreen(c, SCREENS[ni - 1], t);
        c.restore();
        c.save();
        c.translate((1 - p) * CW, 0);
        drawScreen(c, SCREENS[ni], t);
        c.restore();
    } else {
        drawScreen(c, SCREENS[cur], t);
    }
    c.restore();
    if (PLAN.toast != null) toast(c, t - PLAN.toast);
}

// Notification « email envoyé » qui descend en haut à droite de l'écran (version 60 s).
function toast(c, lt) {
    if (lt < 0 || lt > 3.2) return;
    const p = anim(lt, 0, 0.55, E.outBack) * (1 - anim(lt, 2.7, 0.45, E.inCubic));
    const w = 400;
    const h = 92;
    const x = CW - 32 - w;
    const y = lerp(-h - 20, 22, p);
    c.save();
    c.globalAlpha = clamp(p * 1.4);
    c.shadowColor = "rgba(0,0,0,0.55)";
    c.shadowBlur = 30;
    c.shadowOffsetY = 10;
    fillRR(c, x, y, w, h, 16, P.card2);
    c.shadowColor = "transparent";
    strokeRR(c, x + 0.5, y + 0.5, w - 1, h - 1, 16, "rgba(250,204,21,0.45)", 1.5);
    fillRR(c, x + 18, y + 20, 52, 52, 14, "rgba(234,179,8,0.16)");
    icon(c, "mail", x + 44, y + 46, 26, P.y400);
    text(c, "Investissement confirmé", x + 86, y + 42, { size: 20, weight: 700 });
    text(c, "Notification envoyée par email", x + 86, y + 68, { size: 15, family: MONO, color: P.fg2 });
    c.restore();
}

function appWindow(c, t) {
    const X = windowXform(t);
    if (!X.on) return;
    const cx = WIN.x + WIN.w / 2;
    const cy = WIN.y + WIN.h / 2;
    c.save();
    c.translate(cx + X.x, cy + X.y);
    c.rotate(X.rot);
    c.scale(X.s, X.s);
    c.translate(-WIN.w / 2, -WIN.h / 2);

    // Halo jaune derrière la fenêtre + ombre portée.
    const halo = c.createRadialGradient(WIN.w / 2, WIN.h * 0.6, 0, WIN.w / 2, WIN.h * 0.6, WIN.w * 0.75);
    halo.addColorStop(0, "rgba(234,179,8,0.20)");
    halo.addColorStop(1, "rgba(234,179,8,0)");
    c.fillStyle = halo;
    c.fillRect(-WIN.w * 0.3, -WIN.h * 0.3, WIN.w * 1.6, WIN.h * 1.6);
    c.shadowColor = "rgba(0,0,0,0.65)";
    c.shadowBlur = 70;
    c.shadowOffsetY = 30;
    fillRR(c, 0, 0, WIN.w, WIN.h, WIN.r, "#0d0d10");
    c.shadowColor = "transparent";

    // Barre de titre.
    c.save();
    rr(c, 0, 0, WIN.w, WIN.h, WIN.r);
    c.clip();
    c.fillStyle = P.card;
    c.fillRect(0, 0, WIN.w, WIN.bar);
    c.fillStyle = P.line;
    c.fillRect(0, WIN.bar - 1, WIN.w, 1);
    for (let i = 0; i < 3; i++) {
        c.fillStyle = "#3f3f46";
        c.beginPath();
        c.arc(30 + i * 24, WIN.bar / 2, 7, 0, TAU);
        c.fill();
    }
    const pw = 520;
    const px = (WIN.w - pw) / 2;
    fillRR(c, px, 12, pw, 32, 10, P.bg);
    icon(c, "lock", px + 22, 28, 14, P.fg3);
    const u = urlAt(t);
    c.save();
    c.beginPath();
    c.rect(px + 36, 12, pw - 44, 32);
    c.clip();
    text(c, u.prev, px + 40, 34 - u.p * 30, { size: 15, family: MONO, color: P.fg2 });
    text(c, u.cur, px + 40, 34 + (1 - u.p) * 30, { size: 15, family: MONO, color: P.fg2 });
    c.restore();
    appLogo(c, WIN.w - 36, WIN.bar / 2, 28);

    // Contenu.
    c.translate(0, WIN.bar);
    content(c, t);
    c.restore();

    strokeRR(c, 0.5, 0.5, WIN.w - 1, WIN.h - 1, WIN.r, P.line2, 1.5);
    c.restore();

    // Quelques traînées discrètes pendant les balayages.
    WHIPS.forEach((b, wi) => {
        const p = (t - (b - WHIP_HALF)) / (WHIP_HALF * 2);
        if (p <= 0 || p >= 1) return;
        const R = rng(100 + wi);
        c.save();
        c.lineCap = "round";
        for (let i = 0; i < 6; i++) {
            const y = WIN.y + 60 + R() * (WIN.h - 120);
            const len = 200 + R() * 300;
            const x = lerp(W + 200, WIN.x - 400, E.inOutCubic(clamp(p * 1.2 - R() * 0.2)));
            const g = c.createLinearGradient(x, 0, x + len, 0);
            g.addColorStop(0, "rgba(253,215,0,0.45)");
            g.addColorStop(1, "rgba(253,215,0,0)");
            c.strokeStyle = g;
            c.globalAlpha = Math.sin(p * Math.PI);
            c.lineWidth = 2 + R() * 2;
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(x + len, y);
            c.stroke();
        }
        c.restore();
    });
}

// Cartons : les mots montent d'un masque, puis repartent vers le haut
function caption(c, t, cap) {
    if (t < cap.in - 0.05 || t > cap.out + 0.9) return;
    const X0 = LY.capX;
    const maxW = LY.capMaxW;
    const size = fitSize(c, cap.lines, maxW, LY.capSize, 700, SANS, -4);
    const lh = size * 1.02;
    const ls = -size * 0.035;
    const top = LY.capY - (cap.lines.length * lh) / 2;

    const kIn = anim(t, cap.in - 0.05, 0.7, E.outQuint);
    const kOut = anim(t, cap.out, 0.4, E.inCubic);
    c.save();
    c.beginPath();
    c.rect(X0, top - 74, 600 * kIn, 40);
    c.clip();
    c.globalAlpha = 1 - kOut;
    c.fillStyle = P.y400;
    c.fillRect(X0, top - 58, 36, 5);
    text(c, cap.k, X0 + 50, top - 46, { size: 24, weight: 700, family: MONO, color: P.y400, ls: 4 });
    c.restore();

    let wi = 0;
    cap.lines.forEach((line, li) => {
        const base = top + lh * (li + 0.82);
        c.save();
        c.beginPath();
        c.rect(X0 - 30, base - size * 1.02, W, size * 1.32);
        c.clip();
        let x = X0;
        line.split(" ").forEach((word) => {
            const ww = measure(c, word, size, 700, SANS, ls);
            const sp = measure(c, " ", size, 700, SANS, ls);
            const pin = anim(t, cap.in + wi * 0.08, 0.9, E.outQuint);
            const pout = anim(t, cap.out + wi * 0.035, 0.5, E.inCubic);
            const dy = (1 - pin) * size * 1.15 - pout * size * 1.2;
            c.save();
            c.translate(x, base + dy);
            c.rotate((1 - pin) * 0.05);
            const isHl = cap.hl.includes(word);
            c.font = font(size, 700, SANS);
            c.letterSpacing = ls + "px";
            c.textBaseline = "alphabetic";
            c.textAlign = "left";
            c.fillStyle = isHl ? brandGradient(c, 0, 0, ww, 0) : P.fg;
            c.fillText(word, 0, 0);
            c.letterSpacing = "0px";
            if (isHl) {
                const u = anim(t, cap.in + 0.5 + wi * 0.06, 0.8, E.outQuint) * (1 - pout);
                c.fillStyle = P.y400;
                c.fillRect(0, size * 0.16, ww * u, Math.max(6, size * 0.07));
            }
            c.restore();
            x += ww + sp;
            wi++;
        });
        c.restore();
    });
}

// Progression des 5 étapes
function steps(c, t) {
    const a = anim(t, T_INSC - 0.15, 0.7, E.outQuint) * (1 - anim(t, PLAN.stepsOut, 0.5, E.inCubic));
    if (a <= 0) return;
    const x0 = LY.stepsX0;
    const gap = LY.stepsGap;
    const y = LY.stepsY;
    let cur = 0;
    STEP_MARKS.forEach((m, i) => t >= m && (cur = i));
    const prog = lerp(cur - 1, cur, anim(t, STEP_MARKS[cur], 0.8, E.outQuint));
    const n = STEPS.length - 1;
    c.save();
    c.globalAlpha = a;
    c.translate(0, (1 - a) * 30);
    fillRR(c, x0, y - 2, gap * n, 4, 2, P.muted);
    rr(c, x0, y - 2, gap * clamp(prog, 0, n), 4, 2);
    c.fillStyle = brandGradient(c, x0, 0, x0 + gap * n, 0);
    c.fill();
    STEPS.forEach((s, i) => {
        const x = x0 + i * gap;
        const done = i < cur;
        const active = i === cur;
        const k = active ? kick(t, STEP_MARKS[i], 0.6) : 0;
        c.beginPath();
        c.arc(x, y, 9 + 4 * k, 0, TAU);
        c.fillStyle = done || active ? P.y400 : P.muted;
        c.fill();
        if (active) ring(c, x, y, (t * 0.8) % 1, 28, P.y400, 3);
        text(c, s, x, y + 42, {
            size: LY.stepsLabel,
            weight: 700,
            family: MONO,
            align: "center",
            color: active ? P.fg : done ? P.fg2 : P.fg3,
        });
    });
    c.restore();
}

function disclaimer(c) {
    const d = LY.disc;
    d.lines.forEach((l, i) =>
        text(c, l, d.x, d.y + i * d.size * 1.3, { size: d.size, align: d.align, color: "rgba(250,250,250,0.6)" }),
    );
}

// Logo Solana : trois barres en parallélogramme, dégradé violet -> vert.
function solanaLogo(size) {
    const cv2 = document.createElement("canvas");
    cv2.width = cv2.height = size;
    const g = cv2.getContext("2d");
    const grad = g.createLinearGradient(size * 0.1, size * 0.9, size * 0.9, size * 0.1);
    grad.addColorStop(0, "#9945FF");
    grad.addColorStop(1, "#14F195");
    g.fillStyle = grad;
    const w = size * 0.72;
    const h = size * 0.15;
    const sk = size * 0.13;
    const x0 = (size - w - sk) / 2;
    [
        [size * 0.25, 1],
        [size * 0.5, -1],
        [size * 0.75, 1],
    ].forEach(([cy, dir]) => {
        const y = cy - h / 2;
        g.beginPath();
        if (dir > 0) {
            g.moveTo(x0 + sk, y);
            g.lineTo(x0 + sk + w, y);
            g.lineTo(x0 + w, y + h);
            g.lineTo(x0, y + h);
        } else {
            g.moveTo(x0, y);
            g.lineTo(x0 + w, y);
            g.lineTo(x0 + w + sk, y + h);
            g.lineTo(x0 + sk, y + h);
        }
        g.closePath();
        g.fill();
    });
    return cv2;
}

// Image complète à l'instant t
function compose(c, t) {
    background(c, t);
    const sh = shakeAmt(t, 0.6, 0.5, 10);
    c.save();
    c.translate(sh.x, sh.y);
    appWindow(c, t);
    OVERLAYS.forEach((n) => SC[n](c, t - S(n)[0]));
    CAPTIONS.forEach((cap) => caption(c, t, cap));
    steps(c, t);
    if (TL.scenes.boucle) SC.boucle(c, (t - S("boucle")[0]) * 0.6);
    SC.ouverture(c, t * OPEN_SLOW);
    c.restore();
    disclaimer(c);
}

// Nombre de sous-images pour le flou de mouvement selon l'intensité du moment.
function blurSamples(t) {
    const zones = [
        [0.5, 0.8, 3],
        [1.2, 1.95, 5],
        [PLAN.windowEnter, PLAN.windowEnter + 0.85, 3],
        ...PLAN.aways.flatMap(([o, od, b, bd]) => [[o, o + od, 4], ...(b == null ? [] : [[b, b + bd, 4]])]),
        ...(PLAN.drop == null ? [] : [[PLAN.drop, PLAN.drop + 1.6, 4]]),
        ...WHIPS.map((b) => [b - WHIP_HALF, b + WHIP_HALF, 4]),
        ...CAPTIONS.map((cp) => [cp.out, cp.out + 0.6, 3]),
    ];
    return zones.reduce((n, [a, b, k]) => (t >= a && t <= b ? Math.max(n, k) : n), 1);
}

let BUF;
const NOISE = [];
function makeNoise() {
    for (let k = 0; k < 4; k++) {
        const n = document.createElement("canvas");
        n.width = n.height = 256;
        const g = n.getContext("2d");
        const d = g.createImageData(256, 256);
        const R = rng(500 + k);
        for (let i = 0; i < d.data.length; i += 4) {
            const v = R() * 255;
            d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
            d.data[i + 3] = 255;
        }
        g.putImageData(d, 0, 0);
        NOISE.push(g.createPattern(n, "repeat"));
    }
}

window.renderFrame = (f, type = "jpeg") => {
    const t = f / TL.FPS;
    const n = blurSamples(t);
    if (n === 1) {
        compose(ctx, t);
    } else {
        // Moyenne glissante de n sous-images sur un obturateur à 180°.
        const shutter = 0.5 / TL.FPS;
        const b = BUF.getContext("2d");
        for (let i = 0; i < n; i++) {
            const st = t - shutter / 2 + (shutter * i) / (n - 1);
            b.setTransform(1, 0, 0, 1, 0, 0);
            compose(b, st);
            ctx.globalAlpha = 1 / (i + 1);
            ctx.drawImage(BUF, 0, 0);
        }
        ctx.globalAlpha = 1;
    }
    // Grain.
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.07;
    ctx.translate(-((f * 37) % 256), -((f * 59) % 256));
    ctx.fillStyle = NOISE[f % 4];
    ctx.fillRect(0, 0, W + 256, H + 256);
    ctx.restore();
    return cv.toDataURL(type === "png" ? "image/png" : "image/jpeg", 0.95);
};

async function init() {
    const fonts = [
        new FontFace("Space Grotesk", "url(fonts/SpaceGrotesk.woff2)", { weight: "300 700" }),
        new FontFace("Space Mono", "url(fonts/SpaceMono-400.woff2)", { weight: "400" }),
        new FontFace("Space Mono", "url(fonts/SpaceMono-700.woff2)", { weight: "700" }),
    ];
    await Promise.all(fonts.map((f) => f.load().then((ff) => document.fonts.add(ff))));
    const load = (k, src) =>
        new Promise((res) => {
            const im = new Image();
            im.onload = () => ((IMG[k] = im), res());
            im.onerror = () => res();
            im.src = src;
        });
    await Promise.all([
        load("btc", "/public/bitcoin.png"),
        load("eth", "/public/ethereum.png"),
    ]);
    // public/solana.png contient en réalité le logo Binance : on dessine le vrai logo Solana.
    IMG.sol = solanaLogo(256);
    makeGrid();
    makeNoise();
    BUF = document.createElement("canvas");
    BUF.width = W;
    BUF.height = H;
    window.READY = true;
    if (location.hash) renderFrame(Math.round(parseFloat(location.hash.slice(1)) * TL.FPS));
}

init();
