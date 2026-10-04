"use client";

import { useEffect, useRef, useState } from "react";

// x and y place the name in the field, z sets its depth, s its size.
// Laid out in three bands with the widths accounted for, so nothing collides.
const TECH = [
  { label: "Python", x: -0.84, y: -0.30, z: 0.22, s: 0.95 },
  { label: "Claude API", x: -0.20, y: -0.32, z: -0.26, s: 1.12 },
  { label: "Retell AI", x: 0.33, y: -0.28, z: 0.10, s: 0.95 },
  { label: "MCP servers", x: 0.80, y: -0.24, z: 0.02, s: 0.7 },

  { label: "n8n", x: -0.86, y: 0.0, z: -0.10, s: 0.8 },
  { label: "TypeScript", x: -0.55, y: 0.02, z: 0.30, s: 0.78 },
  { label: "Next.js", x: -0.04, y: -0.01, z: 0.14, s: 1.0 },
  { label: "Supabase", x: 0.44, y: 0.03, z: -0.28, s: 1.02 },
  { label: "React", x: 0.86, y: 0.0, z: 0.26, s: 0.72 },

  { label: "Railway", x: -0.86, y: 0.31, z: 0.16, s: 0.7 },
  { label: "GoHighLevel", x: -0.26, y: 0.29, z: -0.30, s: 0.86 },
  { label: "Zapier", x: 0.30, y: 0.32, z: 0.24, s: 0.78 },
  { label: "Zoho CRM", x: 0.68, y: 0.28, z: -0.14, s: 0.88 },
];

// sampled well above the size it renders at, so the letters stay solid
const FONT_PX = 86;
const STEP = 2;
// fixed reference so every name keeps the same letter size and its real width
const REF = FONT_PX * 2;
const NAME_UNIT = 0.2;
const BUCKETS = 6;

type Point = {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  reach: number;
  seed: number;
  a: number;
  size: number;
};

export default function TechField() {
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
    let scale = 0;
    let yFactor = 1;
    let raf = 0;
    let onScreen = true;
    let dissolve = 0;
    let points: Point[] = [];
    const start = performance.now();
    const pointer = { x: 0, y: 0 };

    let seed = 23;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

    const font = `600 ${FONT_PX}px "Inter Tight", system-ui, sans-serif`;

    // turn one label into points in its own local space
    const sampleName = (label: string) => {
      const probe = document.createElement("canvas").getContext("2d");
      if (!probe) return [];
      probe.font = font;
      const tw = Math.ceil(probe.measureText(label).width) + 10;
      const th = Math.ceil(FONT_PX * 1.5);

      const off = document.createElement("canvas");
      off.width = tw;
      off.height = th;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return [];
      o.font = font;
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText(label, tw / 2, th / 2);

      const data = o.getImageData(0, 0, tw, th).data;
      const out: { lx: number; ly: number; a: number }[] = [];
      for (let y = 0; y < th; y += STEP) {
        for (let x = 0; x < tw; x += STEP) {
          const a = data[(y * tw + x) * 4 + 3] / 255;
          if (a < 0.14) continue;
          out.push({
            // only a touch of jitter: enough to kill the grid, not enough to fray the strokes
            lx: (x + (rnd() - 0.5) * STEP * 0.45 - tw / 2) / REF,
            ly: (y + (rnd() - 0.5) * STEP * 0.45 - th / 2) / REF,
            // interiors go fully solid, only the true edge pixels stay soft
            a: Math.min(1, a * 1.7),
          });
        }
      }
      return out;
    };

    const buildPoints = () => {
      const next: Point[] = [];
      for (const t of TECH) {
        const local = sampleName(t.label);
        const f = t.s * NAME_UNIT;
        for (const p of local) {
          const theta = rnd() * Math.PI * 2;
          const phi = Math.acos(rnd() * 2 - 1);
          next.push({
            x: t.x + p.lx * f,
            y: t.y + p.ly * f,
            z: t.z + (rnd() - 0.5) * 0.03,
            dx: Math.sin(phi) * Math.cos(theta),
            dy: Math.sin(phi) * Math.sin(theta) * 0.75,
            dz: Math.cos(phi) * 0.6,
            reach: Math.pow(rnd(), 2) * 0.9 + 0.06,
            seed: rnd() * 6.28,
            a: p.a,
            size: 0.94 + rnd() * 0.16,
          });
        }
      }
      points = next;
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
      // width drives the spread, then the rows are squashed to fit the gap
      scale = Math.min(w * 0.4, 660);
      const roomY = (slot?.height ?? h * 0.4) * 0.42;
      // 0.32 furthest row + roughly 0.1 for a name's own height
      yFactor = Math.min(1, roomY / (0.42 * scale));
      if (reduced) frame(0);
    };

    const pale: number[][] = Array.from({ length: BUCKETS }, () => []);
    const violet: number[][] = Array.from({ length: BUCKETS }, () => []);

    const frame = (time: number) => {
      const t = (time - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      if (!points.length) return;
      const dot = scale / 500 + 0.5;

      const yaw = reduced ? 0.12 : Math.sin(t * 0.26) * 0.22 + pointer.x * 0.2;
      const pitch = reduced ? -0.04 : Math.sin(t * 0.19) * 0.07 + pointer.y * 0.1;

      dissolve += (holdRef.current - dissolve) * (holdRef.current > dissolve ? 0.026 : 0.055);

      const cyaw = Math.cos(yaw);
      const syaw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.3);
      glow.addColorStop(0, `rgba(138,124,248,${(0.1 * (1 - dissolve * 0.7)).toFixed(3)})`);
      glow.addColorStop(1, "rgba(138,124,248,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - scale * 1.35, cy - scale * 0.75, scale * 2.7, scale * 1.5);

      for (const b of pale) b.length = 0;
      for (const b of violet) b.length = 0;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const push = dissolve * p.reach;
        const wob = reduced ? 0 : Math.sin(t * 1.2 + p.seed) * 0.02 * dissolve;

        const x = p.x + p.dx * push + wob;
        const y = p.y * yFactor + p.dy * push;
        const z = p.z + p.dz * push;

        const x1 = x * cyaw + z * syaw;
        const z1 = -x * syaw + z * cyaw;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;

        const persp = 2.6 / (2.6 + z2);
        const sx = cx + x1 * scale * persp;
        const sy = cy + y1 * scale * persp;
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

        // depth drives brightness, so the far names sit back
        const depth = Math.max(0.22, Math.min(1, (persp - 0.78) * 2.1));
        const fade = depth * p.a * (1 - Math.min(0.5, push * 0.45));
        const bucket = Math.min(BUCKETS - 1, Math.max(0, Math.round(fade * (BUCKETS - 1))));
        const tinted = dissolve > 0.12 && i % 9 === 0;
        (tinted ? violet : pale)[bucket].push(sx, sy, (1.0 + depth * 1.25) * dot * p.size);
      }

      // dim buckets first, which also puts the far names behind the near ones
      for (let bkt = 0; bkt < BUCKETS; bkt++) {
        const a = (Math.pow(bkt / (BUCKETS - 1), 0.85) * 0.96).toFixed(2);
        const arr = pale[bkt];
        if (arr.length) {
          ctx.fillStyle = `rgba(247,245,243,${a})`;
          for (let i = 0; i < arr.length; i += 3) ctx.fillRect(arr[i], arr[i + 1], arr[i + 2], arr[i + 2]);
        }
        const vio = violet[bkt];
        if (vio.length) {
          ctx.fillStyle = `rgba(176,162,255,${a})`;
          for (let i = 0; i < vio.length; i += 3) ctx.fillRect(vio[i], vio[i + 1], vio[i + 2], vio[i + 2]);
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

    const init = () => {
      buildPoints();
      measure();
      play();
    };

    if (document.fonts?.load) {
      document.fonts.load(`600 ${FONT_PX}px "Inter Tight"`).then(init).catch(init);
    } else {
      init();
    }

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
        aria-label={`The stack I build with: ${TECH.map((t) => t.label).join(", ")}. Press and hold to scatter it.`}
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
        <p className="hero-hint">Hold to break it apart</p>
      </div>
    </>
  );
}
