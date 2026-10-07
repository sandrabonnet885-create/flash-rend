// Experts (12,5 -> 18,75 s) : schéma « votre capital -> nos experts -> marchés -> votre tableau de bord ».
// Hors de la fenêtre d'app (aucun écran de l'app ne montre la gestion) ; repère : canvas entier.
// Le service décrit doit être réel au moment de publier (voir VIDEO-HERO-SCRIPT.md, prérequis).

// En vertical : capital et marchés côte à côte en haut, experts au centre, suivi en bas.
const XP =
    FMT === "v"
        ? {
              A: { x: 300, y: 860, w: 300, h: 132 },
              B: { x: 540, y: 1130, w: 430, h: 270 },
              C: { x: 770, y: 860, w: 300, h: 132 },
              D: { x: 540, y: 1410, w: 560, h: 66 },
          }
        : {
              A: { x: 1080, y: 300, w: 300, h: 132 },
              B: { x: 1345, y: 548, w: 430, h: 270 },
              C: { x: 1610, y: 300, w: 300, h: 132 },
              D: { x: 1345, y: 828, w: 560, h: 66 },
          };

function qpt(p0, p1, p2, t) {
    const u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
}

// Liaison courbe tracée progressivement, puis parcourue par des impulsions lumineuses.
function link(c, p0, p1, p2, draw, lt, seed) {
    if (draw <= 0) return;
    const N = 48;
    c.save();
    c.lineCap = "round";
    c.strokeStyle = "rgba(255,255,255,0.14)";
    c.lineWidth = 3;
    c.setLineDash([2, 10]);
    c.beginPath();
    for (let i = 0; i <= N * draw; i++) {
        const [x, y] = qpt(p0, p1, p2, i / N);
        i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
    c.setLineDash([]);
    if (draw >= 1) {
        for (let k = 0; k < 3; k++) {
            const t = (lt * 0.42 + k / 3 + seed * 0.13) % 1;
            for (let j = 0; j < 10; j++) {
                const tt = t - j * 0.012;
                if (tt < 0) continue;
                const [x, y] = qpt(p0, p1, p2, tt);
                c.globalAlpha = (1 - j / 10) * 0.9;
                c.fillStyle = j ? P.y400 : P.y300;
                c.beginPath();
                c.arc(x, y, j ? 4.5 - j * 0.35 : 6, 0, TAU);
                c.fill();
            }
        }
    } else {
        // Tête du tracé.
        const [x, y] = qpt(p0, p1, p2, draw);
        c.fillStyle = P.y300;
        c.shadowColor = "rgba(253,224,71,0.9)";
        c.shadowBlur = 18;
        c.beginPath();
        c.arc(x, y, 6, 0, TAU);
        c.fill();
    }
    c.restore();
}

function xpCard(c, n, glow = 0) {
    const x = n.x - n.w / 2;
    const y = n.y - n.h / 2;
    if (glow > 0) {
        c.shadowColor = `rgba(234,179,8,${0.45 * glow})`;
        c.shadowBlur = 50;
    } else {
        c.shadowColor = "rgba(0,0,0,0.5)";
        c.shadowBlur = 40;
        c.shadowOffsetY = 16;
    }
    fillRR(c, x, y, n.w, n.h, 22, P.card);
    c.shadowColor = "transparent";
    c.shadowOffsetY = 0;
    strokeRR(c, x + 0.5, y + 0.5, n.w - 1, n.h - 1, 22, glow > 0 ? `rgba(250,204,21,${0.35 + 0.4 * glow})` : P.line2, glow > 0 ? 2 : 1.5);
    return { x, y };
}

// Minutage interne (secondes depuis le début de la scène) ; la version 60 s le cale sur la voix.
const XT = TL.plan.experts || { a: 0.5, l1: 0.9, b: 1.2, rows: [1.8, 2.3, 2.8], l2: 2.9, c: 3.0, l3: 3.9, d: 4.2, out: 5.55, end: 6.3 };

SC.experts = (c, lt) => {
    if (lt < 0 || lt > XT.end) return;
    const { A, B, C, D } = XP;
    const out = anim(lt, XT.out, 0.6, E.inCubic);
    c.save();
    c.globalAlpha = 1 - out;
    c.translate(-out * 80, 0);
    // Schéma agrandi de 20 % autour de la carte centrale.
    c.translate(XP.B.x + 8, XP.B.y);
    c.scale(1.2, 1.2);
    c.translate(-XP.B.x, -XP.B.y);

    // Liaisons
    link(c, [A.x, A.y + A.h / 2], [A.x, B.y - B.h / 2 - 10], [B.x - 110, B.y - B.h / 2], anim(lt, XT.l1, 0.7, E.inOutCubic), lt, 1);
    link(c, [B.x + 110, B.y - B.h / 2], [C.x, B.y - B.h / 2 - 10], [C.x, C.y + C.h / 2], anim(lt, XT.l2, 0.7, E.inOutCubic), lt, 2);
    link(c, [B.x, B.y + B.h / 2], [B.x, (B.y + B.h / 2 + D.y - D.h / 2) / 2], [B.x, D.y - D.h / 2], anim(lt, XT.l3, 0.5, E.inOutCubic), lt, 3);

    // A : votre capital
    pop(c, anim(lt, XT.a, 0.6, E.outBack), A.x, A.y, () => {
        const { x, y } = xpCard(c, A);
        fillRR(c, x + 22, y + 22, 48, 48, 14, "rgba(234,179,8,0.15)");
        icon(c, "wallet", x + 46, y + 46, 26, P.y400);
        text(c, "Votre capital", x + 84, y + 54, { size: 20, color: P.fg2 });
        const v = 500 * anim(lt, XT.a + 0.1, 0.9, E.outCubic);
        text(c, eur(v), x + 22, y + 112, { size: 38, weight: 700, family: MONO, ls: -2 });
    });

    // B : nos experts
    const glow = anim(lt, XT.b, 0.8) * (0.6 + 0.4 * Math.sin(lt * 2.4));
    pop(c, anim(lt, XT.b, 0.7, E.outBack), B.x, B.y, () => {
        const { x, y } = xpCard(c, B, glow);
        // Avatars de l'équipe.
        for (let i = 2; i >= 0; i--) {
            const p = anim(lt, XT.b + 0.15 + i * 0.1, 0.45, E.outBack);
            if (p <= 0) continue;
            const ax = x + 50 + i * 34;
            const ay = y + 56;
            c.save();
            c.translate(ax, ay);
            c.scale(p, p);
            c.beginPath();
            c.arc(0, 0, 25, 0, TAU);
            c.fillStyle = [P.y400, P.amber, P.orange][i];
            c.fill();
            c.lineWidth = 3;
            c.strokeStyle = P.card;
            c.stroke();
            c.save();
            c.beginPath();
            c.arc(0, 0, 23, 0, TAU);
            c.clip();
            icon(c, "user", 0, 4, 30, "rgba(9,9,11,0.85)");
            c.restore();
            c.restore();
        }
        text(c, "Nos experts", x + 166, y + 52, { size: 28, weight: 700, ls: -0.5 });
        text(c, "des marchés crypto", x + 166, y + 78, { size: 18, color: P.fg2 });

        c.fillStyle = P.line;
        c.fillRect(x + 24, y + 104, B.w - 48, 1);

        const rows = [
            ["search", "Analyse des marchés"],
            ["target", "Sélection des actifs"],
            ["sliders", "Ajustement des positions"],
        ];
        rows.forEach(([ic, label], i) => {
            const t0 = XT.rows[i];
            const p = anim(lt, t0, 0.5, E.outCubic);
            if (p <= 0) return;
            const ry = y + 140 + i * 44;
            c.save();
            c.globalAlpha *= p;
            c.translate((1 - p) * 24, 0);
            // Surbrillance qui passe sur la ligne active.
            const hl = anim(lt, t0, 0.25) * (1 - anim(lt, t0 + 0.5, 0.35));
            if (hl > 0) fillRR(c, x + 14, ry - 20, B.w - 28, 40, 10, `rgba(234,179,8,${0.12 * hl})`);
            icon(c, ic, x + 40, ry, 22, P.y400, 2.2);
            text(c, label, x + 66, ry + 7, { size: 20, weight: 500 });
            c.restore();
            const cp = anim(lt, t0 + 0.2, 0.35, E.outBack);
            if (cp > 0) {
                const cx = x + B.w - 40;
                c.save();
                c.translate(cx, ry);
                c.scale(cp, cp);
                c.fillStyle = "rgba(34,197,94,0.18)";
                c.beginPath();
                c.arc(0, 0, 14, 0, TAU);
                c.fill();
                c.restore();
                check(c, cx, ry, 18, anim(lt, t0 + 0.3, 0.3), P.green, 3);
            }
        });
    });

    // C : marchés
    pop(c, anim(lt, XT.c, 0.6, E.outBack), C.x, C.y, () => {
        const { x, y } = xpCard(c, C);
        text(c, "Marchés", x + 22, y + 40, { size: 20, color: P.fg2 });
        const coins = [
            [IMG.btc, "BTC"],
            [IMG.eth, "ETH"],
            [IMG.sol, "SOL"],
        ];
        coins.forEach(([im, l], i) => {
            const p = anim(lt, XT.c + 0.15 + i * 0.12, 0.5, E.outBack);
            if (p <= 0 || !im) return;
            const cx = x + 62 + i * 88;
            const cy = y + 78 + Math.sin(lt * 2 + i * 1.3) * 3;
            const s = 44 * p;
            c.drawImage(im, cx - s / 2, cy - s / 2, s, s);
            text(c, l, cx, y + 120, { size: 14, family: MONO, weight: 700, align: "center", color: P.fg2 });
        });
    });

    // D : retour vers le client
    pop(c, anim(lt, XT.d, 0.6, E.outBack), D.x, D.y, () => {
        const x = D.x - D.w / 2;
        const y = D.y - D.h / 2;
        fillRR(c, x, y, D.w, D.h, D.h / 2, "rgba(234,179,8,0.12)");
        strokeRR(c, x + 0.5, y + 0.5, D.w - 1, D.h - 1, D.h / 2, "rgba(250,204,21,0.45)", 1.5);
        icon(c, "chart", x + 40, D.y, 24, P.y400);
        text(c, "Suivi en temps réel depuis votre tableau de bord", x + 66, D.y + 7, { size: 19, weight: 500 });
    });

    c.restore();
};
