"use client";

import { useEffect, useRef } from "react";

/**
 * The hero: one of my automations, running.
 *
 * A lead arrives, n8n qualifies it, work fans out across a voice agent, an
 * enrichment pass and an SMS follow-up, then converges and lands in the CRM.
 * Every step is labelled because the point is that it is a real workflow, not
 * an abstract graphic.
 *
 * Deliberately not another sphere. GlobeStack already owns that further down.
 */

type Kind = "trigger" | "filter" | "agent" | "data" | "msg" | "cal" | "loop" | "out";

const NODES: { x: number; y: number; label: string; kind: Kind }[] = [
  { x: 0.045, y: 0.5, label: "New lead", kind: "trigger" },
  { x: 0.215, y: 0.5, label: "n8n qualifies", kind: "filter" },
  { x: 0.44, y: 0.16, label: "AI voice call", kind: "agent" },
  { x: 0.44, y: 0.5, label: "Enrich + dedupe", kind: "data" },
  { x: 0.44, y: 0.84, label: "SMS follow-up", kind: "msg" },
  { x: 0.675, y: 0.3, label: "Books appointment", kind: "cal" },
  { x: 0.675, y: 0.7, label: "Retry cadence", kind: "loop" },
  { x: 0.9, y: 0.5, label: "CRM updated", kind: "out" },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2], [1, 3], [1, 4],
  [2, 5], [3, 5], [3, 6], [4, 6],
  [5, 7], [6, 7],
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
    const heat = NODES.map(() => 0);
    const out: number[][] = NODES.map(() => []);
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

    // inset so end nodes and their labels never clip
    const PX = 0.045, PY = 0.14;
    const px = (i: number) => (PX + NODES[i].x * (1 - PX * 2)) * w;
    const py = (i: number) => (PY + NODES[i].y * (1 - PY * 2)) * h;
    const unit = () => Math.max(13, Math.min(w * 0.021, h * 0.1));

    const curve = (e: number) => {
      const [a, b] = EDGES[e];
      const x1 = px(a), y1 = py(a), x2 = px(b), y2 = py(b);
      const dx = (x2 - x1) * 0.45;
      return { x1, y1, x2, y2, c1x: x1 + dx, c1y: y1, c2x: x2 - dx, c2y: y2 };
    };

    const at = (e: number, t: number) => {
      const c = curve(e);
      const u = 1 - t;
      return {
        x: u * u * u * c.x1 + 3 * u * u * t * c.c1x + 3 * u * t * t * c.c2x + t * t * t * c.x2,
        y: u * u * u * c.y1 + 3 * u * u * t * c.c1y + 3 * u * t * t * c.c2y + t * t * t * c.y2,
      };
    };

    const glyph = (kind: Kind, x: number, y: number, s: number, a: number) => {
      ctx.strokeStyle = `rgba(214,228,250,${a})`;
      ctx.fillStyle = `rgba(214,228,250,${a})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const q = s * 0.4;
      switch (kind) {
        case "trigger": // a bolt
          ctx.moveTo(x + q * 0.35, y - q); ctx.lineTo(x - q * 0.35, y + q * 0.1);
          ctx.lineTo(x + q * 0.1, y + q * 0.1); ctx.lineTo(x - q * 0.3, y + q);
          ctx.stroke(); return;
        case "filter": // funnel
          ctx.moveTo(x - q, y - q * 0.8); ctx.lineTo(x + q, y - q * 0.8);
          ctx.lineTo(x + q * 0.2, y + q * 0.1); ctx.lineTo(x + q * 0.2, y + q);
          ctx.lineTo(x - q * 0.2, y + q * 0.65); ctx.lineTo(x - q * 0.2, y + q * 0.1);
          ctx.closePath(); ctx.stroke(); return;
        case "agent": // handset
          ctx.moveTo(x - q * 0.75, y - q * 0.55);
          ctx.quadraticCurveTo(x - q * 0.1, y + q * 0.95, x + q * 0.8, y + q * 0.5);
          ctx.lineTo(x + q * 0.3, y - q * 0.05);
          ctx.lineTo(x - q * 0.2, y - q * 1.0);
          ctx.closePath(); ctx.stroke(); return;
        case "data": // stack
          ctx.ellipse(x, y - q * 0.6, q * 0.85, q * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x - q * 0.85, y - q * 0.6);
          ctx.lineTo(x - q * 0.85, y + q * 0.55);
          ctx.quadraticCurveTo(x, y + q * 1.1, x + q * 0.85, y + q * 0.55);
          ctx.lineTo(x + q * 0.85, y - q * 0.6); ctx.stroke(); return;
        case "msg": // bubble
          ctx.roundRect(x - q * 0.9, y - q * 0.8, q * 1.8, q * 1.3, q * 0.4);
          ctx.moveTo(x - q * 0.3, y + q * 0.5); ctx.lineTo(x - q * 0.5, y + q);
          ctx.lineTo(x + q * 0.05, y + q * 0.5); ctx.stroke(); return;
        case "cal": // calendar
          ctx.roundRect(x - q * 0.85, y - q * 0.7, q * 1.7, q * 1.5, q * 0.25);
          ctx.moveTo(x - q * 0.85, y - q * 0.2); ctx.lineTo(x + q * 0.85, y - q * 0.2);
          ctx.moveTo(x - q * 0.4, y - q * 1.0); ctx.lineTo(x - q * 0.4, y - q * 0.55);
          ctx.moveTo(x + q * 0.4, y - q * 1.0); ctx.lineTo(x + q * 0.4, y - q * 0.55);
          ctx.stroke(); return;
        case "loop": // circular arrow
          ctx.arc(x, y, q * 0.8, Math.PI * 0.35, Math.PI * 1.85); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + q * 0.25, y - q * 0.95);
          ctx.lineTo(x + q * 0.75, y - q * 0.62); ctx.lineTo(x + q * 0.2, y - q * 0.3);
          ctx.stroke(); return;
        default: // out: tick
          ctx.moveTo(x - q * 0.7, y); ctx.lineTo(x - q * 0.15, y + q * 0.6);
          ctx.lineTo(x + q * 0.75, y - q * 0.6); ctx.stroke(); return;
      }
    };

    const label = (i: number, x: number, y: number, s: number, hot: number) => {
      const fs = Math.max(10, Math.min(13.5, w * 0.0098));
      ctx.font = `500 ${fs}px Archivo, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const words = NODES[i].label.split(" ");
      const lines: string[] = [];
      let line = "";
      const max = Math.max(80, w * 0.115);
      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > max && line) { lines.push(line); line = word; }
        else line = test;
      }
      if (line) lines.push(line);
      ctx.fillStyle = `rgba(174,190,214,${0.72 + hot * 0.28})`;
      lines.forEach((l, k) => ctx.fillText(l, x, y + s * 2.05 + k * (fs * 1.25)));
    };

    const frame = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      const halo = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.5);
      halo.addColorStop(0, "rgba(96,128,186,0.1)");
      halo.addColorStop(1, "rgba(96,128,186,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      ctx.lineCap = "round";
      for (let i = 0; i < EDGES.length; i++) {
        const c = curve(i);
        ctx.beginPath();
        ctx.moveTo(c.x1, c.y1);
        ctx.bezierCurveTo(c.c1x, c.c1y, c.c2x, c.c2y, c.x2, c.y2);
        ctx.strokeStyle = "rgba(140,160,192,0.28)";
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      for (const p of pulses) {
        const steps = 10;
        for (let k = 0; k < steps; k++) {
          const t0 = Math.max(0, p.t - k * 0.015);
          const t1 = Math.max(0, p.t - (k + 1) * 0.015);
          if (t1 <= 0 && t0 <= 0) break;
          const a = at(p.edge, t0), b = at(p.edge, t1);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(230,240,255,${0.8 * (1 - k / steps)})`;
          ctx.lineWidth = 2.4 * (1 - k / steps) + 0.5;
          ctx.stroke();
        }
        const head = at(p.edge, p.t);
        ctx.save();
        ctx.shadowColor = "rgba(190,214,255,0.9)";
        ctx.shadowBlur = unit() * 1.6;
        ctx.beginPath();
        ctx.arc(head.x, head.y, Math.max(3, unit() * 0.21), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(246,249,255,1)";
        ctx.fill();
        ctx.restore();
      }

      for (let i = 0; i < NODES.length; i++) {
        const x = px(i), y = py(i), s = unit(), hot = heat[i];

        if (hot > 0.01) {
          ctx.beginPath();
          ctx.arc(x, y, s * (1.55 + (1 - hot) * 1.5), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(214,228,248,${0.45 * hot})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.roundRect(x - s, y - s, s * 2, s * 2, s * 0.46);
        ctx.fillStyle = "#0C121D";
        ctx.fill();
        ctx.strokeStyle = `rgba(164,184,214,${0.48 + hot * 0.5})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        if (hot > 0.01) {
          ctx.save();
          ctx.shadowColor = `rgba(170,200,250,${0.85 * hot})`;
          ctx.shadowBlur = s * 2.2 * hot;
          ctx.strokeStyle = `rgba(226,238,255,${0.9 * hot})`;
          ctx.stroke();
          ctx.restore();
        }

        glyph(NODES[i].kind, x, y, s, 0.6 + hot * 0.4);
        label(i, x, y, s, hot);
      }

      if (!reduced) {
        for (let i = 0; i < heat.length; i++) heat[i] = Math.max(0, heat[i] - dt * 1.4);

        const next: Pulse[] = [];
        for (const p of pulses) {
          p.t += p.speed * dt;
          if (p.t < 1) { next.push(p); continue; }
          const target = EDGES[p.edge][1];
          heat[target] = 1;
          const outs = out[target];
          if (outs.length) {
            const pick = outs[(Math.random() * outs.length) | 0];
            next.push({ edge: pick, t: 0, speed: 0.36 + Math.random() * 0.2 });
          }
        }
        pulses = next;

        spawn -= dt;
        if (spawn <= 0 && pulses.length < 6) {
          spawn = 1.1 + Math.random() * 0.8;
          heat[0] = 1;
          pulses.push({ edge: 0, t: 0, speed: 0.36 + Math.random() * 0.2 });
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

    const start = () => {
      size();
      heat[0] = 0.6;
      pulses.push({ edge: 0, t: 0.45, speed: 0.4 });
      frame(0);
      if (!reduced) raf = requestAnimationFrame(loop);
    };

    // labels need the webfont, otherwise the first paint measures the fallback
    if (document.fonts?.ready) document.fonts.ready.then(() => { size(); frame(0); });
    start();

    const ro = new ResizeObserver(() => { size(); frame(0); });
    ro.observe(cv);

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
