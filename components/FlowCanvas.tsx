"use client";

import { useEffect, useRef } from "react";
import { HERO_FLOW, type Graph, type Icon } from "./flowGraphs";

/**
 * Draws a workflow and runs work through it.
 *
 * Labels live inside the cards, the way every real workflow tool draws them.
 * Columns share a width, cards share a height, connectors meet card edges.
 * A hop that does not land clearly to the right is a loop, drawn down the
 * left so it never crosses the forward wires.
 */

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

type Box = { x: number; y: number; w: number; h: number };
type Pulse = { edge: number; t: number; speed: number; hops: number };

export default function FlowCanvas({
  graph = HERO_FLOW,
  dense = false,
  live = true,
}: {
  graph?: Graph;
  dense?: boolean;
  live?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const NODES = graph.nodes;
    const EDGES = graph.edges;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || !live;

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
      fs = dense ? Math.max(8.5, Math.min(11, w * 0.0225)) : Math.max(11, Math.min(14, w * 0.0097));
      ch = dense ? Math.max(24, Math.min(34, h * 0.17)) : Math.max(40, Math.min(54, h * 0.098));

      // one width per column, so the grid reads as a grid
      const measure = () => {
        ctx.font = font(fs);
        const cw: number[] = [];
        NODES.forEach((n) => {
          const need = ch * 0.42 * 2 + ch * 0.46 + ch * 0.3 + ctx.measureText(n.label).width;
          cw[n.col] = Math.max(cw[n.col] || 0, need);
        });
        return cw;
      };

      let colW = measure();
      // a six column graph will not fit a card, so shrink the whole thing to
      // the space there is rather than letting it run off the edge
      const minLane = ch * 0.46;
      const natural = colW.reduce((a, b) => a + b, 0) + minLane * (colW.length - 1);
      if (natural > w) {
        const k = w / natural;
        fs *= k;
        ch *= k;
        colW = measure();
      }

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
      const [i, j] = EDGES[e];
      // anything not landing clearly to the right is a loop back, including a
      // jump between two cards sharing a column
      const back = boxes[j].x < boxes[i].x + boxes[i].w - 1;
      if (back) {
        // returns down the left side, clear of the forward wires on the right
        const a = { x: boxes[i].x, y: boxes[i].y + boxes[i].h * 0.5 };
        const b = { x: boxes[j].x, y: boxes[j].y + boxes[j].h * 0.5 };
        const bulge = Math.max(52, boxes[i].w * 0.34);
        return { x1: a.x, y1: a.y, c1x: a.x - bulge, c1y: a.y, c2x: b.x - bulge, c2y: b.y, x2: b.x, y2: b.y };
      }
      const a = right(i), b = left(j);
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
        case "doc":
          ctx.moveTo(cx + s * 0.22, cy - s);
          ctx.lineTo(cx - s * 0.8, cy - s); ctx.lineTo(cx - s * 0.8, cy + s);
          ctx.lineTo(cx + s * 0.8, cy + s); ctx.lineTo(cx + s * 0.8, cy - s * 0.38);
          ctx.closePath();
          ctx.moveTo(cx + s * 0.22, cy - s); ctx.lineTo(cx + s * 0.8, cy - s * 0.38);
          ctx.moveTo(cx - s * 0.44, cy + s * 0.14); ctx.lineTo(cx + s * 0.4, cy + s * 0.14);
          ctx.moveTo(cx - s * 0.44, cy + s * 0.56); ctx.lineTo(cx + s * 0.1, cy + s * 0.56);
          ctx.stroke(); return;
        case "user":
          ctx.arc(cx, cy - s * 0.38, s * 0.42, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.82, cy + s);
          ctx.quadraticCurveTo(cx, cy + s * 0.08, cx + s * 0.82, cy + s);
          ctx.stroke(); return;
        case "upload":
          ctx.moveTo(cx, cy + s * 0.78); ctx.lineTo(cx, cy - s * 0.82);
          ctx.moveTo(cx - s * 0.5, cy - s * 0.3); ctx.lineTo(cx, cy - s * 0.86);
          ctx.lineTo(cx + s * 0.5, cy - s * 0.3);
          ctx.moveTo(cx - s * 0.86, cy + s); ctx.lineTo(cx + s * 0.86, cy + s);
          ctx.stroke(); return;
        case "chart":
          [[-0.62, 0.3], [0, 0.72], [0.62, 1.1]].forEach(([o, hgt]) => {
            ctx.moveTo(cx + s * o, cy + s * 0.84);
            ctx.lineTo(cx + s * o, cy + s * (0.84 - hgt));
          });
          ctx.stroke(); return;
        case "link":
          ctx.arc(cx - s * 0.38, cy, s * 0.52, Math.PI * 0.55, Math.PI * 1.45);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + s * 0.38, cy, s * 0.52, Math.PI * 1.55, Math.PI * 0.45);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.34, cy); ctx.lineTo(cx + s * 0.34, cy);
          ctx.stroke(); return;
        case "shield":
          ctx.moveTo(cx, cy - s);
          ctx.lineTo(cx + s * 0.8, cy - s * 0.58);
          ctx.quadraticCurveTo(cx + s * 0.8, cy + s * 0.56, cx, cy + s);
          ctx.quadraticCurveTo(cx - s * 0.8, cy + s * 0.56, cx - s * 0.8, cy - s * 0.58);
          ctx.closePath();
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
          let outs = out[target];
          if (outs.length) {
            // after a few attempts, stop looping and take the exit
            if (p.hops > 7) {
              const fwd = outs.filter((e) => EDGES[e][1] !== EDGES[p.edge][0]);
              if (fwd.length) outs = fwd;
            }
            const pick = outs[(Math.random() * outs.length) | 0];
            next.push({ edge: pick, t: 0, speed: 0.36 + Math.random() * 0.2, hops: p.hops + 1 });
          }
        }
        pulses = next;

        spawn -= dt;
        if (spawn <= 0 && pulses.length < 6) {
          spawn = 1.1 + Math.random() * 0.8;
          heat[0] = 1;
          pulses.push({ edge: 0, t: 0, speed: 0.36 + Math.random() * 0.2, hops: 0 });
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
    pulses.push({ edge: 0, t: 0.45, speed: 0.4, hops: 0 });
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
  }, [graph, dense, live]);

  return <canvas ref={ref} className="alt-flow" aria-hidden="true" />;
}
