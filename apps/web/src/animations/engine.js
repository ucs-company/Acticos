// Canvas scene engine. Each scene communicates one ingredient concept.
// Scenes are pure functions of time so they can render a single static frame for reduced-motion users.

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => t * t * (3 - 2 * t);
const rnd = (seed) => { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };

const COL = { cyan: '111,175,66', blue: '78,138,46', soft: '134,179,99', white: '255,255,255', violet: '156,203,120' };
const dot = (ctx, x, y, r, c, a = 1) => {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = `rgba(${c},${a})`; ctx.fill();
};
const bond = (ctx, a, b, max, c = COL.soft, alpha = 0.35) => {
  const d = Math.hypot(a.x - b.x, a.y - b.y);
  if (d < max) { ctx.strokeStyle = `rgba(${c},${alpha * (1 - d / max)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
};

// INGREDIENTS → FORMULATION → PERFORMANCE
function hero(w, h) {
  const r = rnd(7), N = w < 640 ? 46 : 84, cx = w * (w < 900 ? 0.5 : 0.68), cy = h * 0.5, R = Math.min(w, h) * (w < 900 ? 0.26 : 0.3);
  const ps = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * TAU * 3.7, rad = Math.sqrt(i / N) * R * 0.92;
    return {
      f: { x: r() * w, y: r() * h }, ph: r() * TAU, sp: 0.4 + r() * 0.6, size: 1.6 + r() * 2.6, c: i % 5 === 0 ? COL.cyan : i % 3 === 0 ? COL.soft : COL.blue,
      drop: { x: cx + Math.cos(a) * rad * 0.8, y: cy + Math.sin(a) * rad * 0.8 + R * 0.12 },
      wave: { x: cx - R * 1.3 + (i / N) * R * 2.6, y: cy + Math.sin((i / N) * TAU * 2) * R * 0.28 + ((i % 4) - 1.5) * R * 0.17 },
    };
  });
  const labels = ['Ingredients', 'Formulation', 'Performance'];
  return (ctx, t) => {
    const p = ((t / 15000) % 1) * 3, stage = Math.floor(p), f = p - stage, k = ease(clamp((f - 0.45) * 2.2));
    const from = ['f', 'drop', 'wave'][stage], to = ['drop', 'wave', 'f'][stage];
    const pts = ps.map((q) => {
      const dx = Math.sin(t / 1800 * q.sp + q.ph) * (stage === 0 || (stage === 2 && k > 0.5) ? 18 : 5);
      const dy = Math.cos(t / 2100 * q.sp + q.ph) * (stage === 0 || (stage === 2 && k > 0.5) ? 18 : 5);
      return { x: lerp(q[from].x, q[to].x, k) + dx, y: lerp(q[from].y, q[to].y, k) + dy, size: q.size, c: q.c };
    });
    if (stage === 1) { // droplet membrane
      const g = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.15);
      g.addColorStop(0, 'rgba(111,175,66,.14)'); g.addColorStop(1, 'rgba(78,138,46,0)');
      ctx.fillStyle = g; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(cx, cy + R * 0.1, R * 1.15, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) bond(ctx, pts[i], pts[j], stage === 0 ? 96 : 70);
    pts.forEach((q) => { dot(ctx, q.x, q.y, q.size * 3.2, q.c, 0.08); dot(ctx, q.x, q.y, q.size, q.c, 0.95); });
    const idx = k > 0.5 ? (stage + 1) % 3 : stage;
    ctx.font = '500 13px "DM Sans", sans-serif'; ctx.textAlign = 'right';
    labels.forEach((l, i) => { ctx.fillStyle = `rgba(255,255,255,${i === idx ? 0.95 : 0.3})`; ctx.fillText(l, w - 12, h - 18 - (2 - i) * 20); dot(ctx, w - 12 - ctx.measureText(l).width - 12, h - 22 - (2 - i) * 20, i === idx ? 3.5 : 2, COL.cyan, i === idx ? 1 : 0.3); });
  };
}

// Particles forming a protective shell around the formulation
function preservative(w, h) {
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.34, r = rnd(3);
  const shell = Array.from({ length: 36 }, (_, i) => ({ a: (i / 36) * TAU, ring: i % 2, o: r() }));
  const core = Array.from({ length: 22 }, () => ({ x: (r() - 0.5) * R * 1.2, y: (r() - 0.5) * R * 1.2, ph: r() * TAU }));
  return (ctx, t) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.2); g.addColorStop(0, 'rgba(78,138,46,.22)'); g.addColorStop(1, 'rgba(78,138,46,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const pts = shell.map((s) => { const rad = R * (s.ring ? 1 : 0.8), a = s.a + t / (s.ring ? 5200 : -7000); return { x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad }; });
    pts.forEach((p, i) => { bond(ctx, p, pts[(i + 1) % pts.length], R * 0.6, COL.cyan, 0.6); });
    pts.forEach((p) => { dot(ctx, p.x, p.y, 7, COL.cyan, 0.1); dot(ctx, p.x, p.y, 2.6, COL.cyan, 0.95); });
    core.forEach((c) => { const x = cx + c.x + Math.sin(t / 1500 + c.ph) * 5, y = cy + c.y + Math.cos(t / 1700 + c.ph) * 5; if (Math.hypot(x - cx, y - cy) < R * 0.72) dot(ctx, x, y, 2, COL.soft, 0.75); });
  };
}

// Molecules travelling through a formulation band
function active(w, h) {
  const r = rnd(11), N = 26;
  const ms = Array.from({ length: N }, (_, i) => ({ y: h * (0.2 + r() * 0.6), x0: r() * w, sp: 20 + r() * 40, amp: 6 + r() * 16, ph: r() * TAU, s: 2 + r() * 3, c: i % 3 ? COL.blue : COL.cyan }));
  return (ctx, t) => {
    const g = ctx.createLinearGradient(0, h * 0.25, 0, h * 0.75); g.addColorStop(0, 'rgba(111,175,66,0)'); g.addColorStop(0.5, 'rgba(111,175,66,.1)'); g.addColorStop(1, 'rgba(111,175,66,0)');
    ctx.fillStyle = g; ctx.fillRect(0, h * 0.25, w, h * 0.5);
    const pts = ms.map((m) => ({ x: (m.x0 + (t / 1000) * m.sp) % (w + 40) - 20, y: m.y + Math.sin(t / 900 + m.ph) * m.amp, s: m.s, c: m.c }));
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) bond(ctx, pts[i], pts[j], 74);
    pts.forEach((p) => { dot(ctx, p.x, p.y, p.s * 3, p.c, 0.1); dot(ctx, p.x, p.y, p.s, p.c, 0.95); });
  };
}

// Droplets spreading into a smooth texture
function emollient(w, h) {
  const r = rnd(5), D = Array.from({ length: 6 }, (_, i) => ({ x: w * (0.15 + r() * 0.7), y: h * (0.2 + r() * 0.6), off: i * 1100, life: 5200 }));
  return (ctx, t) => {
    ctx.lineWidth = 1;
    D.forEach((d) => {
      const k = ((t + d.off) % d.life) / d.life, rad = 4 + ease(k) * Math.min(w, h) * 0.34;
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, rad); g.addColorStop(0, `rgba(111,175,66,${0.3 * (1 - k)})`); g.addColorStop(1, 'rgba(111,175,66,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(d.x, d.y, rad * 1.35, rad * 0.8, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = `rgba(134,179,99,${0.6 * (1 - k)})`; ctx.beginPath(); ctx.ellipse(d.x, d.y, rad * 1.35, rad * 0.8, 0, 0, TAU); ctx.stroke();
      if (k < 0.18) dot(ctx, d.x, d.y - (0.18 - k) * 140, 6 * (1 - k * 3), COL.cyan, 0.95);
    });
  };
}

// Distinct ingredient particles converging into a blend
function blend(w, h) {
  const cx = w / 2, cy = h / 2, r = rnd(9), cols = [COL.cyan, COL.blue, COL.violet, COL.soft];
  const ps = Array.from({ length: 40 }, (_, i) => {
    const g = i % 4, ang = (g / 4) * TAU + Math.PI / 4, rad = Math.min(w, h) * 0.42, a2 = r() * TAU, r2 = r() * Math.min(w, h) * 0.13;
    return { g, c: cols[g], sx: cx + Math.cos(ang) * rad + (r() - 0.5) * 30, sy: cy + Math.sin(ang) * rad + (r() - 0.5) * 30, ex: cx + Math.cos(a2) * r2, ey: cy + Math.sin(a2) * r2, ph: r() * TAU, s: 2 + r() * 2.4 };
  });
  return (ctx, t) => {
    const k = ease(clamp((((t % 8000) / 8000) - 0.1) / 0.55)) * (1 - ease(clamp((((t % 8000) / 8000) - 0.88) / 0.12)));
    const pts = ps.map((p) => ({ x: lerp(p.sx, p.ex, k) + Math.sin(t / 700 + p.ph) * 4, y: lerp(p.sy, p.ey, k) + Math.cos(t / 800 + p.ph) * 4, c: p.c, s: p.s }));
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90); g.addColorStop(0, `rgba(111,175,66,${0.25 * k})`); g.addColorStop(1, 'rgba(111,175,66,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (k > 0.5) bond(ctx, pts[i], pts[j], 44, COL.white, 0.3 * k);
    pts.forEach((p) => { dot(ctx, p.x, p.y, p.s * 3, p.c, 0.1); dot(ctx, p.x, p.y, p.s, p.c, 0.95); });
  };
}

export const SCENES = { hero, preservative, active, emollient, blend };
export const STATIC_TIME = 4200; // frame used when reduced motion is requested
