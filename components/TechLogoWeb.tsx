"use client";

import { useEffect, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Official brand colours, except where the real one is black or near-black,
// which would vanish on this background. Those render in warm white instead.
const LOGOS = [
  { file: "python", name: "Python", color: "#4B8BBE", x: -0.86, y: -0.28, z: 0.20, s: 1.0 },
  { file: "anthropic", name: "Claude", color: "#F2EFE8", x: -0.44, y: -0.30, z: -0.24, s: 1.25 },
  { file: "n8n", name: "n8n", color: "#EA4B71", x: 0.02, y: -0.26, z: 0.10, s: 1.1 },
  { file: "openai", name: "OpenAI", color: "#EDEAF4", x: 0.48, y: -0.30, z: -0.16, s: 1.0 },
  { file: "nextdotjs", name: "Next.js", color: "#F2EFE8", x: 0.90, y: -0.22, z: 0.26, s: 0.9 },

  { file: "typescript", name: "TypeScript", color: "#3178C6", x: -0.95, y: 0.02, z: -0.10, s: 0.95 },
  { file: "supabase", name: "Supabase", color: "#3FCF8E", x: -0.48, y: 0.03, z: 0.30, s: 1.0 },
  { file: "react", name: "React", color: "#61DAFB", x: 0.02, y: 0.04, z: -0.30, s: 1.2 },
  { file: "zapier", name: "Zapier", color: "#FF6A33", x: 0.52, y: 0.02, z: 0.22, s: 0.95 },
  { file: "railway", name: "Railway", color: "#E7E4F0", x: 0.96, y: 0.06, z: -0.18, s: 0.9 },

  { file: "postgresql", name: "PostgreSQL", color: "#5B85E8", x: -0.80, y: 0.32, z: 0.12, s: 0.9 },
  { file: "make", name: "Make", color: "#9D5BFF", x: -0.30, y: 0.33, z: -0.26, s: 0.95 },
  { file: "zoho", name: "Zoho CRM", color: "#E8474B", x: 0.24, y: 0.32, z: 0.18, s: 0.9 },
  { file: "googleads", name: "Google Ads", color: "#5E9BF5", x: 0.74, y: 0.31, z: -0.08, s: 0.95 },
];

const RASTER = 256;
const LOGO_UNIT = 0.1;
const FILLERS = 44;
const LINK_MAX = 0.72;
const LINKS_PER_NODE = 4;

type Mark = {
  art: HTMLCanvasElement;
  x: number; y: number; z: number; s: number;
  dx: number; dy: number; dz: number; reach: number;
};

type Node = { x: number; y: number; z: number; r: number; hub: boolean };

export default function TechLogoWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, cx = 0, cy = 0, scale = 0, yFactor = 1;
    let raf = 0;
    let onScreen = true;
    let dissolve = 0;
    let dead = false;
    let marks: Mark[] = [];
    let nodes: Node[] = [];
    let edges: { a: number; b: number; len: number }[] = [];
    let pulses: { e: number; t: number; speed: number }[] = [];
    let lastSpawn = 0;
    const start = performance.now();
    const pointer = { x: 0, y: 0 };

    let seed = 23;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

    const loadLogo = (file: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = `${BASE}/images/tech/${file}.svg`;
      });

    // paint the mark once in its brand colour and reuse that canvas every frame
    const tint = (img: HTMLImageElement, color: string) => {
      const c = document.createElement("canvas");
      c.width = RASTER;
      c.height = RASTER;
      const o = c.getContext("2d");
      if (!o) return c;
      o.drawImage(img, 0, 0, RASTER, RASTER);
      o.globalCompositeOperation = "source-in";
      o.fillStyle = color;
      o.fillRect(0, 0, RASTER, RASTER);
      return c;
    };

    const build = async () => {
      const imgs = await Promise.all(LOGOS.map((l) => loadLogo(l.file)));
      if (dead) return;

      marks = [];
      LOGOS.forEach((l, i) => {
        const img = imgs[i];
        if (!img) return;
        const theta = rnd() * Math.PI * 2;
        const phi = Math.acos(rnd() * 2 - 1);
        marks.push({
          art: tint(img, l.color),
          x: l.x, y: l.y, z: l.z, s: l.s,
          dx: Math.sin(phi) * Math.cos(theta),
          dy: Math.sin(phi) * Math.sin(theta) * 0.75,
          dz: Math.cos(phi) * 0.6,
          reach: 0.35 + rnd() * 0.5,
        });
      });

      const nextNodes: Node[] = LOGOS.map((l) => ({ x: l.x, y: l.y, z: l.z, r: 2.2, hub: true }));
      for (let i = 0; i < FILLERS; i++) {
        nextNodes.push({
          x: (rnd() * 2 - 1) * 1.12,
          y: (rnd() * 2 - 1) * 0.46,
          z: (rnd() * 2 - 1) * 0.42,
          r: 0.9 + rnd() * 1.5,
          hub: false,
        });
      }
      nodes = nextNodes;

      const seen = new Set<string>();
      const nextEdges: { a: number; b: number; len: number }[] = [];
      for (let i = 0; i < nodes.length; i++) {
        const dists: { j: number; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < LINK_MAX) dists.push({ j, d });
        }
        dists.sort((p, q) => p.d - q.d);
        for (const cand of dists.slice(0, LINKS_PER_NODE)) {
          const key = i < cand.j ? `${i}-${cand.j}` : `${cand.j}-${i}`;
          if (seen.has(key)) continue;
          seen.add(key);
          nextEdges.push({ a: i, b: cand.j, len: cand.d });
        }
      }
      edges = nextEdges;
      pulses = [];

      measure();
      play();
    };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const slot = slotRef.current?.getBoundingClientRect();
      cx = w / 2;
      cy = slot ? slot.top - rect.top + slot.height / 2 : h * 0.5;
      scale = Math.min(w * 0.4, 660);
      const roomY = (slot?.height ?? h * 0.4) * 0.42;
      yFactor = Math.min(1, roomY / (0.46 * scale));
      if (reduced) frame(0);
    };

    const px: number[] = [];
    const py: number[] = [];
    const pd: number[] = [];

    const frame = (time: number) => {
      const t = (time - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      if (!marks.length) return;
      const dot = scale / 500 + 0.5;

      const yaw = reduced ? 0.12 : Math.sin(t * 0.26) * 0.22 + pointer.x * 0.2;
      const pitch = reduced ? -0.04 : Math.sin(t * 0.19) * 0.07 + pointer.y * 0.1;

      dissolve += (holdRef.current - dissolve) * (holdRef.current > dissolve ? 0.026 : 0.055);
      const webAlpha = Math.max(0, 1 - dissolve * 1.5);

      const cyaw = Math.cos(yaw);
      const syaw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      const project = (x: number, y: number, z: number) => {
        const x1 = x * cyaw + z * syaw;
        const z1 = -x * syaw + z * cyaw;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const persp = 2.6 / (2.6 + z2);
        return [cx + x1 * scale * persp, cy + y1 * scale * persp, persp] as const;
      };

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.3);
      glow.addColorStop(0, `rgba(138,124,248,${(0.1 * (1 - dissolve * 0.7)).toFixed(3)})`);
      glow.addColorStop(1, "rgba(138,124,248,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - scale * 1.35, cy - scale * 0.75, scale * 2.7, scale * 1.5);

      // ---- mesh ----
      if (webAlpha > 0.01) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const [sx, sy, persp] = project(n.x, n.y * yFactor, n.z);
          px[i] = sx;
          py[i] = sy;
          pd[i] = Math.max(0.2, Math.min(1, (persp - 0.78) * 2.1));
        }

        ctx.lineWidth = 1;
        for (const e of edges) {
          const depth = (pd[e.a] + pd[e.b]) / 2;
          const a = webAlpha * depth * 0.78 * (1 - 0.55 * (e.len / LINK_MAX));
          if (a < 0.015) continue;
          ctx.strokeStyle = `rgba(158,178,240,${Math.min(0.62, a).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(px[e.a], py[e.a]);
          ctx.lineTo(px[e.b], py[e.b]);
          ctx.stroke();
        }

        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          if (n.hub) continue;
          const d = pd[i];
          const r = n.r * d * (dot * 1.15);
          const a = webAlpha * d * 0.8;
          const g = ctx.createRadialGradient(px[i], py[i], 0, px[i], py[i], r * 4);
          g.addColorStop(0, `rgba(185,195,255,${(a * 0.33).toFixed(3)})`);
          g.addColorStop(1, "rgba(185,195,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px[i], py[i], r * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(236,234,248,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
          ctx.fill();
        }

        if (!reduced && edges.length) {
          if (t * 1000 - lastSpawn > 420 && pulses.length < 10) {
            pulses.push({ e: Math.floor(rnd() * edges.length), t: 0, speed: 0.004 + rnd() * 0.005 });
            lastSpawn = t * 1000;
          }
          pulses = pulses.filter((p) => {
            p.t += p.speed;
            if (p.t >= 1) return false;
            const e = edges[p.e];
            const x = px[e.a] + (px[e.b] - px[e.a]) * p.t;
            const y = py[e.a] + (py[e.b] - py[e.a]) * p.t;
            const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
            g.addColorStop(0, `rgba(176,162,255,${(0.85 * webAlpha).toFixed(3)})`);
            g.addColorStop(1, "rgba(176,162,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            return true;
          });
        }
      }

      // ---- the marks themselves, furthest first ----
      const order = marks
        .map((m, i) => {
          const push = dissolve * m.reach;
          const [sx, sy, persp] = project(
            m.x + m.dx * push,
            m.y * yFactor + m.dy * push,
            m.z + m.dz * push,
          );
          return { i, sx, sy, persp };
        })
        .sort((a, b) => a.persp - b.persp);

      for (const o of order) {
        const m = marks[o.i];
        const size = LOGO_UNIT * 2 * m.s * scale * o.persp;
        const depth = Math.max(0.3, Math.min(1, (o.persp - 0.78) * 2.1));
        const a = (0.5 + depth * 0.5) * (1 - dissolve * 0.85);
        if (a <= 0.02) continue;

        // soft pool of light under each mark so it sits in the scene
        const g = ctx.createRadialGradient(o.sx, o.sy, 0, o.sx, o.sy, size * 0.95);
        g.addColorStop(0, `rgba(150,160,230,${(0.16 * depth * (1 - dissolve)).toFixed(3)})`);
        g.addColorStop(1, "rgba(150,160,230,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.sx, o.sy, size * 0.95, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = a;
        ctx.drawImage(m.art, o.sx - size / 2, o.sy - size / 2, size, size);
        ctx.globalAlpha = 1;
      }
    };

    const loop = (time: number) => {
      frame(time);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduced || raf || !onScreen || document.hidden || !marks.length) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onVis = () => (document.hidden ? stop() : play());

    build();

    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    if (slotRef.current) ro.observe(slotRef.current);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) play();
      else stop();
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      dead = true;
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const hold = (on: boolean) => {
    holdRef.current = on ? 1 : 0;
    setHeld(on);
    document.body.classList.toggle("is-scattering", on);
  };

  return (
    <>
      <div
        className={`cube-layer${held ? " is-held" : ""}`}
        onPointerDown={() => hold(true)}
        onPointerUp={() => hold(false)}
        onPointerLeave={() => hold(false)}
        onPointerCancel={() => hold(false)}
        role="img"
        aria-label={`The stack I build with: ${LOGOS.map((l) => l.name).join(", ")}. Press and hold to pull it apart.`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            hold(true);
          }
        }}
        onKeyUp={() => hold(false)}
      >
        <canvas ref={canvasRef} className="cube-canvas" aria-hidden="true" />
      </div>
      <div className="cube-slot" ref={slotRef} aria-hidden="true">
        <p className="hero-hint">Hold to pull it apart</p>
      </div>
    </>
  );
}
