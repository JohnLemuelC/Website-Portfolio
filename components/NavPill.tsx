"use client";

import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const LINKS = [
  { label: "What I build", href: "#build" },
  { label: "Proof", href: "#proof" },
  { label: "How I deliver", href: "#deliver" },
  { label: "Questions", href: "#faq" },
  { label: "CV", href: `${BASE}/cv.html`, external: true },
];

export default function NavPill() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="navpill" aria-label="Main">
        <a className="navpill-brand" href="#top">
          <span className="navpill-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
              <path d="M12 2.6 20.5 7v10L12 21.4 3.5 17V7z" />
              <path d="M12 2.6V12l8.5 5M12 12 3.5 17" />
            </svg>
          </span>
          John Culinares
        </a>

        <div className="navpill-links">
          {LINKS.slice(0, 4).map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <a className="navpill-cta" href="#contact">
          Book a call
        </a>

        <button
          className={`navpill-burger${open ? " is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </nav>

      <div className={`navmenu${open ? " is-open" : ""}`} onClick={() => setOpen(false)}>
        <div className="navmenu-inner" onClick={(e) => e.stopPropagation()}>
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              style={{ transitionDelay: `${i * 45}ms` }}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="navmenu-num">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="navmenu-cta" onClick={() => setOpen(false)}>
            Book a call
          </a>
        </div>
      </div>
    </>
  );
}
