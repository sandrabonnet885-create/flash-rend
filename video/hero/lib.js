// Bibliothèque de dessin partagée par les scènes. Aucun état : tout se calcule depuis le temps.

// Format : 16:9 par défaut, 9:16 avec ?f=v dans l'URL de la page.
const FMT = typeof location !== "undefined" && new URLSearchParams(location.search).get("f") === "v" ? "v" : "h";
const W = FMT === "v" ? 1080 : 1920;
const H = FMT === "v" ? 1920 : 1080;

// Direction artistique : tokens du thème sombre du site (src/app/globals.css) + logo.
const P = {
    bg: "#09090b",
    card: "#18181b",
    card2: "#1f1f23",
    muted: "#27272a",
    line: "rgba(255,255,255,0.10)",
    line2: "rgba(255,255,255,0.16)",
    fg: "#fafafa",
    fg2: "#a1a1aa",
    fg3: "#71717a",
    y300: "#fde047",
    y400: "#facc15",
    y500: "#eab308",
    y600: "#ca8a04",
    bolt: "#fdd700",
    amber: "#f59e0b",
    orange: "#ea580c",
    green: "#22c55e",
    blue: "#3b82f6",
    sky: "#0ea5e9",
    purple: "#a855f7",
    gold: ["#D4AF37", "#B8860B", "#AA7F2E", "#8B6914"],
};

const SANS = '"Space Grotesk", sans-serif';
const MONO = '"Space Mono", monospace';

// Fenêtre d'application : zone de contenu sous la barre de titre.
const WIN =
    FMT === "v" ? { x: 40, y: 790, w: 1000, h: 660, bar: 56, r: 26 } : { x: 820, y: 205, w: 1000, h: 660, bar: 56, r: 26 };
const CW = WIN.w;
const CH = WIN.h - WIN.bar;
const SB = 76; // largeur de la barre latérale

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;

const E = {
    linear: (t) => t,
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inCubic: (t) => t * t * t,
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outQuint: (t) => 1 - Math.pow(1 - t, 5),
    outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    inOutExpo: (t) =>
        t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    outBack: (t, s = 1.1) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
    inBack: (t, s = 1.7) => (s + 1) * t * t * t - s * t * t,
    // Ressort amorti, t en secondes depuis le départ.
    spring: (t, damp = 7, freq = 9) => (t <= 0 ? 0 : 1 - Math.exp(-damp * t) * Math.cos(freq * t)),
};

// Progression 0->1 d'une animation qui démarre à `s` et dure `d`.
const anim = (lt, s, d, e = E.outCubic) => e(clamp((lt - s) / d));

// Coup de poing : 1 au déclenchement, retombe à 0 en `d` secondes.
const kick = (lt, t0, d = 0.35) => {
    const x = (lt - t0) / d;
    return x < 0 || x > 1 ? 0 : Math.pow(1 - x, 3);
};

// Secousse déterministe.
const shakeAmt = (lt, t0, d, amp) => {
    const k = kick(lt, t0, d) * amp;
    return { x: Math.sin(lt * 91.3) * k, y: Math.cos(lt * 73.7) * k };
};

// Générateur pseudo-aléatoire reproductible.
function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.roundRect(x, y, w, h, r);
}

function fillRR(c, x, y, w, h, r, fill) {
    rr(c, x, y, w, h, r);
    c.fillStyle = fill;
    c.fill();
}

function strokeRR(c, x, y, w, h, r, stroke, lw = 1.5) {
    rr(c, x, y, w, h, r);
    c.strokeStyle = stroke;
    c.lineWidth = lw;
    c.stroke();
}

// Carte du design system : fond zinc-900 + bordure 10 %.
function cardBox(c, x, y, w, h, r = 18) {
    fillRR(c, x, y, w, h, r, P.card);
    strokeRR(c, x + 0.5, y + 0.5, w - 1, h - 1, r, P.line);
}

function font(size, weight = 500, family = SANS) {
    return `${weight} ${size}px ${family}`;
}

function text(c, str, x, y, o = {}) {
    c.font = font(o.size || 24, o.weight || 500, o.family || SANS);
    c.fillStyle = o.color || P.fg;
    c.textAlign = o.align || "left";
    c.textBaseline = o.baseline || "alphabetic";
    c.letterSpacing = (o.ls || 0) + "px";
    c.fillText(str, x, y);
    c.letterSpacing = "0px";
}

function measure(c, str, size, weight = 500, family = SANS, ls = 0) {
    c.font = font(size, weight, family);
    c.letterSpacing = ls + "px";
    const w = c.measureText(str).width;
    c.letterSpacing = "0px";
    return w;
}

// Plus grande taille ≤ `size` pour que toutes les lignes tiennent dans `maxW`.
function fitSize(c, lines, maxW, size, weight = 700, family = SANS, ls = 0) {
    let s = size;
    while (s > 12 && Math.max(...lines.map((l) => measure(c, l, s, weight, family, ls * (s / size)))) > maxW) s -= 2;
    return s;
}

function brandGradient(c, x0, y0, x1, y1) {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, P.y300);
    g.addColorStop(0.45, P.amber);
    g.addColorStop(1, P.orange);
    return g;
}

// Montant au format français, espace normale comme séparateur de milliers.
function eur(v, dec = 2) {
    const [i, d] = Math.abs(v).toFixed(dec).split(".");
    const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (v < 0 ? "-" : "") + int + (dec ? "," + d : "") + " €";
}

// Onde de choc circulaire.
function ring(c, x, y, p, maxR, color, lw = 6) {
    if (p <= 0 || p >= 1) return;
    c.save();
    c.globalAlpha *= 1 - p;
    c.strokeStyle = color;
    c.lineWidth = lw * (1 - p) + 1;
    c.beginPath();
    c.arc(x, y, maxR * E.outExpo(p), 0, TAU);
    c.stroke();
    c.restore();
}

// Rayons qui jaillissent d'un point (succès, impact).
function burst(c, x, y, p, n, r0, len, color, lw = 4, seed = 1) {
    if (p <= 0 || p >= 1) return;
    const R = rng(seed);
    c.save();
    c.strokeStyle = color;
    c.lineCap = "round";
    c.lineWidth = lw;
    for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + R() * 0.3;
        const l = len * (0.6 + R() * 0.6);
        const d0 = r0 + E.outExpo(p) * l;
        const d1 = d0 + l * 0.45 * (1 - E.outCubic(p));
        c.globalAlpha = 1 - p;
        c.beginPath();
        c.moveTo(x + Math.cos(a) * d0, y + Math.sin(a) * d0);
        c.lineTo(x + Math.cos(a) * d1, y + Math.sin(a) * d1);
        c.stroke();
    }
    c.restore();
}

// Coche tracée progressivement.
function check(c, x, y, s, p, color, lw = 6) {
    if (p <= 0) return;
    const pts = [
        [-0.42, 0.02],
        [-0.12, 0.32],
        [0.45, -0.3],
    ];
    const l1 = Math.hypot(0.3, 0.3);
    const l2 = Math.hypot(0.57, 0.62);
    const L = (l1 + l2) * p;
    c.save();
    c.strokeStyle = color;
    c.lineWidth = lw;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(x + pts[0][0] * s, y + pts[0][1] * s);
    if (L <= l1) {
        const k = L / l1;
        c.lineTo(x + lerp(pts[0][0], pts[1][0], k) * s, y + lerp(pts[0][1], pts[1][1], k) * s);
    } else {
        const k = (L - l1) / l2;
        c.lineTo(x + pts[1][0] * s, y + pts[1][1] * s);
        c.lineTo(x + lerp(pts[1][0], pts[2][0], k) * s, y + lerp(pts[1][1], pts[2][1], k) * s);
    }
    c.stroke();
    c.restore();
}

function spinner(c, x, y, r, lt, color, lw = 4) {
    c.save();
    c.strokeStyle = color;
    c.lineWidth = lw;
    c.lineCap = "round";
    const a = lt * 9;
    c.beginPath();
    c.arc(x, y, r, a, a + Math.PI * 1.35);
    c.stroke();
    c.restore();
}

// Pointeur de souris ; `press` 0->1 l'écrase légèrement.
function cursor(c, x, y, press = 0, alpha = 1) {
    if (alpha <= 0) return;
    c.save();
    c.globalAlpha *= alpha;
    c.translate(x, y);
    const s = 1.35 * (1 - 0.15 * press);
    c.scale(s, s);
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, 26);
    c.lineTo(6.5, 20);
    c.lineTo(11, 30);
    c.lineTo(15, 28.3);
    c.lineTo(10.6, 18.6);
    c.lineTo(19, 18.6);
    c.closePath();
    c.shadowColor = "rgba(0,0,0,0.5)";
    c.shadowBlur = 10;
    c.shadowOffsetY = 3;
    c.fillStyle = P.fg;
    c.fill();
    c.shadowColor = "transparent";
    c.lineWidth = 1.6;
    c.strokeStyle = P.bg;
    c.stroke();
    c.restore();
}

// Trajet de curseur : liste de [temps, x, y], interpolation douce entre les points.
function cursorPath(lt, keys) {
    if (lt <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
    for (let i = 0; i < keys.length - 1; i++) {
        const [t0, x0, y0] = keys[i];
        const [t1, x1, y1] = keys[i + 1];
        if (lt <= t1) {
            const k = E.inOutCubic((lt - t0) / (t1 - t0));
            // Légère courbe pour un geste naturel.
            const arc = Math.sin(k * Math.PI) * 0.12 * (x1 - x0);
            return { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.abs(arc) * 0.5 };
        }
    }
    const l = keys[keys.length - 1];
    return { x: l[1], y: l[2] };
}

// Éclair du logo (public/logo.png), coordonnées normalisées autour de son centre.
const BOLT = [
    [1035, 342],
    [1292, 720],
    [1056, 724],
    [983, 974],
    [1292, 974],
    [781, 1590],
    [899, 1073],
    [643, 1073],
    [853, 720],
    [639, 720],
].map(([x, y]) => [(x - 965) / 1248, (y - 966) / 1248]);

function boltPath(c, x, y, h) {
    c.beginPath();
    BOLT.forEach(([bx, by], i) => (i ? c.lineTo(x + bx * h, y + by * h) : c.moveTo(x + bx * h, y + by * h)));
    c.closePath();
}

// Logo d'app : carré arrondi noir + éclair jaune.
function appLogo(c, x, y, s) {
    fillRR(c, x - s / 2, y - s / 2, s, s, s * 0.24, "#000");
    strokeRR(c, x - s / 2, y - s / 2, s, s, s * 0.24, P.line2, 1.2);
    boltPath(c, x, y, s * 0.82);
    c.fillStyle = P.bolt;
    c.fill();
}

// Icônes au trait (style Lucide/Tabler du site)
function icon(c, name, x, y, s, color, lw = 2.4) {
    c.save();
    c.translate(x, y);
    c.scale(s / 24, s / 24);
    c.translate(-12, -12);
    c.strokeStyle = color;
    c.fillStyle = color;
    c.lineWidth = lw * (24 / s) * (s / 24) * 1;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = lw;
    const L = (pts) => {
        c.beginPath();
        pts.forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b)));
        c.stroke();
    };
    switch (name) {
        case "bank":
            L([[3, 21], [21, 21]]);
            L([[3, 10], [21, 10]]);
            L([[5, 6], [12, 3], [19, 6]]);
            L([[4, 10], [20, 10]]);
            [6, 10, 14, 18].forEach((px) => L([[px, 10], [px, 18]]));
            break;
        case "wallet":
            c.beginPath();
            c.roundRect(3, 6, 18, 14, 2.5);
            c.stroke();
            L([[3, 10], [17, 4]]);
            c.beginPath();
            c.arc(17, 13, 1.4, 0, TAU);
            c.fill();
            break;
        case "card":
            c.beginPath();
            c.roundRect(2.5, 5, 19, 14, 2.5);
            c.stroke();
            L([[2.5, 10], [21.5, 10]]);
            L([[6, 15], [10, 15]]);
            break;
        case "grid":
            [[4, 4], [13.5, 4], [4, 13.5], [13.5, 13.5]].forEach(([a, b]) => {
                c.beginPath();
                c.roundRect(a, b, 6.5, 6.5, 1.6);
                c.stroke();
            });
            break;
        case "down":
            L([[12, 4], [12, 18]]);
            L([[6, 12], [12, 18], [18, 12]]);
            L([[5, 21], [19, 21]]);
            break;
        case "up":
            L([[12, 20], [12, 6]]);
            L([[6, 12], [12, 6], [18, 12]]);
            L([[5, 3], [19, 3]]);
            break;
        case "chart":
            L([[3, 3], [3, 21], [21, 21]]);
            L([[7, 15], [11, 10], [14, 13], [20, 6]]);
            break;
        case "gear":
            c.beginPath();
            c.arc(12, 12, 3.2, 0, TAU);
            c.stroke();
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * TAU;
                L([[12 + Math.cos(a) * 6.5, 12 + Math.sin(a) * 6.5], [12 + Math.cos(a) * 9, 12 + Math.sin(a) * 9]]);
            }
            c.beginPath();
            c.arc(12, 12, 6.5, 0, TAU);
            c.stroke();
            break;
        case "user":
            c.beginPath();
            c.arc(12, 8, 4.2, 0, TAU);
            c.fill();
            c.beginPath();
            c.arc(12, 23, 8.5, Math.PI, 0);
            c.fill();
            break;
        case "search":
            c.beginPath();
            c.arc(10.5, 10.5, 6.5, 0, TAU);
            c.stroke();
            L([[15.5, 15.5], [21, 21]]);
            break;
        case "target":
            c.beginPath();
            c.arc(12, 12, 8.5, 0, TAU);
            c.stroke();
            c.beginPath();
            c.arc(12, 12, 4, 0, TAU);
            c.stroke();
            c.beginPath();
            c.arc(12, 12, 1.2, 0, TAU);
            c.fill();
            break;
        case "sliders":
            L([[4, 7], [20, 7]]);
            L([[4, 17], [20, 17]]);
            c.beginPath();
            c.arc(9, 7, 2.8, 0, TAU);
            c.fill();
            c.beginPath();
            c.arc(15, 17, 2.8, 0, TAU);
            c.fill();
            break;
        case "shield":
            c.beginPath();
            c.moveTo(12, 2.5);
            c.lineTo(20, 5.5);
            c.lineTo(20, 11.5);
            c.quadraticCurveTo(20, 18, 12, 21.5);
            c.quadraticCurveTo(4, 18, 4, 11.5);
            c.lineTo(4, 5.5);
            c.closePath();
            c.stroke();
            L([[8.5, 12], [11, 14.5], [15.5, 9.5]]);
            break;
        case "mail":
            c.beginPath();
            c.roundRect(3, 5.5, 18, 13, 2.5);
            c.stroke();
            L([[3.5, 7], [12, 13], [20.5, 7]]);
            break;
        case "chat":
            c.beginPath();
            c.moveTo(5, 4);
            c.lineTo(19, 4);
            c.quadraticCurveTo(21, 4, 21, 6);
            c.lineTo(21, 14);
            c.quadraticCurveTo(21, 16, 19, 16);
            c.lineTo(10, 16);
            c.lineTo(5.5, 20);
            c.lineTo(5.5, 16);
            c.lineTo(5, 16);
            c.quadraticCurveTo(3, 16, 3, 14);
            c.lineTo(3, 6);
            c.quadraticCurveTo(3, 4, 5, 4);
            c.closePath();
            c.stroke();
            [8, 12, 16].forEach((px) => {
                c.beginPath();
                c.arc(px, 10, 1.2, 0, TAU);
                c.fill();
            });
            break;
        case "lock":
            c.beginPath();
            c.roundRect(5, 11, 14, 10, 2);
            c.fill();
            c.beginPath();
            c.arc(12, 11, 4.5, Math.PI, 0);
            c.stroke();
            break;
        case "apple":
            c.beginPath();
            c.arc(12, 14, 6.5, 0, TAU);
            c.fill();
            c.beginPath();
            c.ellipse(14, 5.5, 1.6, 3, 0.6, 0, TAU);
            c.fill();
            break;
    }
    c.restore();
}

// « G » Google quatre couleurs.
function googleG(c, x, y, r) {
    const cols = ["#EA4335", "#FBBC05", "#34A853", "#4285F4"];
    const arcs = [
        [-2.4, -0.75],
        [-3.9, -2.4],
        [0.75, 2.35],
        [-0.1, 0.75],
    ];
    c.save();
    c.lineWidth = r * 0.42;
    arcs.forEach(([a, b], i) => {
        c.strokeStyle = cols[i];
        c.beginPath();
        c.arc(x, y, r * 0.78, a, b);
        c.stroke();
    });
    c.fillStyle = "#4285F4";
    c.fillRect(x, y - r * 0.2, r * 0.98, r * 0.4);
    c.restore();
}

// Bouton : `press` 0->1 enfonce, `glow` ajoute un halo jaune.
function button(c, x, y, w, h, label, o = {}) {
    const press = o.press || 0;
    c.save();
    c.translate(x + w / 2, y + h / 2);
    const s = 1 - 0.04 * press;
    c.scale(s, s);
    c.translate(-w / 2, -h / 2);
    if (o.glow) {
        c.shadowColor = `rgba(234,179,8,${0.55 * o.glow})`;
        c.shadowBlur = 40 * o.glow;
    }
    if (o.variant === "outline") {
        fillRR(c, 0, 0, w, h, 14, P.card2);
        c.shadowColor = "transparent";
        strokeRR(c, 0.5, 0.5, w - 1, h - 1, 14, P.line2);
    } else if (o.variant === "white") {
        fillRR(c, 0, 0, w, h, 14, P.fg);
    } else {
        rr(c, 0, 0, w, h, 14);
        c.fillStyle = P.y400;
        c.fill();
    }
    c.shadowColor = "transparent";
    if (o.progress) {
        c.save();
        rr(c, 0, 0, w, h, 14);
        c.clip();
        c.fillStyle = "rgba(255,255,255,0.35)";
        c.fillRect(0, 0, w * o.progress, h);
        c.restore();
    }
    const color = o.variant === "outline" ? P.fg : P.bg;
    const lx = o.iconW ? w / 2 + o.iconW / 2 : w / 2;
    text(c, label, lx, h / 2 + 1, { size: o.size || 22, weight: 700, color, align: "center", baseline: "middle" });
    if (o.drawIcon) o.drawIcon(c, w / 2 - measure(c, label, o.size || 22, 700) / 2 - 4 + (lx - w / 2), h / 2);
    c.restore();
}

// Badge (pastille de statut).
function badge(c, x, y, label, fg, bg, o = {}) {
    const size = o.size || 15;
    const w = measure(c, label, size, 700, MONO) + (o.dot ? 40 : 26);
    const h = size + 16;
    fillRR(c, x, y, w, h, h / 2, bg);
    if (o.dot) {
        c.save();
        c.fillStyle = fg;
        c.beginPath();
        c.arc(x + 18, y + h / 2, 5, 0, TAU);
        c.fill();
        if (o.pulse != null) {
            c.globalAlpha = 1 - o.pulse;
            c.strokeStyle = fg;
            c.lineWidth = 2;
            c.beginPath();
            c.arc(x + 18, y + h / 2, 5 + o.pulse * 10, 0, TAU);
            c.stroke();
        }
        c.restore();
    }
    text(c, label, x + (o.dot ? 30 : 13), y + h / 2 + 1, { size, weight: 700, family: MONO, color: fg, baseline: "middle" });
    return w;
}

// Élément qui « pop » : échelle + montée, centré sur (cx, cy).
function pop(c, p, cx, cy, fn, dy = 26) {
    if (p <= 0) return;
    c.save();
    c.globalAlpha *= clamp(p * 1.6);
    c.translate(cx, cy + (1 - clamp(p)) * dy);
    const s = 0.86 + 0.14 * p;
    c.scale(s, s);
    c.translate(-cx, -cy);
    fn();
    c.restore();
}

// Texte qui s'écrit caractère par caractère avec un petit rebond.
function typeText(c, str, x, y, lt, t0, step, o) {
    let cx = x;
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        const p = anim(lt, t0 + i * step, 0.22, E.outBack);
        const w = measure(c, ch, o.size, o.weight || 700, o.family || MONO);
        if (p > 0) {
            c.save();
            c.globalAlpha *= clamp(p * 2);
            c.translate(cx + w / 2, y - (1 - p) * 18);
            const s = 0.6 + 0.4 * p;
            c.scale(s, s);
            text(c, ch, -w / 2, 0, o);
            c.restore();
        }
        cx += w;
    }
    return { x: cx, n: str.length };
}
