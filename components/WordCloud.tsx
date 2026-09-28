"use client";

import { useEffect, useRef, useState } from "react";

const WORD = "AUTOMATION";
const SAMPLE_W = 1200;
const SAMPLE_H = 300;
const STEP = 2;
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

export default function WordCloud() {
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
    let raf = 0;
    let onScreen = true;
    let dissolve = 0;
    let points: Point[] = [];
    const start = performance.now();
    const pointer = { x: 0, y: 0 };

    // turn the word into a cloud of points, once
    const buildPoints = () => {
      const off = document.createElement("canvas");
      off.width = SAMPLE_W;
      off.height = SAMPLE_H;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = "600 165px Fraunces, Georgia, serif";
      if ("letterSpacing" in o) (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "6px";
      o.fillText(WORD, SAMPLE_W / 2, SAMPLE_H / 2);

      const data = o.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
      const half = SAMPLE_W / 2;
      const next: Point[] = [];
      let seed = 11;
      const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

      for (let y = 0; y < SAMPLE_H; y += STEP) {
        for (let x = 0; x < SAMPLE_W; x += STEP) {
          // keep the anti-aliased edge pixels and carry their coverage through,
          // so the letter edges stay soft instead of stepping
          const alpha = data[(y * SAMPLE_W + x) * 4 + 3] / 255;
          if (alpha < 0.14) continue;
          // random direction for the burst, biased into a dense core
          const theta = rnd() * Math.PI * 2;
          const phi = Math.acos(rnd() * 2 - 1);
          // jitter off the sampling grid so no rows or columns show through
          const jx = (rnd() - 0.5) * STEP;
          const jy = (rnd() - 0.5) * STEP;
          next.push({
            a: Math.min(1, alpha * 1.15),
            size: 0.82 + rnd() * 0.5,
            x: (x + jx - half) / half,
            y: (y + jy - SAMPLE_H / 2) / half,
            z: (rnd() - 0.5) * 0.05,
            dx: Math.sin(phi) * Math.cos(theta),
            dy: Math.sin(phi) * Math.sin(theta) * 0.7,
            dz: Math.cos(phi) * 0.5,
            reach: Math.pow(rnd(), 2) * 0.95 + 0.06,
            seed: rnd() * 6.28,
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
      // half the word's width, capped so it never outgrows the gap reserved for it
      const byWidth = w * (w > 900 ? 0.33 : 0.44);
      const byHeight = ((slot?.height ?? h * 0.4) * 0.62) / (SAMPLE_H / SAMPLE_W);
      scale = Math.min(byWidth, byHeight);
      if (reduced) frame(0);
    };

    const pale: number[][] = Array.from({ length: BUCKETS }, () => []);
    const violet: number[][] = Array.from({ length: BUCKETS }, () => []);

    const frame = (time: number) => {
      const t = (time - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      if (!points.length) return;
      const dot = scale / 460 + 0.5;

      // swing rather than spin, so the word stays readable
      const yaw = reduced ? 0.18 : Math.sin(t * 0.34) * 0.4 + pointer.x * 0.3;
      const pitch = reduced ? -0.05 : Math.sin(t * 0.23) * 0.1 + pointer.y * 0.14;

      dissolve += (holdRef.current - dissolve) * (holdRef.current > dissolve ? 0.026 : 0.055);

      const cyaw = Math.cos(yaw);
      const syaw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      // glow behind the word, fading as it breaks up
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.15);
      glow.addColorStop(0, `rgba(138,124,248,${(0.11 * (1 - dissolve * 0.7)).toFixed(3)})`);
      glow.addColorStop(1, "rgba(138,124,248,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - scale * 1.2, cy - scale * 0.6, scale * 2.4, scale * 1.2);

      // group by brightness so the whole word costs a handful of fillStyle changes
      for (const b of pale) b.length = 0;
      for (const b of violet) b.length = 0;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const push = dissolve * p.reach;
        const wob = reduced ? 0 : Math.sin(t * 1.2 + p.seed) * 0.02 * dissolve;

        const x = p.x + p.dx * push + wob;
        const y = p.y + p.dy * push;
        const z = p.z + p.dz * push;

        // yaw then pitch
        const x1 = x * cyaw + z * syaw;
        const z1 = -x * syaw + z * cyaw;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;

        const persp = 2.6 / (2.6 + z2);
        const sx = cx + x1 * scale * persp;
        const sy = cy + y1 * scale * persp;
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

        const depth = Math.max(0.3, Math.min(1, persp * 0.9));
        const fade = depth * p.a * (1 - Math.min(0.5, push * 0.45));
        const bucket = Math.min(BUCKETS - 1, Math.max(0, Math.round(fade * (BUCKETS - 1))));
        // ivory while the word is whole, picking up colour only as it comes apart
        const tinted = dissolve > 0.12 && i % 9 === 0;
        (tinted ? violet : pale)[bucket].push(sx, sy, (0.9 + depth * 1.25) * dot * p.size);
      }

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

    // wait for Fraunces so the letterforms are the real ones
    if (document.fonts?.load) {
      document.fonts.load("700 170px Fraunces").then(init).catch(init);
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
        role="button"
        tabIndex={0}
        aria-label="Press and hold to scatter the word"
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
