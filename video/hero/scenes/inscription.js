// Inscription (3,75 -> 7,5 s) : clic « Continuer avec Google », puis arrivée sur le tableau de bord.
// Repère : coin haut-gauche de la zone de contenu de la fenêtre (CW × CH).
SC.inscription = (c, lt) => {
    const LOGIN_OUT = 1.9;
    const outP = anim(lt, LOGIN_OUT, 0.35, E.inBack);

    // Écran de connexion (src/app/(auth)/login)
    if (outP < 1) {
        const cw = 470;
        const chh = 500;
        const x = (CW - cw) / 2;
        const y = (CH - chh) / 2;
        c.save();
        c.globalAlpha = 1 - outP;
        c.translate(CW / 2, CH / 2);
        c.scale(1 - 0.12 * outP, 1 - 0.12 * outP);
        c.translate(-CW / 2, -CH / 2);

        cardBox(c, x, y, cw, chh, 22);
        appLogo(c, CW / 2, y + 70, 64);
        text(c, "Connexion", CW / 2, y + 150, { size: 38, weight: 700, align: "center", ls: -1 });
        text(c, "Accédez à votre espace FlashRend", CW / 2, y + 186, {
            size: 19,
            color: P.fg2,
            align: "center",
        });

        const bx = x + 40;
        const bw = cw - 80;
        const press = kick(lt, 1.1, 0.3);
        const loading = lt > 1.15;
        button(c, bx, y + 222, bw, 60, loading ? "Connexion..." : "Continuer avec Google", {
            variant: "white",
            press,
            size: 21,
            iconW: loading ? 0 : 34,
            drawIcon: loading
                ? null
                : (cc, ix, iy) => googleG(cc, ix - 6, iy, 12),
        });
        if (loading) spinner(c, bx + bw / 2 - 110, y + 252, 11, lt, P.bg, 3.5);
        ring(c, bx + bw / 2, y + 252, anim(lt, 1.1, 0.55, E.linear), 190, P.y400, 5);

        button(c, bx, y + 296, bw, 60, "Continuer avec Apple", {
            variant: "outline",
            size: 21,
            iconW: 30,
            drawIcon: (cc, ix, iy) => icon(cc, "apple", ix - 4, iy - 2, 24, P.fg),
        });

        c.fillStyle = P.line;
        c.fillRect(bx, y + 392, bw / 2 - 26, 1);
        c.fillRect(bx + bw / 2 + 26, y + 392, bw / 2 - 26, 1);
        text(c, "ou", CW / 2, y + 398, { size: 17, color: P.fg3, align: "center" });

        fillRR(c, bx, y + 420, bw, 56, 12, P.bg);
        strokeRR(c, bx + 0.5, y + 420.5, bw - 1, 55, 12, P.line2);
        text(c, "vous@exemple.fr", bx + 20, y + 455, { size: 19, color: P.fg3, family: MONO });

        c.restore();

        // Curseur : entre par le bas, clique sur Google.
        const target = { x: CW / 2 + 40, y: y + 258 };
        const pos = cursorPath(lt, [
            [0.15, CW - 60, CH + 40],
            [0.95, target.x, target.y],
        ]);
        cursor(c, pos.x, pos.y, kick(lt, 1.1, 0.25), anim(lt, 0.15, 0.2) * (1 - outP));
    }

    // Tableau de bord vide (src/app/account/page.tsx)
    const d0 = LOGIN_OUT + 0.15;
    if (lt < d0) return;
    const X = SB + 40;
    const R = CW - 40;

    pop(c, anim(lt, d0, 0.45, E.outBack), X + 200, 80, () => {
        text(c, "Bonjour Camille", X, 78, { size: 42, weight: 700, ls: -1 });
        text(c, "Votre compte est prêt.", X, 112, { size: 20, color: P.fg2 });
    });

    const colW = (R - X - 20) / 2;
    pop(c, anim(lt, d0 + 0.08, 0.5, E.outBack), X + colW / 2, 230, () => {
        cardBox(c, X, 150, colW, 170);
        text(c, "Solde total", X + 28, 198, { size: 19, color: P.fg2 });
        text(c, eur(0), X + 28, 268, { size: 54, weight: 700, family: MONO, ls: -2 });
    });
    pop(c, anim(lt, d0 + 0.14, 0.5, E.outBack), X + colW * 1.5 + 20, 230, () => {
        cardBox(c, X + colW + 20, 150, colW, 170);
        text(c, "Activité récente", X + colW + 48, 198, { size: 19, color: P.fg2 });
        text(c, "Aucune activité pour le moment", X + colW + 48, 262, { size: 19, color: P.fg3 });
    });

    // Appel à l'action qui respire, en attendant le dépôt.
    const glow = 0.5 + 0.5 * Math.sin((lt - d0) * 7);
    pop(c, anim(lt, d0 + 0.22, 0.5, E.outBack), X + 140, 384, () => {
        button(c, X, 352, 280, 64, "Faire un dépôt", { glow: 0.4 + 0.6 * glow, size: 22 });
    });

    // Squelettes de chargement pour remplir l'espace.
    pop(c, anim(lt, d0 + 0.3, 0.5), (X + R) / 2, 500, () => {
        cardBox(c, X, 448, R - X, 120);
        const sh = ((lt * 0.9) % 1) * (R - X + 400) - 200;
        for (let i = 0; i < 2; i++) {
            fillRR(c, X + 28, 480 + i * 44, (R - X) * (i ? 0.38 : 0.6), 18, 9, P.muted);
        }
        c.save();
        rr(c, X, 448, R - X, 120, 18);
        c.clip();
        const g = c.createLinearGradient(X + sh - 120, 0, X + sh + 120, 0);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.5, "rgba(255,255,255,0.06)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.fillRect(X, 448, R - X, 120);
        c.restore();
    });
};
