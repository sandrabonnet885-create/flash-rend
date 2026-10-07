// Dépôt (7,5 -> 12,5 s) : choix PayPal, saisie de 500 €, paiement, confirmation.
// Fidèle à src/app/account/deposit/page.tsx : la carte bancaire y est « Bientôt disponible ».
SC.depot = (c, lt) => {
    const X = SB + 40;
    const R = CW - 40;

    pop(c, anim(lt, 0.02, 0.45, E.outBack), X + 200, 80, () => {
        text(c, "Faire un dépôt", X, 78, { size: 42, weight: 700, ls: -1 });
        text(c, "Choisissez votre moyen de paiement", X, 112, { size: 20, color: P.fg2 });
    });

    // Moyens de paiement
    const methods = [
        { t: "Virement", i: "bank", col: P.blue, meta: "1-3 jours · min 100 €" },
        { t: "PayPal", i: "wallet", col: P.sky, meta: "Instantané · min 10 €" },
        { t: "Carte", i: "card", col: P.purple, meta: "Bientôt disponible", soon: true },
    ];
    const gap = 18;
    const tw = (R - X - gap * 2) / 3;
    const ty = 148;
    const th = 150;
    const SELECT = 0.85;
    methods.forEach((m, i) => {
        const tx = X + i * (tw + gap);
        const sel = i === 1 ? anim(lt, SELECT, 0.3, E.outBack) : 0;
        const pressK = i === 1 ? kick(lt, SELECT, 0.28) : 0;
        pop(c, anim(lt, 0.1 + i * 0.07, 0.5, E.outBack), tx + tw / 2, ty + th / 2, () => {
            c.save();
            c.translate(tx + tw / 2, ty + th / 2);
            const s = 1 - 0.04 * pressK + 0.02 * sel;
            c.scale(s, s);
            c.translate(-tx - tw / 2, -ty - th / 2);
            if (m.soon) c.globalAlpha *= 0.5;
            if (sel > 0) {
                c.shadowColor = `rgba(234,179,8,${0.5 * clamp(sel)})`;
                c.shadowBlur = 36;
            }
            cardBox(c, tx, ty, tw, th);
            c.shadowColor = "transparent";
            if (sel > 0) {
                c.globalAlpha *= clamp(sel);
                strokeRR(c, tx + 1, ty + 1, tw - 2, th - 2, 18, P.y400, 3);
                c.globalAlpha = 1;
            }
            fillRR(c, tx + 24, ty + 24, 52, 52, 14, m.col + "26");
            icon(c, m.i, tx + 50, ty + 50, 28, m.col);
            text(c, m.t, tx + 24, ty + 112, { size: 25, weight: 700 });
            text(c, m.meta, tx + 24, ty + 136, { size: 14, family: MONO, color: P.fg2 });
            if (m.soon) badge(c, tx + tw - 104, ty + 24, "Bientôt", P.fg2, P.muted, { size: 13 });
            if (sel > 0) {
                // Pastille cochée.
                const bx = tx + tw - 30;
                const by = ty + 30;
                c.save();
                c.translate(bx, by);
                c.scale(sel, sel);
                c.fillStyle = P.y400;
                c.beginPath();
                c.arc(0, 0, 15, 0, TAU);
                c.fill();
                c.restore();
                check(c, bx, by, 22, anim(lt, SELECT + 0.12, 0.25), P.bg, 3.5);
            }
            c.restore();
        });
    });
    ring(c, X + tw * 1.5 + gap, ty + th / 2, anim(lt, SELECT, 0.5, E.linear), 170, P.y400, 4);

    // Montant
    const ay = 334;
    pop(c, anim(lt, 1.0, 0.45, E.outBack), X + 280, ay + 50, () => {
        text(c, "Montant du dépôt", X, ay, { size: 19, color: P.fg2 });
        fillRR(c, X, ay + 16, 560, 88, 16, P.bg);
        strokeRR(c, X + 0.5, ay + 16.5, 559, 87, 16, lt > 1.2 && lt < 2.3 ? P.y400 : P.line2, 2);
        const typed = typeText(c, "500,00 €", X + 26, ay + 77, lt, 1.25, 0.075, {
            size: 50,
            weight: 700,
            family: MONO,
            ls: -2,
        });
        if (lt > 1.2 && lt < 2.3 && Math.floor(lt * 4) % 2 === 0) {
            const caretX = X + 26 + measure(c, "500,00 €".slice(0, clamp(Math.floor((lt - 1.25) / 0.075) + 1, 0, 8)), 50, 700, MONO);
            c.fillStyle = P.y400;
            c.fillRect(Math.min(caretX, typed.x) + 4, ay + 36, 3, 50);
        }
        text(c, "Min : 10 €", X + 580, ay + 70, { size: 17, family: MONO, color: P.fg3 });
    });

    // Paiement
    const PAY = 2.3;
    const prog = anim(lt, PAY + 0.05, 0.55, E.inOutCubic);
    pop(c, anim(lt, 1.15, 0.45, E.outBack), X + 280, 492, () => {
        button(c, X, 460, 560, 66, prog > 0 ? "Traitement..." : "Payer avec PayPal", {
            press: kick(lt, PAY, 0.28),
            glow: 0.5 + 0.5 * Math.sin(lt * 8),
            progress: prog < 1 ? prog : 0,
            size: 23,
        });
    });
    ring(c, X + 280, 493, anim(lt, PAY, 0.5, E.linear), 200, P.y400, 4);

    const pos = cursorPath(lt, [
        [0.2, CW - 80, CH + 40],
        [0.75, X + tw * 1.5 + gap + 20, ty + 92],
        [1.6, X + tw * 1.5 + gap + 20, ty + 92],
        [2.15, X + 330, 500],
    ]);
    const cursorOut = anim(lt, 2.75, 0.2);
    cursor(c, pos.x, pos.y, Math.max(kick(lt, SELECT, 0.25), kick(lt, PAY, 0.25)), anim(lt, 0.2, 0.2) * (1 - cursorOut));

    // Confirmation
    const OK = 2.95;
    if (lt < OK - 0.05) return;
    const dim = anim(lt, OK - 0.05, 0.25);
    c.fillStyle = `rgba(9,9,11,${0.78 * dim})`;
    c.fillRect(0, 0, CW, CH);

    const cx = (X + R) / 2;
    const cy = CH / 2 - 20;
    const cp = anim(lt, OK, 0.45, E.outBack);
    c.save();
    c.translate(cx, cy);
    c.scale(cp, cp);
    c.fillStyle = P.green;
    c.shadowColor = "rgba(34,197,94,0.6)";
    c.shadowBlur = 50;
    c.beginPath();
    c.arc(0, 0, 66, 0, TAU);
    c.fill();
    c.restore();
    check(c, cx, cy, 86, anim(lt, OK + 0.15, 0.35, E.outCubic), P.fg, 10);
    ring(c, cx, cy, anim(lt, OK, 0.7, E.linear), 260, P.green, 8);
    burst(c, cx, cy, anim(lt, OK + 0.05, 0.6, E.linear), 14, 90, 110, P.y400, 5, 3);

    pop(c, anim(lt, OK + 0.2, 0.45, E.outBack), cx, cy + 130, () => {
        text(c, "Dépôt confirmé", cx, cy + 130, { size: 36, weight: 700, align: "center", ls: -1 });
        const v = 500 * anim(lt, OK + 0.25, 0.6, E.outExpo);
        c.save();
        c.fillStyle = brandGradient(c, cx - 150, 0, cx + 150, 0);
        c.font = font(48, 700, MONO);
        c.textAlign = "center";
        c.letterSpacing = "-2px";
        c.fillText("+" + eur(v), cx, cy + 190);
        c.restore();
    });
};
