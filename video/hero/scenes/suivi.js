// Suivi (18,75 -> 23,75 s) : solde qui défile, courbe du portefeuille tracée en direct, survol au curseur.
// Données fictives et réalistes : la courbe monte ET redescend, aucun pourcentage de gain affiché.

// Série de démo : 500 € -> 512,40 €, avec creux et rebonds.
const SUIVI_DATA = (() => {
    const R = rng(42);
    const n = 64;
    const raw = [];
    let v = 0;
    let m = 0;
    for (let i = 0; i < n; i++) {
        m = m * 0.78 + (R() - 0.47) * 1.6;
        v += m;
        raw.push(v);
    }
    // Recale les extrémités sur 500 et 512,40 en conservant les variations.
    const a = raw[0];
    const b = raw[n - 1];
    return raw.map((x, i) => 500 + (x - a - ((b - a) * i) / (n - 1)) * 1.1 + (12.4 * i) / (n - 1));
})();

SC.suivi = (c, lt) => {
    const X = SB + 40;
    const R = CW - 40;

    // Lente poussée de caméra pendant toute la scène.
    const push = 1 + 0.045 * anim(lt, 0.2, 4.8, E.inOutCubic);
    // Coup de caméra : plongée sur la courbe pendant le survol, puis retour.
    const zoom = anim(lt, 2.3, 0.6, E.inOutExpo) - anim(lt, 4.25, 0.55, E.inOutExpo);
    const fx = (X + R) / 2;
    const fy = lerp(CH * 0.62, 314 + (CH - 334) / 2, zoom); // point visé : centre de la courbe
    const s = push * (1 + 0.18 * zoom);
    c.save();
    c.translate(fx, lerp(CH * 0.62, CH * 0.55, zoom));
    c.scale(s, s);
    c.translate(-fx, -fy);

    pop(c, anim(lt, 0.02, 0.45, E.outBack), X + 200, 80, () => {
        text(c, "Vue d'ensemble", X, 78, { size: 42, weight: 700, ls: -1 });
        text(c, "Votre portefeuille, mis à jour en continu", X, 112, { size: 20, color: P.fg2 });
    });
    pop(c, anim(lt, 0.25, 0.4, E.outBack), R - 70, 60, () => {
        badge(c, R - 152, 44, "EN DIRECT", P.green, "rgba(34,197,94,0.14)", {
            dot: true,
            pulse: (lt * 1.4) % 1,
            size: 14,
        });
    });

    // Solde
    const cy0 = 144;
    const ch0 = 150;
    const w1 = 400;
    pop(c, anim(lt, 0.1, 0.5, E.outBack), X + w1 / 2, cy0 + ch0 / 2, () => {
        cardBox(c, X, cy0, w1, ch0);
        text(c, "Solde total", X + 28, cy0 + 44, { size: 19, color: P.fg2 });
        const v = 512.4 * anim(lt, 0.2, 1.3, E.outExpo);
        c.save();
        c.font = font(56, 700, MONO);
        c.letterSpacing = "-2px";
        c.fillStyle = P.fg;
        c.fillText(eur(v), X + 28, cy0 + 108);
        c.restore();
        text(c, "Mis à jour à l'instant", X + 28, cy0 + 134, { size: 14, family: MONO, color: P.fg3 });
    });

    // Investissement actif (session avec échéance, cf. modèle Investment)
    const x2 = X + w1 + 20;
    const w2 = R - x2;
    pop(c, anim(lt, 0.18, 0.5, E.outBack), x2 + w2 / 2, cy0 + ch0 / 2, () => {
        cardBox(c, x2, cy0, w2, ch0);
        text(c, "Investissement actif", x2 + 28, cy0 + 44, { size: 19, color: P.fg2 });
        const coins = [IMG.btc, IMG.eth, IMG.sol];
        coins.forEach((im, i) => {
            const p = anim(lt, 0.45 + i * 0.08, 0.4, E.outBack);
            if (p <= 0 || !im) return;
            const s = 44 * p;
            const ix = x2 + 28 + i * 34;
            c.save();
            c.beginPath();
            c.arc(ix + 22, cy0 + 88, 24, 0, TAU);
            c.fillStyle = P.card;
            c.fill();
            c.drawImage(im, ix + 22 - s / 2, cy0 + 88 - s / 2, s, s);
            c.restore();
        });
        text(c, "Session en cours", x2 + 160, cy0 + 95, { size: 18, weight: 700 });
        const bar = anim(lt, 0.6, 3.8, E.linear) * 0.62 + 0.18;
        fillRR(c, x2 + 28, cy0 + 120, w2 - 56, 10, 5, P.muted);
        rr(c, x2 + 28, cy0 + 120, (w2 - 56) * bar, 10, 5);
        c.fillStyle = brandGradient(c, x2 + 28, 0, x2 + w2 - 28, 0);
        c.fill();
    });

    // Courbe
    const gy = 314;
    const gh = CH - gy - 20;
    pop(c, anim(lt, 0.3, 0.55, E.outBack), (X + R) / 2, gy + gh / 2, () => {
        cardBox(c, X, gy, R - X, gh);
        text(c, "Évolution du portefeuille", X + 28, gy + 42, { size: 19, color: P.fg2 });
        ["1J", "1S", "1M"].forEach((l, i) => {
            const bx = R - 180 + i * 54;
            if (i === 0) fillRR(c, bx, gy + 20, 46, 32, 9, P.muted);
            text(c, l, bx + 23, gy + 42, { size: 15, family: MONO, weight: 700, align: "center", color: i ? P.fg3 : P.fg });
        });
    });

    const px0 = X + 92;
    const px1 = R - 30;
    const py0 = gy + 80;
    const py1 = gy + gh - 28;
    const lo = Math.min(...SUIVI_DATA) - 2;
    const hi = Math.max(...SUIVI_DATA) + 2;
    const n = SUIVI_DATA.length;
    const toX = (i) => lerp(px0, px1, i / (n - 1));
    const toY = (v) => lerp(py1, py0, (v - lo) / (hi - lo));
    const gridA = anim(lt, 0.5, 0.4);

    c.save();
    c.globalAlpha *= gridA;
    [0, 0.5, 1].forEach((k) => {
        const v = lerp(lo, hi, k);
        const y = toY(v);
        c.fillStyle = "rgba(255,255,255,0.06)";
        c.fillRect(px0, y, px1 - px0, 1);
        text(c, Math.round(v) + " €", X + 28, y + 5, { size: 14, family: MONO, color: P.fg3 });
    });
    c.restore();

    const draw = anim(lt, 0.6, 1.8, E.inOutCubic);
    if (draw > 0) {
        const last = draw * (n - 1);
        const k = Math.floor(last);
        const pts = [];
        for (let i = 0; i <= k; i++) pts.push([toX(i), toY(SUIVI_DATA[i])]);
        if (k < n - 1) {
            const f = last - k;
            pts.push([lerp(toX(k), toX(k + 1), f), toY(lerp(SUIVI_DATA[k], SUIVI_DATA[k + 1], f))]);
        }
        // Aire sous la courbe.
        const g = c.createLinearGradient(0, py0, 0, py1);
        g.addColorStop(0, "rgba(234,179,8,0.32)");
        g.addColorStop(1, "rgba(234,179,8,0)");
        c.beginPath();
        c.moveTo(pts[0][0], py1);
        pts.forEach(([x, y]) => c.lineTo(x, y));
        c.lineTo(pts[pts.length - 1][0], py1);
        c.closePath();
        c.fillStyle = g;
        c.fill();
        // Trait.
        c.beginPath();
        pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.strokeStyle = brandGradient(c, px0, 0, px1, 0);
        c.lineWidth = 4.5;
        c.lineJoin = "round";
        c.shadowColor = "rgba(234,179,8,0.6)";
        c.shadowBlur = 16;
        c.stroke();
        c.shadowColor = "transparent";
        // Tête de courbe lumineuse.
        const [hx, hy] = pts[pts.length - 1];
        c.fillStyle = P.y300;
        c.beginPath();
        c.arc(hx, hy, 7, 0, TAU);
        c.fill();
        ring(c, hx, hy, (lt * 1.3) % 1, 34, P.y300, 3);
    }

    // Survol : réticule + info-bulle qui suit la souris.
    const HOVER = 2.55;
    if (lt > HOVER) {
        const hp = anim(lt, HOVER + 0.35, 1.9, E.inOutCubic);
        const fi = lerp(0.3, 0.86, hp) * (n - 1);
        const i0 = Math.floor(fi);
        const v = lerp(SUIVI_DATA[i0], SUIVI_DATA[Math.min(i0 + 1, n - 1)], fi - i0);
        const hx = lerp(px0, px1, fi / (n - 1));
        const hy = toY(v);
        const a = anim(lt, HOVER + 0.3, 0.2) * (1 - anim(lt, 4.75, 0.2));
        c.save();
        c.globalAlpha *= a;
        c.setLineDash([6, 6]);
        c.strokeStyle = "rgba(255,255,255,0.35)";
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(hx, py0 - 10);
        c.lineTo(hx, py1);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = P.bg;
        c.strokeStyle = P.y300;
        c.lineWidth = 4;
        c.beginPath();
        c.arc(hx, hy, 9, 0, TAU);
        c.fill();
        c.stroke();
        const tw = 170;
        const tx = clamp(hx - tw / 2, px0 - 40, px1 - tw);
        fillRR(c, tx, py0 - 58, tw, 46, 12, P.muted);
        strokeRR(c, tx + 0.5, py0 - 57.5, tw - 1, 45, 12, P.line2);
        text(c, eur(v), tx + tw / 2, py0 - 28, { size: 20, family: MONO, weight: 700, align: "center" });
        c.restore();
        const cp = cursorPath(lt, [
            [HOVER, R + 60, CH + 30],
            [HOVER + 0.35, lerp(px0, px1, 0.3) + 14, py1 - 30],
            [HOVER + 2.25, lerp(px0, px1, 0.86) + 14, py1 - 30],
        ]);
        cursor(c, cp.x, cp.y, 0, anim(lt, HOVER, 0.2) * (1 - anim(lt, 4.75, 0.2)));
    }

    c.restore();
};
