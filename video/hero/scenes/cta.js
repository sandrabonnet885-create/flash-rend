// Appel à l'action (version 60 s, 53,75 -> 60 s) : logo, nom, bouton et adresse du site.
const CA = TL.plan.cta || { logo: 0.2, word: 0.4, button: 1.05, url: 2.0 };
const CA_L =
    FMT === "v"
        ? { x: 540, logoY: 620, logo: 200, wordY: 860, word: 120, btnY: 960, btnW: 600, btnH: 108, urlY: 1170, url: 40 }
        : { x: 960, logoY: 300, logo: 150, wordY: 500, word: 100, btnY: 570, btnW: 460, btnH: 88, urlY: 750, url: 42 };

SC.cta = (c, lt) => {
    if (lt < 0) return;
    const L = CA_L;

    // Halo central.
    const hp = anim(lt, CA.logo, 1.2, E.outCubic);
    const g = c.createRadialGradient(L.x, L.logoY, 0, L.x, L.logoY, 900);
    g.addColorStop(0, `rgba(253,215,0,${0.16 * hp})`);
    g.addColorStop(1, "rgba(253,215,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);

    // Logo.
    const lp = anim(lt, CA.logo, 0.7, E.outBack);
    if (lp > 0) {
        ring(c, L.x, L.logoY, anim(lt, CA.logo, 0.9, E.linear), L.logo * 1.8, P.bolt, 8);
        burst(c, L.x, L.logoY, anim(lt, CA.logo + 0.05, 0.6, E.linear), 14, L.logo * 0.62, L.logo * 0.5, P.bolt, 4, 33);
        c.save();
        c.translate(L.x, L.logoY);
        const k = lp * (1 + 0.02 * Math.sin(lt * 2.2));
        c.scale(k, k);
        c.translate(-L.x, -L.logoY);
        c.shadowColor = "rgba(253,215,0,0.5)";
        c.shadowBlur = 50;
        appLogo(c, L.x, L.logoY, L.logo);
        c.restore();
    }

    // Mot-symbole.
    const wp = anim(lt, CA.word, 0.6, E.outCubic);
    if (wp > 0) {
        c.save();
        c.globalAlpha = wp;
        const wf = measure(c, "Flash", L.word, 700, SANS, -3);
        const wr = measure(c, "Rend", L.word, 700, SANS, -3);
        const yy = L.wordY + (1 - wp) * 30;
        text(c, "Flash", L.x - (wf + wr) / 2, yy, { size: L.word, weight: 700, ls: -3 });
        text(c, "Rend", L.x - (wf + wr) / 2 + wf, yy, { size: L.word, weight: 700, ls: -3, color: P.bolt });
        c.restore();
    }

    // Bouton qui respire, avec un reflet périodique.
    const bp = anim(lt, CA.button, 0.6, E.outBack);
    pop(c, bp, L.x, L.btnY + L.btnH / 2, () => {
        const bx = L.x - L.btnW / 2;
        button(c, bx, L.btnY, L.btnW, L.btnH, "Créer mon compte", {
            glow: 0.55 + 0.45 * Math.sin(lt * 3),
            size: Math.round(L.btnH * 0.34),
        });
        const sw = ((lt - CA.button) % 2.2) / 0.8;
        if (sw > 0 && sw < 1) {
            c.save();
            rr(c, bx, L.btnY, L.btnW, L.btnH, 14);
            c.clip();
            const sx = lerp(bx - 120, bx + L.btnW + 120, E.inOutCubic(sw));
            const sg = c.createLinearGradient(sx - 70, 0, sx + 70, 0);
            sg.addColorStop(0, "rgba(255,255,255,0)");
            sg.addColorStop(0.5, "rgba(255,255,255,0.55)");
            sg.addColorStop(1, "rgba(255,255,255,0)");
            c.fillStyle = sg;
            c.fillRect(bx, L.btnY, L.btnW, L.btnH);
            c.restore();
        }
    });

    // Adresse du site.
    const up = anim(lt, CA.url, 0.6, E.outCubic);
    if (up > 0) {
        c.save();
        c.globalAlpha = up;
        const tw = measure(c, "flashrend.site", L.url, 700, MONO);
        const pw = tw + 64;
        const ph = L.url + 34;
        const yy = L.urlY + (1 - up) * 20;
        fillRR(c, L.x - pw / 2, yy - ph / 2, pw, ph, ph / 2, P.card);
        strokeRR(c, L.x - pw / 2 + 0.5, yy - ph / 2 + 0.5, pw - 1, ph - 1, ph / 2, "rgba(250,204,21,0.45)", 1.5);
        text(c, "flashrend.site", L.x, yy + 1, { size: L.url, weight: 700, family: MONO, align: "center", baseline: "middle" });
        c.restore();
    }
};
