// Confiance (version 60 s, 48,75 -> 53,75 s) : quatre garanties, toutes présentes dans l'app.
// Connexion Clerk (Google, Apple, email), emails Resend, validation des retraits par un admin, chat Tidio.
const CF = TL.plan.confiance || { items: [0.5, 1.9, 2.25, 3.2], out: 4.65 };
const CF_L =
    FMT === "v" ? { x: 60, y: 790, w: 438, h: 190, gap: 24 } : { x: 878, y: 368, w: 450, h: 160, gap: 24 };

const CF_ITEMS = [
    ["lock", "Connexion sécurisée", "Google, Apple ou email"],
    ["mail", "Notifications", "Par email, à chaque étape"],
    ["shield", "Retraits vérifiés", "Validés par notre équipe"],
    ["chat", "Support réactif", "Par chat, depuis le site"],
];

SC.confiance = (c, lt) => {
    if (lt < 0 || lt > CF.out + 0.7) return;
    const out = anim(lt, CF.out, 0.6, E.inCubic);
    const L = CF_L;
    c.save();
    c.globalAlpha = 1 - out;
    c.translate(-out * 60, 0);
    if (FMT !== "v") {
        // Grille agrandie de 10 % autour de son centre.
        const gx = L.x + L.w + L.gap / 2;
        const gy = L.y + L.h + L.gap / 2;
        c.translate(gx, gy);
        c.scale(1.1, 1.1);
        c.translate(-gx, -gy);
    }
    CF_ITEMS.forEach(([ic, title, sub], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = L.x + col * (L.w + L.gap);
        const y = L.y + row * (L.h + L.gap);
        const t0 = CF.items[i];
        pop(c, anim(lt, t0, 0.6, E.outBack), x + L.w / 2, y + L.h / 2, () => {
            const lit = anim(lt, t0, 0.3) * (1 - anim(lt, t0 + 0.6, 0.6));
            if (lit > 0) {
                c.shadowColor = `rgba(234,179,8,${0.45 * lit})`;
                c.shadowBlur = 40;
            }
            cardBox(c, x, y, L.w, L.h, 20);
            c.shadowColor = "transparent";
            fillRR(c, x + 24, y + 26, 58, 58, 16, "rgba(234,179,8,0.15)");
            icon(c, ic, x + 53, y + 55, 30, P.y400, 2.2);
            const ty = FMT === "v" ? y + 126 : y + 110;
            const tx = x + 24;
            text(c, title, tx, ty, { size: FMT === "v" ? 32 : 29, weight: 700, ls: -0.5 });
            text(c, sub, tx, ty + 32, { size: FMT === "v" ? 21 : 19, color: P.fg2 });
            const cp = anim(lt, t0 + 0.25, 0.4, E.outBack);
            if (cp > 0) {
                const bx = x + L.w - 36;
                const by = y + 36;
                c.save();
                c.translate(bx, by);
                c.scale(cp, cp);
                c.fillStyle = "rgba(34,197,94,0.18)";
                c.beginPath();
                c.arc(0, 0, 16, 0, TAU);
                c.fill();
                c.restore();
                check(c, bx, by, 20, anim(lt, t0 + 0.35, 0.3), P.green, 3.2);
            }
        });
    });
    c.restore();
};
