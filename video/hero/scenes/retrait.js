// Retrait (23,75 -> 27,5 s) : IBAN enregistré, 200 €, demande envoyée.
// Fidèle au flux réel : la demande part, puis l'équipe la valide avant le virement SEPA.
SC.retrait = (c, lt) => {
    const X = SB + 40;
    const R = CW - 40;

    pop(c, anim(lt, 0.02, 0.45, E.outBack), X + 200, 80, () => {
        text(c, "Demander un retrait", X, 78, { size: 42, weight: 700, ls: -1 });
        text(c, "Détails du retrait", X, 112, { size: 20, color: P.fg2 });
    });

    // Compte bancaire enregistré
    const by = 146;
    const bw = 400;
    const bh = 176;
    pop(c, anim(lt, 0.08, 0.5, E.outBack), X + bw / 2, by + bh / 2, () => {
        c.save();
        rr(c, X, by, bw, bh, 20);
        const g = c.createLinearGradient(X, by, X + bw, by + bh);
        g.addColorStop(0, "#2a2a30");
        g.addColorStop(1, "#141417");
        c.fillStyle = g;
        c.fill();
        c.clip();
        // Reflet qui traverse la carte.
        const sx = lerp(X - 200, X + bw + 200, anim(lt, 0.35, 0.8, E.inOutCubic));
        const sg = c.createLinearGradient(sx - 80, 0, sx + 80, 0);
        sg.addColorStop(0, "rgba(255,255,255,0)");
        sg.addColorStop(0.5, "rgba(255,255,255,0.12)");
        sg.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = sg;
        c.fillRect(X, by, bw, bh);
        c.fillStyle = P.y400;
        c.fillRect(X, by, 6, bh);
        c.restore();
        strokeRR(c, X + 0.5, by + 0.5, bw - 1, bh - 1, 20, P.y400 + "88", 2);
        text(c, "COMPTE PRINCIPAL", X + 32, by + 44, { size: 14, family: MONO, weight: 700, color: P.fg2, ls: 2 });
        icon(c, "bank", X + bw - 44, by + 38, 26, P.fg2);
        text(c, "FR76 •••• •••• 4821", X + 32, by + 104, { size: 30, family: MONO, weight: 700, ls: -1 });
        text(c, "Camille", X + 32, by + 146, { size: 19, color: P.fg2 });
    });

    // Montant
    const ax = X + bw + 20;
    const aw = R - ax;
    pop(c, anim(lt, 0.15, 0.5, E.outBack), ax + aw / 2, by + 50, () => {
        text(c, "Montant", ax, by + 14, { size: 19, color: P.fg2 });
        fillRR(c, ax, by + 28, aw, 80, 16, P.bg);
        strokeRR(c, ax + 0.5, by + 28.5, aw - 1, 79, 16, lt < 1.0 ? P.y400 : P.line2, 2);
        typeText(c, "200,00 €", ax + 24, by + 86, lt, 0.35, 0.06, { size: 44, weight: 700, family: MONO, ls: -2 });
    });

    const CLICK = 1.2;
    pop(c, anim(lt, 0.25, 0.5, E.outBack), ax + aw / 2, by + 158, () => {
        button(c, ax, by + 126, aw, 66, "Confirmer le retrait", {
            press: kick(lt, CLICK, 0.28),
            glow: lt < CLICK ? 0.5 + 0.5 * Math.sin(lt * 8) : 0.2,
            size: 23,
        });
    });
    ring(c, ax + aw / 2, by + 159, anim(lt, CLICK, 0.5, E.linear), 200, P.y400, 4);

    const pos = cursorPath(lt, [
        [0.3, CW + 40, CH - 40],
        [0.95, ax + aw / 2 + 30, by + 166],
    ]);
    cursor(c, pos.x, pos.y, kick(lt, CLICK, 0.25), anim(lt, 0.3, 0.2) * (1 - anim(lt, 1.7, 0.2)));

    // Statut de la demande
    const sy = 360;
    const sh = CH - sy - 24;
    const SENT = 1.55;
    pop(c, anim(lt, CLICK + 0.15, 0.5, E.outBack), (X + R) / 2, sy + sh / 2, () => {
        cardBox(c, X, sy, R - X, sh);
        const cp = anim(lt, SENT, 0.35, E.outBack);
        c.save();
        c.translate(X + 52, sy + 52);
        c.scale(cp, cp);
        c.fillStyle = P.green;
        c.beginPath();
        c.arc(0, 0, 22, 0, TAU);
        c.fill();
        c.restore();
        check(c, X + 52, sy + 52, 30, anim(lt, SENT + 0.1, 0.3), P.fg, 4.5);
        ring(c, X + 52, sy + 52, anim(lt, SENT, 0.6, E.linear), 90, P.green, 5);
        text(c, "Votre demande de retrait a été envoyée !", X + 92, sy + 60, { size: 24, weight: 700, ls: -0.5 });

        // Étapes : envoyée ✓ -> validation en cours -> virement SEPA.
        const steps = ["Demande envoyée", "Validation", "Virement SEPA"];
        const sx0 = X + 60;
        const sx1 = R - 140;
        const lineY = sy + 130;
        const fill = anim(lt, SENT + 0.15, 0.6, E.outExpo) * 0.5;
        fillRR(c, sx0, lineY - 3, sx1 - sx0, 6, 3, P.muted);
        rr(c, sx0, lineY - 3, (sx1 - sx0) * fill, 6, 3);
        c.fillStyle = brandGradient(c, sx0, 0, sx1, 0);
        c.fill();
        steps.forEach((s, i) => {
            const x = lerp(sx0, sx1, i / 2);
            const on = anim(lt, SENT + 0.15 + i * 0.25, 0.35, E.outBack);
            c.save();
            c.translate(x, lineY);
            c.scale(0.6 + 0.4 * on, 0.6 + 0.4 * on);
            c.beginPath();
            c.arc(0, 0, 15, 0, TAU);
            c.fillStyle = i === 0 ? P.green : i === 1 ? P.amber : P.muted;
            c.fill();
            c.restore();
            if (i === 0) check(c, x, lineY, 20, on, P.fg, 3.5);
            if (i === 1 && on > 0.5) spinner(c, x, lineY, 7, lt, P.bg, 3);
            text(c, s, x, lineY + 44, {
                size: 17,
                weight: 700,
                align: "center",
                color: i === 2 ? P.fg3 : P.fg,
            });
            if (i === 1) text(c, "En cours", x, lineY + 68, { size: 14, family: MONO, align: "center", color: P.amber });
        });
    });
};
