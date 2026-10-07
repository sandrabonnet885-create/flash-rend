// Musique originale + effets sonores, synthétisés en Node pur (aucun échantillon, aucun droit).
// House douce à 96 BPM, calée sur timeline.js. Sortie : out/music.wav (44,1 kHz, stéréo, 16 bits).
//   node video/hero/audio/synth.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { TL } = require("../timeline.js");

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SUFFIX = TL.VERSION === "30" ? "" : TL.VERSION;
const OUT = path.join(ROOT, "../out", process.env.STEM ? `stem-${process.env.STEM}.wav` : `music${SUFFIX}.wav`);

const SR = 44100;
const N = Math.ceil(TL.DUR * SR);
const SPB = TL.SPB;
const BAR = SPB * 4;

// Bus : sec (gauche/droite) et envoi réverb (gauche/droite).
const L = new Float32Array(N);
const R = new Float32Array(N);
const RvL = new Float32Array(N);
const RvR = new Float32Array(N);

const TAU = Math.PI * 2;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 12345;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

function add(i, l, r, send = 0) {
    if (i < 0 || i >= N) return;
    L[i] += l;
    R[i] += r;
    RvL[i] += l * send;
    RvR[i] += r * send;
}

// Filtre biquad RBJ (passe-bas / passe-bande / passe-haut), coefficients modifiables à la volée.
class Biquad {
    constructor() {
        this.x1 = this.x2 = this.y1 = this.y2 = 0;
    }
    set(type, f, q = 0.707) {
        const w = (TAU * Math.min(f, SR * 0.45)) / SR;
        const cs = Math.cos(w);
        const al = Math.sin(w) / (2 * q);
        let b0, b1, b2;
        if (type === "lp") [b0, b1, b2] = [(1 - cs) / 2, 1 - cs, (1 - cs) / 2];
        else if (type === "hp") [b0, b1, b2] = [(1 + cs) / 2, -(1 + cs), (1 + cs) / 2];
        else [b0, b1, b2] = [al, 0, -al];
        const a0 = 1 + al;
        this.b0 = b0 / a0;
        this.b1 = b1 / a0;
        this.b2 = b2 / a0;
        this.a1 = (-2 * cs) / a0;
        this.a2 = (1 - al) / a0;
    }
    run(x) {
        const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
        this.x2 = this.x1;
        this.x1 = x;
        this.y2 = this.y1;
        this.y1 = y;
        return y;
    }
}

// Grille musicale
// Un accord toutes les 2 mesures : Fmaj7, G6, Am7, Em7, Fmaj7, G6 (repris en boucle sur les versions longues).
const CHORDS = [
    [53, 57, 60, 64],
    [55, 59, 62, 64],
    [57, 60, 64, 67],
    [52, 55, 59, 62],
    [53, 57, 60, 64],
    [55, 59, 62, 64],
];
const chordIdx = (t) => Math.floor(t / (BAR * 2)) % CHORDS.length;
const chordAt = (t) => CHORDS[chordIdx(t)];

// Arrangement (timeline.js) : charleston, puis grosse caisse, clap et arpège ; respirations sans batterie.
const M = TL.music;
const DRUMS_IN = M.drumsIn;
const KICK_IN = M.kickIn;
const CLAP_IN = M.clapIn;
const ARP_IN = M.arpIn;
const END = M.end;
const inBreak = (t) => M.breaks.some(([a, b]) => t >= a && t < b);
const kickOn = (t) => t >= KICK_IN && t < END && !inBreak(t);

// Pompe de sidechain sur chaque temps où joue la grosse caisse.
function pump(t) {
    if (!kickOn(t)) return 1;
    const since = t % SPB;
    return 1 - 0.55 * Math.exp(-since / 0.11);
}

// Nappe
function pad() {
    const lp = [new Biquad(), new Biquad()];
    const phases = new Float64Array(4 * 3 * 2);
    const det = [-0.11, 0, 0.12];
    for (let i = 0; i < N; i++) {
        const t = i / SR;
        if (i % 64 === 0) {
            const f = 900 + 500 * Math.sin((t / TL.DUR) * TAU) + 300 * Math.min(1, t / 3);
            lp.forEach((b) => b.set("lp", f, 0.8));
        }
        const fadeIn = Math.min(1, Math.max(0, (t - 0.6) / 2.2));
        const fadeOut = t > TL.DUR - 2 ? Math.max(0, 1 - (t - (TL.DUR - 2)) / 2) : 1;
        // Fondu enchaîné sur les changements d'accord.
        const ci = Math.floor(t / (BAR * 2));
        const prev = CHORDS[(ci - 1 + CHORDS.length) % CHORDS.length];
        const into = t - ci * BAR * 2;
        const xf = Math.min(1, into / 0.25);
        const chords = [[chordAt(t), xf]];
        if (xf < 1 && ci > 0) chords.push([prev, 1 - xf]);
        let l = 0;
        let r = 0;
        chords.forEach(([ch, g], slot) => {
            ch.forEach((m, ni) => {
                det.forEach((d, di) => {
                    const idx = (ni * 3 + di) * 2 + slot;
                    phases[idx] = (phases[idx] + (mtof(m) * (1 + d * 0.004)) / SR) % 1;
                    const saw = phases[idx] * 2 - 1;
                    const pan = (di - 1) * 0.6;
                    l += saw * g * (1 - pan) * 0.5;
                    r += saw * g * (1 + pan) * 0.5;
                });
            });
        });
        const g = 0.065 * fadeIn * fadeOut * pump(t);
        add(i, lp[0].run(l) * g, lp[1].run(r) * g, 0.6);
    }
}

// Basse
function bass() {
    let ph = 0;
    const lp = new Biquad();
    lp.set("lp", 380, 0.9);
    for (let i = 0; i < N; i++) {
        const t = i / SR;
        if (t < KICK_IN || t >= END + BAR * 0.5 || inBreak(t)) continue;
        const root = chordAt(t)[0] - 12;
        // Croches décalées : sur le temps et sur le « et » du 2e et 4e temps.
        const beatPos = (t / SPB) % 4;
        const hits = [0, 1.5, 2, 3.5];
        let env = 0;
        for (const h of hits) {
            const dt = (beatPos - h) * SPB;
            if (dt >= 0 && dt < 0.42) env = Math.max(env, Math.exp(-dt * 5) * Math.min(1, dt / 0.01));
        }
        ph = (ph + mtof(root) / SR) % 1;
        const s = Math.tanh(Math.sin(ph * TAU) * 1.8 + 0.3 * Math.sin(ph * TAU * 2));
        const v = lp.run(s) * env * 0.24 * pump(t);
        add(i, v, v, 0);
    }
}

// Batterie
function kick(t0, gain = 1) {
    const i0 = Math.floor(t0 * SR);
    let ph = 0;
    for (let j = 0; j < SR * 0.45; j++) {
        const t = j / SR;
        const f = 48 + 90 * Math.exp(-t * 32);
        ph += f / SR;
        const v = Math.sin(ph * TAU) * Math.exp(-t * 7) * 0.3 * gain + rand() * Math.exp(-t * 300) * 0.03 * gain;
        add(i0 + j, v, v, 0.02);
    }
}

function hat(t0, gain = 1, pan = 0.25) {
    const i0 = Math.floor(t0 * SR);
    const hp = new Biquad();
    hp.set("hp", 7500, 0.7);
    for (let j = 0; j < SR * 0.08; j++) {
        const v = hp.run(rand()) * Math.exp(-(j / SR) * 55) * 0.05 * gain;
        add(i0 + j, v * (1 - pan), v * (1 + pan), 0.1);
    }
}

function clap(t0, gain = 1) {
    const i0 = Math.floor(t0 * SR);
    const bp = new Biquad();
    bp.set("bp", 1500, 1.2);
    for (let j = 0; j < SR * 0.25; j++) {
        const t = j / SR;
        // Trois micro-impacts rapprochés, puis la queue.
        const burst = [0, 0.011, 0.022].reduce((a, o) => a + (t >= o ? Math.exp(-(t - o) * 180) : 0), 0);
        const env = burst * 0.6 + Math.exp(-t * 18) * 0.5;
        const v = bp.run(rand()) * env * 0.055 * gain;
        add(i0 + j, v, v, 0.35);
    }
}

function drums() {
    for (let b = 0; b < TL.BEATS; b++) {
        const t = b * SPB;
        if (t < DRUMS_IN || t >= END) continue;
        const soft = inBreak(t) ? 0.5 : 1;
        if (kickOn(t)) kick(t, 0.85);
        hat(t + SPB / 2, 0.9 * soft, b % 2 ? 0.3 : -0.3);
        if (t >= CLAP_IN && kickOn(t) && b % 2 === 1) clap(t, 0.8);
        // Charleston fantôme en double-croche, très discret.
        hat(t + SPB * 0.75, 0.3 * soft, 0.5);
    }
}

// Arpège pincé avec écho
function arp() {
    const step = SPB / 2;
    const pattern = [0, 2, 1, 3, 2, 1, 3, 2];
    for (let k = 0; ; k++) {
        const t0 = ARP_IN + k * step;
        if (t0 >= END) break;
        const ch = chordAt(t0);
        const m = ch[pattern[k % pattern.length]] + 12;
        const f = mtof(m);
        const pan = k % 2 ? 0.4 : -0.4;
        // Note + deux répétitions en écho (croche pointée).
        [
            [0, 1],
            [SPB * 0.75, 0.35],
            [SPB * 1.5, 0.15],
        ].forEach(([d, g], e) => {
            const i0 = Math.floor((t0 + d) * SR);
            const p = e % 2 ? -pan : pan;
            for (let j = 0; j < SR * 0.35; j++) {
                const t = j / SR;
                const s = Math.sin(TAU * f * t) * 0.7 + Math.sin(TAU * f * 2 * t) * 0.3 * Math.exp(-t * 20);
                const v = s * Math.exp(-t * 9) * Math.min(1, t / 0.004) * 0.13 * g;
                add(i0 + j, v * (1 - p), v * (1 + p), 0.45);
            }
        });
    }
}

// Effets sonores
const SFX = {
    riser(t0, g) {
        const i0 = Math.floor(t0 * SR);
        const n = SR * 0.6;
        const bp = new Biquad();
        let ph = 0;
        for (let j = 0; j < n; j++) {
            const x = j / n;
            if (j % 32 === 0) bp.set("bp", 400 + 5000 * x * x, 2);
            ph += (200 + 900 * x * x) / SR;
            const v = (bp.run(rand()) * 0.5 + Math.sin(ph * TAU) * 0.15) * x * x * 0.35 * g;
            add(i0 + j, v, v, 0.5);
        }
    },
    impact(t0, g) {
        const i0 = Math.floor(t0 * SR);
        let ph = 0;
        const lp = new Biquad();
        for (let j = 0; j < SR * 2.2; j++) {
            const t = j / SR;
            if (j % 32 === 0) lp.set("lp", 200 + 6000 * Math.exp(-t * 6), 0.7);
            ph += (34 + 60 * Math.exp(-t * 10)) / SR;
            const sub = Math.sin(ph * TAU) * Math.exp(-t * 1.8) * 0.38;
            const nz = lp.run(rand()) * Math.exp(-t * 4) * 0.35;
            const v = (sub + nz) * g;
            add(i0 + j, v, v, 0.4);
        }
    },
    whoosh(t0, g, dur = 0.7, up = true) {
        const i0 = Math.floor(t0 * SR);
        const n = Math.floor(SR * dur);
        const bp = [new Biquad(), new Biquad()];
        for (let j = 0; j < n; j++) {
            const x = j / n;
            if (j % 32 === 0) {
                const f = up ? 300 + 3500 * x : 3800 - 3400 * x;
                bp[0].set("bp", f, 1.4);
                bp[1].set("bp", f * 1.08, 1.4);
            }
            const env = Math.sin(Math.PI * x) ** 2 * 0.3 * g;
            const pan = (x - 0.5) * 1.2;
            add(i0 + j, bp[0].run(rand()) * env * (1 - pan), bp[1].run(rand()) * env * (1 + pan), 0.3);
        }
    },
    swoosh(t0, g) {
        SFX.whoosh(t0 - 0.35, g * 0.8, 0.8, true);
    },
    drop(t0, g) {
        SFX.whoosh(t0, g, 1.4, false);
        SFX.impact(t0 + 1.2, g * 0.35);
    },
    click(t0, g) {
        const i0 = Math.floor(t0 * SR);
        for (let j = 0; j < SR * 0.05; j++) {
            const t = j / SR;
            const v = (Math.sin(TAU * 2600 * t) * 0.6 + rand() * 0.4) * Math.exp(-t * 160) * 0.18 * g;
            add(i0 + j, v, v, 0.15);
        }
    },
    tick(t0, g) {
        const i0 = Math.floor(t0 * SR);
        for (let j = 0; j < SR * 0.12; j++) {
            const t = j / SR;
            const v = Math.sin(TAU * 1760 * t) * Math.exp(-t * 35) * 0.12 * g;
            add(i0 + j, v * 0.8, v, 0.4);
        }
    },
    pop(t0, g) {
        const i0 = Math.floor(t0 * SR);
        let ph = 0;
        for (let j = 0; j < SR * 0.12; j++) {
            const t = j / SR;
            ph += (380 + 700 * Math.exp(-t * 45)) / SR;
            const v = Math.sin(ph * TAU) * Math.exp(-t * 28) * 0.22 * g;
            add(i0 + j, v, v, 0.3);
        }
    },
    chime(t0, notes, g, gap) {
        notes.forEach((m, k) => {
            const i0 = Math.floor((t0 + k * gap) * SR);
            const f = mtof(m);
            for (let j = 0; j < SR * 1.2; j++) {
                const t = j / SR;
                const s = Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * f * 3 * t) * Math.exp(-t * 8);
                const v = s * Math.exp(-t * 3.2) * Math.min(1, t / 0.003) * 0.08 * g;
                add(i0 + j, v, v, 0.6);
            }
        });
    },
    success(t0, g) {
        SFX.chime(t0, [76, 83, 88], g, 0.08);
    },
    shimmer(t0, g) {
        SFX.chime(t0, [88, 91, 93, 95], g * 0.6, 0.06);
    },
};

// Réverbération (Freeverb simplifiée : 8 filtres en peigne + 4 passe-tout par canal)
function reverb(input, spread) {
    const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => d + spread);
    const aps = [556, 441, 341, 225].map((d) => d + spread);
    const out = new Float32Array(N);
    const fb = 0.84;
    const damp = 0.3;
    const cb = combs.map((d) => ({ buf: new Float32Array(d), i: 0, f: 0 }));
    const ab = aps.map((d) => ({ buf: new Float32Array(d), i: 0 }));
    for (let n = 0; n < N; n++) {
        const x = input[n] * 0.015;
        let y = 0;
        for (const c of cb) {
            const o = c.buf[c.i];
            c.f = o * (1 - damp) + c.f * damp;
            c.buf[c.i] = x + c.f * fb;
            c.i = (c.i + 1) % c.buf.length;
            y += o;
        }
        for (const a of ab) {
            const o = a.buf[a.i];
            a.buf[a.i] = y + o * 0.5;
            a.i = (a.i + 1) % a.buf.length;
            y = o - y;
        }
        out[n] = y;
    }
    return out;
}

// Rendu
const STEM = process.env.STEM;
const on = (k) => !STEM || STEM === k;
console.log("nappe, basse, batterie, arpège, effets...");
if (on("pad")) pad();
if (on("bass")) bass();
if (on("drums")) drums();
if (on("arp")) arp();
if (on("sfx")) for (const [t, name, g] of TL.cues) SFX[name](t, g);
console.log("réverbération...");
const wl = reverb(RvL, 0);
const wr = reverb(RvR, 23);

// Mixage, saturation douce, normalisation à -1 dBFS.
let peak = 0;
const mixL = new Float32Array(N);
const mixR = new Float32Array(N);
for (let i = 0; i < N; i++) {
    mixL[i] = Math.tanh((L[i] + wl[i] * 0.9) * 1.1);
    mixR[i] = Math.tanh((R[i] + wr[i] * 0.9) * 1.1);
    peak = Math.max(peak, Math.abs(mixL[i]), Math.abs(mixR[i]));
}
const norm = process.env.STEM ? 1 : Math.pow(10, -1 / 20) / (peak || 1);

const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, mixL[i] * norm)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, mixR[i] * norm)) * 32767), 46 + i * 4);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`musique -> ${OUT} (${TL.DUR} s, crête normalisée à -1 dBFS)`);
