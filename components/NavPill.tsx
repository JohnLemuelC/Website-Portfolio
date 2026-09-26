"use client";

import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const WHATSAPP = "https://wa.me/639761172117";

const LINKS = [
  { label: "The work", href: "#build" },
  { label: "Proof", href: "#proof" },
  { label: "Process", href: "#deliver" },
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

        <a className="navpill-cta" href={WHATSAPP} target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.02-.2-.31A8.2 8.2 0 1 1 12 20.2Zm4.5-6.14c-.25-.12-1.47-.72-1.7-.8-.22-.09-.39-.13-.55.12s-.63.8-.78.96c-.14.17-.28.19-.53.07a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.7c-.14-.24 0-.37.11-.5.11-.11.25-.28.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.47-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3c-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.6.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
          </svg>
          WhatsApp
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
          <a href={WHATSAPP} target="_blank" rel="noopener" className="navmenu-cta" onClick={() => setOpen(false)}>
            Message me on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
