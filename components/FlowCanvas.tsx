"use client";

import { useEffect, useRef } from "react";

/**
 * The hero: one of my automations, running.
 *
 * Labels live inside the cards, the way every real workflow tool draws them,
 * so there is never a question of which label belongs to which step. Columns
 * share a width, cards share a height, connectors meet card edges square on.
 *
 * Deliberately not another sphere. GlobeStack already owns that further down.
 */

type Icon = "bolt" | "filter" | "wave" | "rows" | "chat" | "date" | "retry" | "check";

type Spec = { col: number; row: number; rows: number; label: string; icon: Icon; hue: string };

// one colour per kind of step, the way a workflow tool colours its nodes.
// it is decoration and legend at the same time.
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

const NODES: Spec[] = [
  { col: 0, row: 0, rows: 1, label: "New lead", icon: "bolt", hue: "#F5B544" },
  { col: 1, row: 0, rows: 1, label: "n8n qualifies", icon: "filter", hue: "#EA4B71" },
  { col: 2, row: 0, rows: 3, label: "AI voice call", icon: "wave", hue: "#A78BFA" },
  { col: 2, row: 1, rows: 3, label: "Enrich + dedupe", icon: "rows", hue: "#38BDF8" },
  { col: 2, row: 2, rows: 3, label: "SMS follow-up", icon: "chat", hue: "#34D399" },
  { col: 3, row: 0, rows: 2, label: "Books appointment", icon: "date", hue: "#60A5FA" },
  { col: 3, row: 1, rows: 2, label: "Retry cadence", icon: "retry", hue: "#FB923C" },
  { col: 4, row: 0, rows: 1, label: "CRM updated", icon: "check", hue: "#4ADE80" },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2], [1, 3], [1, 4],
  [2, 5], [3, 5], [3, 6], [4, 6],
  [5, 7], [6, 7],
];

type Box = { x: number; y: number; w: number; h: number };
type Pulse = { edge: number; t: number; speed: number };

export default function FlowCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1, fs = 13, ch = 46;
    let boxes: Box[] = [];
    const heat = NODES.map(() => 0);
    const out: number[][] = NODES.map(() => []);
    EDGES.forEach(([a], i) => out[a].push(i));

    let pulses: Pulse[] = [];
    let grid: CanvasPattern | null = null;
    let clock = 0;
    let spawn = 0;
    let running = true;
    let raf = 0;

    const font = (size: number) => `500 ${size}px Archivo, system-ui, sans-serif`;

    const layout = () => {
      fs = Math.max(11, Math.min(14, w * 0.0097));
      ch = Math.max(40, Math.min(54, h * 0.098));
      const padX = ch * 0.42;
      const iconW = ch * 0.46;
      const gap = ch * 0.3;

      ctx.font = font(fs);
      // one width per column, so the grid reads as a grid
      const colW: number[] = [];
      NODES.forEach((n) => {
        const need = padX * 2 + iconW + gap + ctx.measureText(n.label).width;
        colW[n.col] = Math.max(colW[n.col] || 0, need);
      });

      const cols = colW.length;
      const total = colW.reduce((a, b) => a + b, 0);
      const free = Math.max(0, w - total);
      const lane = free / (cols - 1 + 1.2); // a little breathing room at the ends
      let x = lane * 0.6;
      const colX: number[] = [];
      for (let c = 0; c < cols; c++) { colX[c] = x; x += colW[c] + lane; }

      boxes = NODES.map((n) => {
        const band = h / n.rows;
        const y = band * (n.row + 0.5);
        return { x: colX[n.col], y: y - ch / 2, w: colW[n.col], h: ch };
      });
    };

    const makeGrid = () => {
      const step = 26;
      const tile = document.createElement("canvas");
      tile.width = Math.round(step * dpr);
      tile.height = Math.round(step * dpr);
      const t = tile.getContext("2d");
      if (!t) return;
      t.scale(dpr, dpr);
      t.fillStyle = "rgba(146,172,214,0.14)";
      t.beginPath();
      t.arc(step / 2, step / 2, 1.1, 0, Math.PI * 2);
      t.fill();
      const pat = ctx.createPattern(tile, "repeat");
      if (pat) {
        // the pattern is in device pixels, the context is in css pixels
        pat.setTransform(new DOMMatrix([1 / dpr, 0, 0, 1 / dpr, 0, 0]));
        grid = pat;
      }
    };

    const size = () => {
      const b = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(b.width));
      h = Math.max(1, Math.round(b.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeGrid();
      layout();
    };

    const right = (i: number) => ({ x: boxes[i].x + boxes[i].w, y: boxes[i].y + boxes[i].h / 2 });
    const left = (i: number) => ({ x: boxes[i].x, y: boxes[i].y + boxes[i].h / 2 });

    const curve = (e: number) => {
      const a = right(EDGES[e][0]), b = left(EDGES[e][1]);
      const dx = Math.max(26, (b.x - a.x) * 0.5);
      return { x1: a.x, y1: a.y, c1x: a.x + dx, c1y: a.y, c2x: b.x - dx, c2y: b.y, x2: b.x, y2: b.y };
    };

    const at = (e: number, t: number) => {
      const c = curve(e), u = 1 - t;
      return {
        x: u * u * u * c.x1 + 3 * u * u * t * c.c1x + 3 * u * t * t * c.c2x + t * t * t * c.x2,
        y: u * u * u * c.y1 + 3 * u * u * t * c.c1y + 3 * u * t * t * c.c2y + t * t * t * c.y2,
      };
    };

    // icons built only from lines, arcs and rects, so they stay crisp at any size
    const icon = (kind: Icon, cx: number, cy: number, s: number, a: number, hue: string) => {
      ctx.strokeStyle = rgba(hue, a);
      ctx.fillStyle = rgba(hue, a);
      ctx.lineWidth = Math.max(1.3, s * 0.11);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      switch (kind) {
        case "bolt":
          ctx.moveTo(cx + s * 0.3, cy - s); ctx.lineTo(cx - s * 0.34, cy + s * 0.06);
          ctx.lineTo(cx + s * 0.06, cy + s * 0.06); ctx.lineTo(cx - s * 0.26, cy + s);
          ctx.stroke(); return;
        case "filter": // three bars narrowing
          ctx.moveTo(cx - s, cy - s * 0.55); ctx.lineTo(cx + s, cy - s * 0.55);
          ctx.moveTo(cx - s * 0.6, cy); ctx.lineTo(cx + s * 0.6, cy);
          ctx.moveTo(cx - s * 0.22, cy + s * 0.55); ctx.lineTo(cx + s * 0.22, cy + s * 0.55);
          ctx.stroke(); return;
        case "wave": // five bars, a waveform
          [0.42, 0.78, 1, 0.66, 0.34].forEach((v, k) => {
            const bx = cx + (k - 2) * s * 0.44;
            ctx.moveTo(bx, cy - s * v); ctx.lineTo(bx, cy + s * v);
          });
          ctx.stroke(); return;
        case "rows": // stacked records
          [-0.58, 0, 0.58].forEach((o, k) => {
            ctx.moveTo(cx - s, cy + s * o);
            ctx.lineTo(cx + s * (k === 2 ? 0.3 : 1), cy + s * o);
          });
          ctx.stroke(); return;
        case "chat":
          ctx.roundRect(cx - s, cy - s * 0.82, s * 2, s * 1.4, s * 0.38);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.34, cy + s * 0.58); ctx.lineTo(cx - s * 0.5, cy + s);
          ctx.lineTo(cx + s * 0.02, cy + s * 0.58);
          ctx.stroke(); return;
        case "date":
          ctx.roundRect(cx - s, cy - s * 0.74, s * 2, s * 1.66, s * 0.26);
          ctx.moveTo(cx - s, cy - s * 0.2); ctx.lineTo(cx + s, cy - s * 0.2);
          ctx.moveTo(cx - s * 0.46, cy - s * 1.0); ctx.lineTo(cx - s * 0.46, cy - s * 0.52);
          ctx.moveTo(cx + s * 0.46, cy - s * 1.0); ctx.lineTo(cx + s * 0.46, cy - s * 0.52);
          ctx.stroke(); return;
        case "retry":
          ctx.arc(cx, cy, s * 0.8, Math.PI * 0.42, Math.PI * 1.78);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx + s * 0.1, cy - s * 0.96); ctx.lineTo(cx + s * 0.72, cy - s * 0.66);
          ctx.lineTo(cx + s * 0.16, cy - s * 0.24);
          ctx.stroke(); return;
        default:
          ctx.moveTo(cx - s * 0.78, cy + s * 0.06);
          ctx.lineTo(cx - s * 0.18, cy + s * 0.66);
          ctx.lineTo(cx + s * 0.82, cy - s * 0.7);
          ctx.stroke(); return;
      }
    };

    const frame = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      // drifting colour fields, the modern-tech wash behind everything
      const aurora = (cx: number, cy: number, rad: number, hex: string, a: number) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, rgba(hex, a));
        g.addColorStop(1, rgba(hex, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      };
      const R = Math.max(w, h);
      aurora(w * (0.24 + Math.sin(clock * 0.09) * 0.05), h * (0.3 + Math.cos(clock * 0.07) * 0.12), R * 0.42, "#6D5BF0", 0.17);
      aurora(w * (0.7 + Math.cos(clock * 0.06) * 0.06), h * (0.72 + Math.sin(clock * 0.08) * 0.1), R * 0.4, "#0FA5C9", 0.15);
      aurora(w * (0.5 + Math.sin(clock * 0.05) * 0.08), h * 0.5, R * 0.3, "#2563C9", 0.1);

      // the builder canvas the flow sits on
      if (grid) {
        ctx.save();
        const fade = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, R * 0.6);
        fade.addColorStop(0, "rgba(0,0,0,1)");
        fade.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = grid;
        ctx.fillRect(0, 0, w, h);
        // feather the grid out at the edges so it has no hard border
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      ctx.lineCap = "round";
      for (let i = 0; i < EDGES.length; i++) {
        const c = curve(i);
        ctx.beginPath();
        ctx.moveTo(c.x1, c.y1);
        ctx.bezierCurveTo(c.c1x, c.c1y, c.c2x, c.c2y, c.x2, c.y2);
        ctx.strokeStyle = rgba(NODES[EDGES[i][0]].hue, 0.3);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (const p of pulses) {
        const hue = NODES[EDGES[p.edge][0]].hue;
        const steps = 10;
        for (let k = 0; k < steps; k++) {
          const t0 = Math.max(0, p.t - k * 0.015);
          const t1 = Math.max(0, p.t - (k + 1) * 0.015);
          if (t1 <= 0 && t0 <= 0) break;
          const a = at(p.edge, t0), b = at(p.edge, t1);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = rgba(hue, 0.92 * (1 - k / steps));
          ctx.lineWidth = 2.2 * (1 - k / steps) + 0.5;
          ctx.stroke();
        }
        const hd = at(p.edge, p.t);
        ctx.save();
        ctx.shadowColor = rgba(hue, 0.95);
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(hd.x, hd.y, 3.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(252,253,255,1)";
        ctx.fill();
        ctx.restore();
      }

      ctx.font = font(fs);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      for (let i = 0; i < NODES.length; i++) {
        const b = boxes[i];
        if (!b) continue;
        const hot = heat[i];
        const n = NODES[i];
        const cy = b.y + b.h / 2;
        const r = b.h * 0.28;

        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, r);
        ctx.fillStyle = "#0B1120";
        ctx.fill();
        ctx.strokeStyle = rgba(n.hue, 0.34 + hot * 0.56);
        ctx.lineWidth = 1.3;
        ctx.stroke();

        if (hot > 0.01) {
          ctx.save();
          ctx.shadowColor = rgba(n.hue, 0.95 * hot);
          ctx.shadowBlur = 20 * hot;
          ctx.strokeStyle = rgba(n.hue, 0.9 * hot);
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.restore();
        }

        const padX = b.h * 0.42;
        const is = b.h * 0.23;
        icon(n.icon, b.x + padX + is, cy, is, 0.78 + hot * 0.22, n.hue);

        ctx.fillStyle = `rgba(222,232,248,${0.84 + hot * 0.16})`;
        ctx.fillText(n.label, b.x + padX + is * 2 + b.h * 0.3, cy + 0.5);
      }

      if (!reduced) {
        clock += dt;
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

    size();
    heat[0] = 0.6;
    pulses.push({ edge: 0, t: 0.45, speed: 0.4 });
    frame(0);
    if (!reduced) raf = requestAnimationFrame(loop);

    // card widths are measured from text, so remeasure once the webfont lands
    if (document.fonts?.ready) document.fonts.ready.then(() => { layout(); frame(0); });

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
