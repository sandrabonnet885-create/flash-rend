// La réponse (version 60 s, 8,75 -> 13,75 s) : le logo FlashRend se pose, puis laisse place à l'app.
const RP = TL.plan.reponse || { logo: 0.65, out: 1.85 };
const RP_L = FMT === "v" ? { x: 540, y: 1040, s: 240, word: 110 } : { x: 1320, y: 470, s: 220, word: 84 };

SC.reponse = (c, lt) => {
    if (lt < 0 || lt > RP.out + 0.7) return;
    const { x, y, s, word } = RP_L;
    const p = anim(lt, RP.logo, 0.7, E.outBack);
    const out = anim(lt, RP.out, 0.55, E.inCubic);
    if (p <= 0) return;

    // Halo qui gonfle derrière le logo.
    const g = c.createRadialGradient(x, y, 0, x, y, s * 2.2);
    g.addColorStop(0, `rgba(253,215,0,${0.22 * p * (1 - out)})`);
    g.addColorStop(1, "rgba(253,215,0,0)");
    c.fillStyle = g;
    c.fillRect(x - s * 2.2, y - s * 2.2, s * 4.4, s * 4.4);
    ring(c, x, y, anim(lt, RP.logo, 0.8, E.linear), s * 1.6, P.bolt, 8);
    burst(c, x, y, anim(lt, RP.logo + 0.05, 0.6, E.linear), 14, s * 0.62, s * 0.5, P.bolt, 4, 21);

    c.save();
    c.globalAlpha = 1 - out;
    c.translate(x, y);
    const k = p * (1 - 0.3 * out);
    c.scale(k, k);
    c.translate(-x, -y);
    c.shadowColor = "rgba(253,215,0,0.5)";
    c.shadowBlur = 50;
    appLogo(c, x, y, s);
    c.shadowColor = "transparent";
    c.restore();

    // Mot-symbole.
    const wp = anim(lt, RP.logo + 0.2, 0.6, E.outCubic) * (1 - out);
    if (wp > 0) {
        c.save();
        c.globalAlpha = wp;
        const yy = y + s * 0.5 + word * 1.1 + (1 - wp) * 30;
        const wf = measure(c, "Flash", word, 700, SANS, -2);
        const wr = measure(c, "Rend", word, 700, SANS, -2);
        text(c, "Flash", x - (wf + wr) / 2, yy, { size: word, weight: 700, ls: -2 });
        text(c, "Rend", x - (wf + wr) / 2 + wf, yy, { size: word, weight: 700, ls: -2, color: P.bolt });
        c.restore();
    }
};
