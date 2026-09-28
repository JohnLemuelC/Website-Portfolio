"use client";

import { useEffect, useRef, useState } from "react";

type V3 = [number, number, number];

const VERTS: V3[] = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];

const FACES: { idx: number[]; shade: number }[] = [
  { idx: [0, 1, 2, 3], shade: 0.54 },
  { idx: [5, 4, 7, 6], shade: 0.78 },
  { idx: [4, 0, 3, 7], shade: 0.46 },
  { idx: [1, 5, 6, 2], shade: 0.66 },
  // canvas y grows downward, so y=+1 is the underside and y=-1 catches the light
  { idx: [3, 2, 6, 7], shade: 0.3 },
  { idx: [4, 5, 1, 0], shade: 1.0 },
];

// points scattered across the cube surface, used for the dissolve
const CLOUD: { p: V3; drift: number; seed: number }[] = (() => {
  const out: { p: V3; drift: number; seed: number }[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;
  for (let i = 0; i < 2400; i++) {
    const face = i % 6;
    const a = rnd();
    const b = rnd();
    const p: V3 = face === 0 ? [a, b, -1] : face === 1 ? [a, b, 1] : face === 2 ? [-1, a, b] : face === 3 ? [1, a, b] : face === 4 ? [a, 1, b] : [a, -1, b];
    // squared so most particles stay in a dense core and only a few stream out
    out.push({ p, drift: 0.3 + Math.pow(Math.abs(rnd()), 2) * 2.7, seed: Math.abs(rnd()) * 6.28 });
  }
  return out;
})();

export default function CubeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let size = 0;
    let raf = 0;
    let onScreen = true;
    let dissolve = 0;
    const start = performance.now();
    const pointer = { x: 0, y: 0 };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // sit the cube in the gap the layout reserves for it
      const slot = slotRef.current?.getBoundingClientRect();
      cx = w / 2;
      cy = slot ? slot.top - rect.top + slot.height / 2 : h * 0.5;
      // keep the solid cube comfortably inside the gap the layout reserves
      size = Math.max(70, Math.min(w * 0.095, (slot?.height ?? h * 0.4) * 0.27));
      if (reduced) frame(0);
    };

    const rot = (p: V3, ax: number, ay: number): V3 => {
      const [x, y, z] = p;
      const cyy = Math.cos(ay);
      const syy = Math.sin(ay);
      const x1 = x * cyy + z * syy;
      const z1 = -x * syy + z * cyy;
      const cxx = Math.cos(ax);
      const sxx = Math.sin(ax);
      return [x1, y * cxx - z1 * sxx, y * sxx + z1 * cxx];
    };

    const frame = (time: number) => {
      const t = (time - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const ay = reduced ? 0.7 : t * 0.4 + pointer.x * 0.45;
      // a decent tilt keeps the top face visible at every rotation, so it always reads as a solid
      const ax = -0.5 + (reduced ? 0 : Math.sin(t * 0.3) * 0.07 + pointer.y * 0.18);

      // slow bloom on the way out, a touch quicker on the way back
      dissolve += (holdRef.current - dissolve) * (holdRef.current > dissolve ? 0.026 : 0.055);

      const project = (p: V3): [number, number, number] => {
        const [x, y, z] = rot(p, ax, ay);
        const persp = 3.4 / (3.4 + z);
        return [cx + x * size * persp, cy + y * size * persp, z];
      };

      const solid = 1 - dissolve;

      if (solid > 0.015) {
        const sg = ctx.createRadialGradient(cx, cy + size * 1.35, 0, cx, cy + size * 1.35, size * 1.4);
        sg.addColorStop(0, `rgba(0,0,0,${0.42 * solid})`);
        sg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.ellipse(cx, cy + size * 1.32, size * 1.1, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // painter's algorithm: furthest first, so no culling needed on a convex solid
        const faces = FACES.map((f) => {
          const pts = f.idx.map((i) => project(VERTS[i]));
          return { pts, depth: pts.reduce((s, p) => s + p[2], 0) / pts.length, shade: f.shade };
        }).sort((a, b) => b.depth - a.depth);

        for (const f of faces) {
          const g = ctx.createLinearGradient(f.pts[0][0], f.pts[0][1], f.pts[2][0], f.pts[2][1]);
          const top = Math.round(235 * f.shade + 20);
          const bot = Math.round(190 * f.shade + 18);
          g.addColorStop(0, `rgba(${top},${top},${Math.min(255, top + 6)},${solid})`);
          g.addColorStop(1, `rgba(${bot},${bot},${Math.min(255, bot + 8)},${solid})`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(f.pts[0][0], f.pts[0][1]);
          for (let i = 1; i < f.pts.length; i++) ctx.lineTo(f.pts[i][0], f.pts[i][1]);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `rgba(255,255,255,${0.1 * solid})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (dissolve > 0.012) {
        // how far a particle has to travel to reach the edge of the hero
        const reach = Math.min(w / 2, h / 2) / size;
        for (let i = 0; i < CLOUD.length; i++) {
          const c = CLOUD[i];
          const spread = 1 + dissolve * c.drift * reach * 0.3;
          const wob = reduced ? 0 : Math.sin(t * 1.3 + c.seed) * 0.12 * dissolve;
          const [sx, sy, z] = project([c.p[0] * spread + wob, c.p[1] * spread, c.p[2] * spread]);
          if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;
          const depth = Math.max(0.15, (2 - z) / 3);
          const fade = dissolve * depth * (1 - Math.min(0.7, (spread / (reach + 1)) * 0.38));
          ctx.fillStyle = i % 6 === 0
            ? `rgba(176,162,255,${Math.min(1, fade * 1.6).toFixed(3)})`
            : `rgba(246,244,252,${Math.min(1, fade * 1.4).toFixed(3)})`;
          const r = 1.6 + depth * 1.7;
          ctx.fillRect(sx, sy, r, r);
        }
      }
    };

    const loop = (time: number) => {
      frame(time);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduced || raf || !onScreen || document.hidden) return;
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

    measure();
    play();

    return () => {
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
    // drop the background stars back so the cloud reads as its own object
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
        role="button"
        tabIndex={0}
        aria-label="Press and hold to scatter the cube"
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
        <p className="hero-hint">Hold to break it apart</p>
      </div>
    </>
  );
}
