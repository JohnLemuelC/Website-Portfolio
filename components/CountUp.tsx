"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a number the first time it scrolls into view.
 * Anything non-numeric in `value` (a %, a +, a 24/7) is kept and rendered as is.
 */
export default function CountUp({ value, duration = 1100 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target = Number((value.match(/[\d,]+/)?.[0] ?? "").replace(/,/g, ""));
    // no single number to animate, or the viewer asked for less motion
    if (!Number.isFinite(target) || target <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }

    const render = (n: number) => value.replace(/[\d,]+/, n.toLocaleString("en-GB"));
    setShown(render(0));

    let raf = 0;
    let done = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done) return;
        done = true;
        io.disconnect();
        const start = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - start) / duration);
          // ease out, so it lands rather than stops
          const eased = 1 - Math.pow(1 - k, 3);
          setShown(render(Math.round(target * eased)));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <span ref={ref}>{shown}</span>;
}
