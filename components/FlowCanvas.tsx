"use client";

import { useEffect, useRef } from "react";

/**
 * The hero visual: an automation running.
 *
 * A trigger fires at the top, work fans out across parallel branches, each
 * step lights as the work reaches it, the branches converge and finish. It is
 * the shape of every workflow on the /work page, which is the point: the hero
 * shows the thing rather than describing it.
 *
 * Deliberately not another sphere. GlobeStack already owns that further down.
 */

type Node = { x: number; y: number; r: number; heat: number; glyph: 0 | 1 | 2 };

// normalised 0..1 layout. trigger, fan to three, process, converge, finish.
const NODES: [number, number, number, 0 | 1 | 2][] = [
  [0.5, 0.045, 1.25, 0],
  [0.5, 0.185, 1.0, 1],
  [0.19, 0.335, 0.92, 2],
  [0.5, 0.335, 0.92, 1],
  [0.81, 0.335, 0.92, 2],
  [0.19, 0.5, 0.92, 1],
  [0.5, 0.5, 0.92, 2],
  [0.81, 0.5, 0.92, 1],
  [0.33, 0.665, 1.0, 2],
  [0.67, 0.665, 1.0, 1],
  [0.5, 0.825, 1.1, 1],
  [0.5, 0.955, 1.3, 0],
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2], [1, 3], [1, 4],
  [2, 5], [3, 6], [4, 7],
  [5, 8], [6, 8], [6, 9], [7, 9],
  [8, 10], [9, 10],
  [10, 11],
];

type Pulse = { edge: number; t: number; speed: number };

export default function FlowCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1;
    const nodes: Node[] = NODES.map(([x, y, r, glyph]) => ({ x, y, r, heat: 0, glyph }));
    const out: number[][] = nodes.map(() => []);
    EDGES.forEach(([a], i) => out[a].push(i));

    let pulses: Pulse[] = [];
    let spawn = 0;
    let running = true;
    let raf = 0;

    const size = () => {
      const b = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(b.width));
      h = Math.max(1, Math.round(b.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // padding so node rings are never clipped at the edges
    const PX = 0.08, PY = 0.03;
    const px = (n: Node) => (PX + n.x * (1 - PX * 2)) * w;
    const py = (n: Node) => (PY + n.y * (1 - PY * 2)) * h;

    // a slight S-bend on every edge so the graph reads as drawn, not plotted
    const curve = (i: number) => {
      const [a, b] = EDGES[i];
      const x1 = px(nodes[a]), y1 = py(nodes[a]);
      const x2 = px(nodes[b]), y2 = py(nodes[b]);
      const dy = (y2 - y1) * 0.45;
      return { x1, y1, x2, y2, c1x: x1, c1y: y1 + dy, c2x: x2, c2y: y2 - dy };
    };

    const at = (i: number, t: number) => {
      const c = curve(i);
      const u = 1 - t;
      const x = u * u * u * c.x1 + 3 * u * u * t * c.c1x + 3 * u * t * t * c.c2x + t * t * t * c.x2;
      const y = u * u * u * c.y1 + 3 * u * u * t * c.c1y + 3 * u * t * t * c.c2y + t * t * t * c.y2;
      return { x, y };
    };

    const unit = () => Math.min(w, h) * 0.028;

    const drawNode = (n: Node) => {
      const x = px(n), y = py(n);
      const s = unit() * n.r;
      const hot = n.heat;

      if (hot > 0.01) {
        ctx.beginPath();
        ctx.arc(x, y, s * (1.6 + (1 - hot) * 2.6), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(214,228,248,${0.5 * hot})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      ctx.beginPath();
      const rr = s * 0.52;
      ctx.roundRect(x - s, y - s, s * 2, s * 2, rr);
      ctx.fillStyle = "#0C121D";
      ctx.fill();
      if (hot > 0.01) {
        ctx.save();
        ctx.shadowColor = `rgba(170,200,250,${0.85 * hot})`;
        ctx.shadowBlur = s * 2.4 * hot;
        ctx.strokeStyle = `rgba(226,238,255,${0.9 * hot})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore();
      }
      ctx.strokeStyle = `rgba(164,184,214,${0.46 + hot * 0.5})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // a small mark so each step reads as a step
      ctx.strokeStyle = `rgba(206,222,246,${0.55 + hot * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (n.glyph === 0) {
        ctx.arc(x, y, s * 0.34, 0, Math.PI * 2);
      } else if (n.glyph === 1) {
        ctx.moveTo(x - s * 0.36, y - s * 0.16);
        ctx.lineTo(x + s * 0.36, y - s * 0.16);
        ctx.moveTo(x - s * 0.36, y + s * 0.18);
        ctx.lineTo(x + s * 0.1, y + s * 0.18);
      } else {
        ctx.moveTo(x - s * 0.3, y + s * 0.24);
        ctx.lineTo(x, y - s * 0.28);
        ctx.lineTo(x + s * 0.3, y + s * 0.24);
      }
      ctx.stroke();
    };

    const frame = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      const halo = ctx.createRadialGradient(w / 2, h * 0.5, 0, w / 2, h * 0.5, Math.max(w, h) * 0.52);
      halo.addColorStop(0, "rgba(96,128,186,0.13)");
      halo.addColorStop(1, "rgba(96,128,186,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // edges
      ctx.lineCap = "round";
      for (let i = 0; i < EDGES.length; i++) {
        const c = curve(i);
        ctx.beginPath();
        ctx.moveTo(c.x1, c.y1);
        ctx.bezierCurveTo(c.c1x, c.c1y, c.c2x, c.c2y, c.x2, c.y2);
        ctx.strokeStyle = "rgba(140,160,192,0.30)";
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      // pulse trails, drawn as short bright segments along the curve
      for (const p of pulses) {
        const steps = 9;
        for (let k = 0; k < steps; k++) {
          const t0 = Math.max(0, p.t - k * 0.016);
          const t1 = Math.max(0, p.t - (k + 1) * 0.016);
          if (t1 <= 0 && t0 <= 0) break;
          const a = at(p.edge, t0), b = at(p.edge, t1);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(230,240,255,${0.78 * (1 - k / steps)})`;
          ctx.lineWidth = 2.3 * (1 - k / steps) + 0.5;
          ctx.stroke();
        }
        const head = at(p.edge, p.t);
        ctx.save();
        ctx.shadowColor = "rgba(190,214,255,0.9)";
        ctx.shadowBlur = unit() * 2.2;
        ctx.beginPath();
        ctx.arc(head.x, head.y, unit() * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(246,249,255,1)";
        ctx.fill();
        ctx.restore();
      }

      for (const n of nodes) drawNode(n);

      // advance
      if (!reduced) {
        for (const n of nodes) n.heat = Math.max(0, n.heat - dt * 1.5);

        const next: Pulse[] = [];
        for (const p of pulses) {
          p.t += p.speed * dt;
          if (p.t < 1) { next.push(p); continue; }
          const target = EDGES[p.edge][1];
          nodes[target].heat = 1;
          const outs = out[target];
          if (outs.length) {
            const pick = outs[(Math.random() * outs.length) | 0];
            next.push({ edge: pick, t: 0, speed: 0.34 + Math.random() * 0.22 });
          }
        }
        pulses = next;

        spawn -= dt;
        if (spawn <= 0 && pulses.length < 7) {
          spawn = 0.85 + Math.random() * 0.7;
          nodes[0].heat = 1;
          pulses.push({ edge: 0, t: 0, speed: 0.34 + Math.random() * 0.22 });
        }
      }
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frame(dt);
      if (running && !reduced) raf = requestAnimationFrame(loop);
    };

    size();
    // seed a couple of pulses so it is mid-run on first paint
    nodes[0].heat = 0.6;
    pulses.push({ edge: 0, t: 0.5, speed: 0.4 });
    frame(0);
    if (!reduced) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => { size(); frame(0); });
    ro.observe(cv);

    // stop burning frames once the hero is scrolled past
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running && !reduced) {
          running = true; last = performance.now(); raf = requestAnimationFrame(loop);
        } else if (!e.isIntersecting) {
          running = false; cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(cv);

    return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return <canvas ref={ref} className="alt-flow" aria-hidden="true" />;
}
