// Boucle (27,5 -> 30 s) : la fenêtre plonge (main.js), des traînées l'accompagnent,
// puis il ne reste que le fond : identique à l'image 0 pour un raccord invisible.
SC.boucle = (c, lt) => {
    const p = anim(lt, 0.05, 0.9, E.linear);
    if (p <= 0 || p >= 1) return;
    const R = rng(11);
    c.save();
    c.lineCap = "round";
    for (let i = 0; i < 9; i++) {
        const x = WIN.x + 60 + R() * (WIN.w - 120);
        const len = 160 + R() * 260;
        const d = E.inCubic(clamp(p * 1.3 - R() * 0.3));
        const y = lerp(WIN.y - 200, H + 400, d);
        const g = c.createLinearGradient(0, y - len, 0, y);
        g.addColorStop(0, "rgba(253,215,0,0)");
        g.addColorStop(1, i % 3 ? "rgba(253,215,0,0.55)" : "rgba(255,255,255,0.6)");
        c.strokeStyle = g;
        c.lineWidth = 2 + R() * 3;
        c.beginPath();
        c.moveTo(x, y - len);
        c.lineTo(x, y);
        c.stroke();
    }
    c.restore();
};
