// Constat (version 60 s, 3,75 -> 8,75 s) : les marchés tournent 24 h/24.
// Horloge qui ne s'arrête jamais + trois courbes qui défilent. Aucun cours chiffré.
const CT = TL.plan.constat || { clock: 0.25, cards: [0.45, 0.6, 0.75], out: 4.35 };

const CT_L =
    FMT === "v"
        ? { clock: { x: 540, y: 880, r: 140 }, cards: { x: 140, y: 1110, w: 800, h: 120, gap: 20 }, focus: { x: 540, y: 1100 } }
        : { clock: { x: 1050, y: 485, r: 150 }, cards: { x: 1290, y: 285, w: 500, h: 120, gap: 20 }, focus: { x: 1320, y: 485 } };

// Courbe pseudo-aléatoire continue, qui défile avec le temps.
function tickerY(u, lt, seed) {
    const s = seed * 1.7;
    return (
        Math.sin(u * 7 + lt * 2.1 + s) * 0.35 +
        Math.sin(u * 17 - lt * 3.3 + s * 2) * 0.2 +
        Math.sin(u * 41 + lt * 5.7 + s * 3) * 0.1 +
        Math.sin(u * 3 + lt * 0.8 + s) * 0.25
    );
}

SC.constat = (c, lt) => {
    if (lt < 0 || lt > 5.1) return;
    const out = anim(lt, CT.out, 0.65, E.inCubic);
    const { clock: K, cards: G, focus: F } = CT_L;

    c.save();
    c.globalAlpha = 1 - out;
    // Sortie : tout se resserre vers le centre, comme aspiré par le logo de la scène suivante.
    const k = (FMT === "v" ? 1 : 1.12) * (1 - 0.4 * out);
    c.translate(F.x, F.y);
    c.scale(k, k);
    c.translate(-F.x, -F.y);

    // Horloge 24 h.
    pop(c, anim(lt, CT.clock, 0.7, E.outBack), K.x, K.y, () => {
        c.save();
        c.beginPath();
        c.arc(K.x, K.y, K.r + 34, 0, TAU);
        c.fillStyle = P.card;
        c.fill();
        c.strokeStyle = P.line2;
        c.lineWidth = 1.5;
        c.stroke();
        // Graduations.
        for (let i = 0; i < 24; i++) {
            const a = (i / 24) * TAU - Math.PI / 2;
            const r0 = K.r - (i % 6 === 0 ? 18 : 10);
            c.strokeStyle = i % 6 === 0 ? P.fg2 : P.fg3;
            c.lineWidth = i % 6 === 0 ? 3 : 2;
            c.beginPath();
            c.moveTo(K.x + Math.cos(a) * r0, K.y + Math.sin(a) * r0);
            c.lineTo(K.x + Math.cos(a) * K.r, K.y + Math.sin(a) * K.r);
            c.stroke();
        }
        // Balayage lumineux qui tourne sans fin.
        const ang = lt * 1.4 * TAU - Math.PI / 2;
        const g = c.createConicGradient(ang - 2.2, K.x, K.y);
        g.addColorStop(0, "rgba(250,204,21,0)");
        g.addColorStop(0.35, "rgba(250,204,21,0.55)");
        g.addColorStop(0.351, "rgba(250,204,21,0)");
        c.strokeStyle = g;
        c.lineWidth = 14;
        c.beginPath();
        c.arc(K.x, K.y, K.r + 16, 0, TAU);
        c.stroke();
        c.fillStyle = P.y300;
        c.beginPath();
        c.arc(K.x + Math.cos(ang) * (K.r + 16), K.y + Math.sin(ang) * (K.r + 16), 8, 0, TAU);
        c.fill();
        c.restore();
        text(c, "24 h", K.x, K.y + 14, { size: 60, weight: 700, family: MONO, align: "center", ls: -2 });
        text(c, "7 j / 7", K.x, K.y + 52, { size: 22, weight: 700, family: MONO, align: "center", color: P.fg2 });
    });

    // Trois marchés en mouvement permanent.
    const coins = [
        [IMG.btc, "Bitcoin"],
        [IMG.eth, "Ethereum"],
        [IMG.sol, "Solana"],
    ];
    coins.forEach(([im, name], i) => {
        const y = G.y + i * (G.h + G.gap);
        const p = anim(lt, CT.cards[i], 0.6, E.outBack);
        if (p <= 0) return;
        c.save();
        c.globalAlpha *= clamp(p * 1.5);
        c.translate((1 - clamp(p)) * 120, 0);
        cardBox(c, G.x, y, G.w, G.h, 18);
        if (im) c.drawImage(im, G.x + 22, y + G.h / 2 - 24, 48, 48);
        text(c, name, G.x + 86, y + 50, { size: 22, weight: 700 });
        badge(c, G.x + 86, y + 66, "EN DIRECT", P.green, "rgba(34,197,94,0.14)", {
            dot: true,
            pulse: (lt * 1.3 + i * 0.3) % 1,
            size: 12,
        });
        // Courbe qui défile, sans échelle ni valeur.
        const x0 = G.x + G.w * (FMT === "v" ? 0.42 : 0.5);
        const x1 = G.x + G.w - 22;
        const yc = y + G.h / 2;
        const amp = G.h * 0.28;
        c.save();
        c.beginPath();
        for (let k = 0; k <= 60; k++) {
            const u = k / 60;
            const px = lerp(x0, x1, u);
            const py = yc - tickerY(u, lt, i) * amp;
            k ? c.lineTo(px, py) : c.moveTo(px, py);
        }
        c.strokeStyle = brandGradient(c, x0, 0, x1, 0);
        c.lineWidth = 3.5;
        c.lineJoin = "round";
        c.stroke();
        const hy = yc - tickerY(1, lt, i) * amp;
        c.fillStyle = P.y300;
        c.beginPath();
        c.arc(x1, hy, 5.5, 0, TAU);
        c.fill();
        c.restore();
        c.restore();
    });

    c.restore();
};
