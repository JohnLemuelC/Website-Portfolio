"use client";

import { useEffect, useRef, useState } from "react";
import { LAND_MASK, MASK_W, MASK_H } from "./landmask";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// where each mark ends up once the globe opens out
const LOGOS = [
  // Row 1, the AI and automation layer
  { file: "anthropic", name: "Claude", color: "#F2EFE8", x: -0.97, y: -0.40, z: 0.20, s: 1.25 },
  { file: "openai", name: "OpenAI", color: "#EDEAF4", x: -0.645, y: -0.40, z: -0.24, s: 1.1 },
  { file: "modelcontextprotocol", name: "MCP", color: "#E9E5F2", x: -0.32, y: -0.40, z: 0.12, s: 1.0 },
  { file: "n8n", name: "n8n", color: "#EA4B71", x: 0.005, y: -0.40, z: -0.18, s: 1.1 },
  { file: "make", name: "Make", color: "#9D5BFF", x: 0.33, y: -0.40, z: 0.26, s: 1.0 },
  { file: "zapier", name: "Zapier", color: "#FF6A33", x: 0.655, y: -0.40, z: -0.12, s: 0.95 },
  { file: "googleappsscript", name: "Apps Script", color: "#5898F7", x: 0.98, y: -0.40, z: 0.16, s: 0.9 },

  // Row 2, what the apps are written in
  { file: "python", name: "Python", color: "#4B8BBE", x: -0.97, y: -0.135, z: -0.16, s: 1.05 },
  { file: "typescript", name: "TypeScript", color: "#3178C6", x: -0.645, y: -0.135, z: 0.24, s: 0.95 },
  { file: "react", name: "React", color: "#61DAFB", x: -0.32, y: -0.135, z: -0.28, s: 1.15 },
  { file: "nextdotjs", name: "Next.js", color: "#F2EFE8", x: 0.005, y: -0.135, z: 0.18, s: 0.95 },
  { file: "trpc", name: "tRPC", color: "#39A7D4", x: 0.33, y: -0.135, z: -0.10, s: 0.9 },
  { file: "railway", name: "Railway", color: "#E7E4F0", x: 0.655, y: -0.135, z: 0.28, s: 0.9 },
  { file: "supabase", name: "Supabase", color: "#3FCF8E", x: 0.98, y: -0.135, z: -0.20, s: 1.0 },

  // Row 3, where the data sits. staggered against the rows above and below
  { file: "postgresql", name: "PostgreSQL", color: "#5B85E8", x: -0.81, y: 0.135, z: 0.22, s: 0.95 },
  { file: "mysql", name: "MySQL", color: "#5C9CC9", x: -0.485, y: 0.135, z: -0.26, s: 0.95 },
  { file: "googlebigquery", name: "BigQuery", color: "#669DF6", x: -0.16, y: 0.135, z: 0.14, s: 0.9 },
  { file: "googlesheets", name: "Google Sheets", color: "#3FBE63", x: 0.165, y: 0.135, z: -0.22, s: 0.9 },
  { file: "wordpress", name: "WordPress", color: "#3D9CC4", x: 0.49, y: 0.135, z: 0.26, s: 0.9 },
  { file: "canva", name: "Canva", color: "#00C4CC", x: 0.815, y: 0.135, z: -0.14, s: 0.9 },

  // Row 4, the ad platforms and CRMs the work plugs into
  { file: "googleads", name: "Google Ads", color: "#5E9BF5", x: -0.81, y: 0.40, z: -0.20, s: 1.0 },
  { file: "googleanalytics", name: "Google Analytics", color: "#F08A1E", x: -0.485, y: 0.40, z: 0.24, s: 0.9 },
  { file: "meta", name: "Meta Ads", color: "#2E9BFF", x: -0.16, y: 0.40, z: -0.12, s: 1.0 },
  { file: "linkedin", name: "LinkedIn Ads", color: "#2D8FE0", x: 0.165, y: 0.40, z: 0.18, s: 0.9 },
  { file: "zoho", name: "Zoho CRM", color: "#E8474B", x: 0.49, y: 0.40, z: -0.26, s: 0.9 },
  { file: "slack", name: "Slack", color: "#ECE6EE", x: 0.815, y: 0.40, z: 0.10, s: 0.95 },
];

const RASTER = 256;
const LOGO_UNIT = 0.062;
const GLOBE_R = 0.35;
// the poles are a mess in an equirectangular mask, so the globe stops short of them
const LAT_MIN = -56;
const LAT_MAX = 83;
const LAT_STEP = 1.45;
const RINGS = 5;
const FILLERS = 26;
const LINK_MAX = 0.52;
const LINKS_PER_NODE = 4;
const NARROW_COLS = 5;

type Dot = { x: number; y: number; z: number; drift: number; seed: number };
type Mark = {
  art: HTMLCanvasElement;
  x: number; y: number; z: number; s: number;
};
type Node = { x: number; y: number; z: number; r: number; hub: boolean };

export default function GlobeStack() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, cx = 0, cy = 0, scale = 0, yFactor = 1, gRad = GLOBE_R, logoK = 1;
    let laidOutNarrow: boolean | null = null;
    let raf = 0;
    let onScreen = true;
    let dissolve = 0;
    let dead = false;
    let land: Dot[] = [];
    let marks: Mark[] = [];
    let nodes: Node[] = [];
    let placed: typeof LOGOS = [];
    let edges: { a: number; b: number; len: number }[] = [];
    const start = performance.now();
    const pointer = { x: 0, y: 0 };

    let seed = 23;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

    const bin = atob(LAND_MASK);
    const isLand = (lat: number, lon: number) => {
      // the outer row and column of the mask came out solid, so stay off them
      const u = Math.min(MASK_W - 2, Math.max(1, Math.floor(((lon + 180) / 360) * MASK_W)));
      const v = Math.min(MASK_H - 2, Math.max(1, Math.floor(((90 - lat) / 180) * MASK_H)));
      const i = v * MASK_W + u;
      return (bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
    };

    const loadLogo = (file: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = `${BASE}/images/tech/${file}.svg`;
      });

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
      // land on a lat/lon grid, so the continents read as even rows of dots
      const pts: Dot[] = [];
      for (let lat = LAT_MIN; lat <= LAT_MAX; lat += LAT_STEP) {
        const rad = (lat * Math.PI) / 180;
        const ring = Math.cos(rad);
        const count = Math.max(8, Math.round((360 / LAT_STEP) * ring));
        for (let i = 0; i < count; i++) {
          const lon = -180 + (360 * i) / count;
          if (!isLand(lat, lon)) continue;
          const lr = (lon * Math.PI) / 180;
          pts.push({
            x: ring * Math.sin(lr),
            y: Math.sin(rad),
            z: ring * Math.cos(lr),
            drift: 0.4 + Math.pow(rnd(), 2) * 2.6,
            seed: rnd() * 6.28,
          });
        }
      }
      land = pts;

      const imgs = await Promise.all(LOGOS.map((l) => loadLogo(l.file)));
      if (dead) return;

      // anything that failed to load drops out of both the marks and the mesh,
      // so the two stay index for index
      placed = LOGOS.filter((_, i) => imgs[i]);
      marks = placed.map((l) => ({
        art: tint(imgs[LOGOS.indexOf(l)]!, l.color),
        x: l.x, y: l.y, z: l.z, s: l.s,
      }));

      const nextNodes: Node[] = placed.map((l) => ({ x: l.x, y: l.y, z: l.z, r: 2.2, hub: true }));
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

      // measure lays the marks out for this viewport, which builds the links
      measure();
      play();
    };

    const buildEdges = () => {
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
    };

    // the authored rows are seven wide, which a phone cannot hold.
    // narrow screens get the same marks reflowed into a taller, narrower grid.
    const relayout = (narrow: boolean) => {
      if (!narrow) {
        placed.forEach((l, i) => {
          marks[i].x = nodes[i].x = l.x;
          marks[i].y = nodes[i].y = l.y;
          marks[i].z = nodes[i].z = l.z;
        });
      } else {
        const n = marks.length;
        const rows = Math.ceil(n / NARROW_COLS);
        const base = Math.floor(n / rows);
        let extra = n - base * rows;
        let k = 0;
        for (let r = 0; r < rows; r++) {
          const count = base + (extra-- > 0 ? 1 : 0);
          const y = rows === 1 ? 0 : -0.42 + (0.84 * r) / (rows - 1);
          for (let c = 0; c < count; c++) {
            const x = count === 1 ? 0 : -0.95 + (1.9 * c) / (count - 1);
            marks[k].x = nodes[k].x = x;
            marks[k].y = nodes[k].y = y;
            // depth reads as a wobbly row at this size, so flatten most of it out
            marks[k].z = nodes[k].z = placed[k].z * 0.35;
            k++;
          }
        }
      }
      buildEdges();
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
      scale = w < 760 ? w * 0.41 : Math.min(w * 0.4, 660);
      // on a phone the spread scale would leave a marble, so the globe is sized apart from it
      gRad = GLOBE_R * (w < 760 ? 1.9 : 1);
      // the spread scale is small on a phone, so the logos get held up against it
      logoK = w < 760 ? 1.65 : 1;
      // marks land later than the first resize, so only commit once they exist
      const narrow = w < 760;
      if (marks.length && narrow !== laidOutNarrow) {
        laidOutNarrow = narrow;
        relayout(narrow);
      }
      const roomY = (slot?.height ?? h * 0.4) * 0.42;
      yFactor = Math.min(w < 760 ? 2.2 : 1, roomY / (0.52 * scale));
      if (reduced) frame(0);
    };

    const px: number[] = [];
    const py: number[] = [];
    const pd: number[] = [];
    const shades = [
      "rgba(96,140,235,0.55)",
      "rgba(118,168,250,0.72)",
      "rgba(152,202,255,0.86)",
      "rgba(196,228,255,0.96)",
      "rgba(238,248,255,1)",
    ];
    const buckets: number[][] = [[], [], [], [], []];

    const frame = (time: number) => {
      const t = (time - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      const dot = scale / 500 + 0.5;

      dissolve += (holdRef.current - dissolve) * (holdRef.current > dissolve ? 0.026 : 0.055);
      // the globe leads, the stack follows it out
      const open = Math.max(0, Math.min(1, (dissolve - 0.12) / 0.72));
      const globeAlpha = Math.max(0, 1 - dissolve * 1.45);

      const spin = reduced ? -0.5 : -0.5 + t * 0.09 + pointer.x * 0.3;
      const tilt = -0.34 + (reduced ? 0 : pointer.y * 0.14);
      const yaw = reduced ? 0.12 : Math.sin(t * 0.26) * 0.2 + pointer.x * 0.18;
      const pitch = reduced ? -0.04 : Math.sin(t * 0.19) * 0.06 + pointer.y * 0.1;

      const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);

      const project = (x: number, y: number, z: number) => {
        const x1 = x * cyaw + z * syaw;
        const z1 = -x * syaw + z * cyaw;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const persp = 2.6 / (2.6 + z2);
        return [cx + x1 * scale * persp, cy + y1 * scale * persp, persp] as const;
      };

      // atmosphere. the globe rides above the slot centre, clear of the hold caption
      const R = gRad * scale;
      const gy = cy - R * 0.15;
      if (globeAlpha > 0.01) {
        const halo = ctx.createRadialGradient(cx, gy, R * 0.86, cx, gy, R * 1.62);
        halo.addColorStop(0, `rgba(78,148,255,${(0.42 * globeAlpha).toFixed(3)})`);
        halo.addColorStop(0.3, `rgba(86,132,252,${(0.17 * globeAlpha).toFixed(3)})`);
        halo.addColorStop(1, "rgba(5,7,13,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cx, gy, R * 1.62, 0, Math.PI * 2);
        ctx.fill();

        // the body of it, lit from the upper left
        const body = ctx.createRadialGradient(cx - R * 0.34, gy - R * 0.38, R * 0.1, cx, gy, R);
        body.addColorStop(0, `rgba(26,48,98,${(0.95 * globeAlpha).toFixed(3)})`);
        body.addColorStop(0.55, `rgba(13,24,56,${(0.92 * globeAlpha).toFixed(3)})`);
        body.addColorStop(1, `rgba(6,10,26,${(0.86 * globeAlpha).toFixed(3)})`);
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(cx, gy, R, 0, Math.PI * 2);
        ctx.fill();

        // bright limb, so the sphere has an edge to read against
        const rim = ctx.createRadialGradient(cx, gy, R * 0.88, cx, gy, R * 1.04);
        rim.addColorStop(0, "rgba(96,164,255,0)");
        rim.addColorStop(0.72, `rgba(124,186,255,${(0.5 * globeAlpha).toFixed(3)})`);
        rim.addColorStop(1, "rgba(150,200,255,0)");
        ctx.fillStyle = rim;
        ctx.beginPath();
        ctx.arc(cx, gy, R * 1.04, 0, Math.PI * 2);
        ctx.fill();

        // continents
        const cs = Math.cos(spin), ss = Math.sin(spin);
        const ct = Math.cos(tilt), st = Math.sin(tilt);
        for (const b of buckets) b.length = 0;
        for (const p of land) {
          const push = 1 + dissolve * p.drift * 1.5;
          const wob = reduced ? 0 : Math.sin(t * 1.2 + p.seed) * 0.03 * dissolve;
          const bx = p.x * push + wob, by = p.y * push, bz = p.z * push;
          const x1 = bx * cs + bz * ss;
          const z1 = -bx * ss + bz * cs;
          const y1 = by * ct - z1 * st;
          const z2 = by * st + z1 * ct;
          if (z2 <= 0.02 && dissolve < 0.05) continue;
          const [sx, sy] = project(x1 * gRad, y1 * gRad, z2 * gRad);
          const dy = sy + (gy - cy) * (1 - dissolve);
          if (sx < -20 || sx > w + 20 || dy < -20 || dy > h + 20) continue;
          const b = Math.min(4, Math.max(0, Math.floor((z2 + 0.2) * 4)));
          buckets[b].push(sx, dy);
        }
        for (let b = 0; b < 5; b++) {
          const arr = buckets[b];
          if (!arr.length) continue;
          ctx.globalAlpha = globeAlpha;
          ctx.fillStyle = shades[b];
          const s = (b >= 3 ? 1.9 : 1.5) * (dot * 0.9);
          for (let i = 0; i < arr.length; i += 2) ctx.fillRect(arr[i], arr[i + 1], s, s);
          ctx.globalAlpha = 1;
        }

        // orbital arcs
        ctx.lineWidth = 1.1;
        for (let i = 0; i < RINGS; i++) {
          const a = (0.46 - i * 0.075) * globeAlpha;
          if (a <= 0.01) continue;
          const rr = R * (1.02 + i * 0.07);
          const rot = t * (0.12 + i * 0.05) * (i % 2 ? -1 : 1);
          ctx.strokeStyle = `rgba(142,186,255,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(cx, gy, rr, rr * (0.26 + i * 0.07), rot, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // ---- the stack, once it opens ----
      if (open > 0.01) {
        const ease = open * open * (3 - 2 * open);

        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const [sx, sy, persp] = project(n.x * ease, n.y * yFactor * ease, n.z * ease);
          px[i] = sx;
          py[i] = sy;
          pd[i] = Math.max(0.2, Math.min(1, (persp - 0.78) * 2.1));
        }

        ctx.lineWidth = 1;
        for (const e of edges) {
          const depth = (pd[e.a] + pd[e.b]) / 2;
          const a = ease * depth * 0.72 * (1 - 0.55 * (e.len / LINK_MAX));
          if (a < 0.015) continue;
          ctx.strokeStyle = `rgba(158,178,240,${Math.min(0.6, a).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(px[e.a], py[e.a]);
          ctx.lineTo(px[e.b], py[e.b]);
          ctx.stroke();
        }

        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].hub) continue;
          const d = pd[i];
          const r = nodes[i].r * d * (dot * 1.15);
          const a = ease * d * 0.8;
          ctx.fillStyle = `rgba(236,234,248,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
          ctx.fill();
        }

        const order = marks
          .map((m, i) => {
            const ml = Math.hypot(m.x, m.y, m.z) || 1;
            const ax = (m.x / ml) * gRad, ay = (m.y / ml) * gRad, az = (m.z / ml) * gRad;
            const x = ax + (m.x - ax) * ease;
            const y = ay + (m.y - ay) * ease;
            const z = az + (m.z - az) * ease;
            const [sx, sy, persp] = project(x, y * yFactor, z);
            return { i, sx, sy: sy + (gy - cy) * (1 - ease), persp };
          })
          .sort((a, b) => a.persp - b.persp);

        for (const o of order) {
          const m = marks[o.i];
          const size = LOGO_UNIT * 2 * m.s * scale * logoK * o.persp * (0.45 + ease * 0.55);
          const depth = Math.max(0.3, Math.min(1, (o.persp - 0.78) * 2.1));
          const a = (0.5 + depth * 0.5) * ease;
          if (a <= 0.02) continue;

          const g = ctx.createRadialGradient(o.sx, o.sy, 0, o.sx, o.sy, size * 0.95);
          g.addColorStop(0, `rgba(150,160,230,${(0.18 * depth * ease).toFixed(3)})`);
          g.addColorStop(1, "rgba(150,160,230,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(o.sx, o.sy, size * 0.95, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = a;
          ctx.drawImage(m.art, o.sx - size / 2, o.sy - size / 2, size, size);
          ctx.globalAlpha = 1;
        }
      }
    };

    const loop = (time: number) => {
      frame(time);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduced || raf || !onScreen || document.hidden || !land.length) return;
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
        aria-label={`A globe that opens into the stack I build with: ${LOGOS.map((l) => l.name).join(", ")}. Press and hold to open it.`}
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
        <p className="hero-hint">Hold to open it up</p>
      </div>
    </>
  );
}
