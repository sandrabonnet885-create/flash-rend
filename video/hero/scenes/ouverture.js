// Ouverture (0 -> 3,75 s) : l'éclair du logo frappe, onde de choc, puis traverse la caméra.
// Dessiné par-dessus la composition ; la fenêtre et le premier carton sont gérés par main.js.
SC.ouverture = (c, lt) => {
    if (lt > 1.35) return;
    const cx = W / 2;
    const cy = H / 2 - 30;
    const S = 430; // hauteur de l'éclair
    const STRIKE = 0.42;

    // Halo de fond qui monte avant l'impact.
    const pre = anim(lt, 0, STRIKE, E.inCubic);
    if (lt < 1.2) {
        const g = c.createRadialGradient(cx, cy, 0, cx, cy, 700);
        g.addColorStop(0, `rgba(253,215,0,${0.16 * pre * (1 - anim(lt, 0.9, 0.3))})`);
        g.addColorStop(1, "rgba(253,215,0,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
    }

    // Échelle : traçage, impact surdimensionné puis retour, et enfin traversée de la caméra.
    let s = 1;
    if (lt >= STRIKE) s = lerp(1.38, 1, anim(lt, STRIKE, 0.42, E.outBack));
    const through = anim(lt, 0.9, 0.38, E.inExpo);
    s *= 1 + through * 9;
    const alpha = 1 - anim(lt, 1.06, 0.24, E.inCubic);

    c.save();
    c.globalAlpha = alpha;
    c.translate(cx, cy);
    c.scale(s, s);
    c.translate(-cx, -cy);

    if (lt < STRIKE + 0.02) {
        // Traçage du contour : le trait parcourt l'éclair.
        const p = anim(lt, 0.06, STRIKE - 0.06, E.inOutCubic);
        boltPath(c, cx, cy, S);
        c.setLineDash([2400 * p, 2400]);
        c.strokeStyle = P.bolt;
        c.lineWidth = 7;
        c.lineJoin = "round";
        c.shadowColor = "rgba(253,215,0,0.9)";
        c.shadowBlur = 28;
        c.stroke();
        c.setLineDash([]);
    } else {
        boltPath(c, cx, cy, S);
        c.shadowColor = "rgba(253,215,0,0.85)";
        c.shadowBlur = 60 * (1 - anim(lt, STRIKE, 0.6));
        c.fillStyle = P.bolt;
        c.fill();
        c.shadowColor = "transparent";
        // Reflet qui balaie l'éclair juste après l'impact.
        const sweep = anim(lt, STRIKE + 0.05, 0.45, E.inOutCubic);
        if (sweep > 0 && sweep < 1) {
            c.save();
            boltPath(c, cx, cy, S);
            c.clip();
            const sx = lerp(cx - S, cx + S, sweep);
            const g = c.createLinearGradient(sx - 90, 0, sx + 90, 0);
            g.addColorStop(0, "rgba(255,255,255,0)");
            g.addColorStop(0.5, "rgba(255,255,255,0.75)");
            g.addColorStop(1, "rgba(255,255,255,0)");
            c.fillStyle = g;
            c.fillRect(cx - S, cy - S, S * 2, S * 2);
            c.restore();
        }
    }
    c.restore();

    // Mot-symbole sous l'éclair, lettre par lettre.
    const wm = "FlashRend";
    const out = anim(lt, 0.84, 0.16, E.inCubic);
    if (lt > 0.5 && out < 1) {
        const size = 64;
        const total = measure(c, wm, size, 700, SANS, -1);
        let x = cx - total / 2;
        for (let i = 0; i < wm.length; i++) {
            const ch = wm[i];
            const w = measure(c, ch, size, 700, SANS, -1);
            const p = anim(lt, 0.5 + i * 0.025, 0.3, E.outBack);
            c.save();
            c.globalAlpha = clamp(p * 2) * (1 - out);
            text(c, ch, x, cy + 300 + (1 - p) * 40 - out * 30, {
                size,
                weight: 700,
                ls: -1,
                color: i >= 5 ? P.bolt : P.fg,
            });
            c.restore();
            x += w;
        }
    }

    // Impact : flash, ondes de choc et rayons.
    if (lt >= STRIKE) {
        const k = Math.exp(-(lt - STRIKE) * 7.5);
        const g = c.createRadialGradient(cx, cy, 0, cx, cy, 1150);
        g.addColorStop(0, `rgba(255,250,220,${0.8 * k})`);
        g.addColorStop(0.35, `rgba(253,215,0,${0.35 * k})`);
        g.addColorStop(1, "rgba(253,215,0,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        ring(c, cx, cy, anim(lt, STRIKE, 0.75, E.linear), 1150, P.bolt, 16);
        ring(c, cx, cy, anim(lt, STRIKE + 0.08, 0.8, E.linear), 900, P.fg, 5);
        burst(c, cx, cy, anim(lt, STRIKE, 0.55, E.linear), 18, 260, 340, P.bolt, 6, 7);
    }
};
