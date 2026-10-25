"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FlowCanvas from "./FlowCanvas";
import { FLOWS, type Flow } from "./flowGraphs";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
      <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sheet({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="flow-scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label={flow.title}>
      <div className="flow-sheet" onClick={(e) => e.stopPropagation()} style={{ ["--hue" as string]: flow.hue }}>
        <button className="flow-close" onClick={onClose} aria-label="Close">×</button>
        <p className="flow-kicker">Automation</p>
        <h3>{flow.title}</h3>
        <p className="flow-blurb">{flow.blurb}</p>
        <div className="flow-sheet-canvas">
          <FlowCanvas graph={flow.graph} />
        </div>
        <p className="flow-scale">{flow.scale}</p>
        <div className="flow-detail">
          {flow.detail.map((d) => (
            <div key={d.h}>
              <h4>{d.h}</h4>
              <p>{d.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function FlowCards({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<Flow | null>(null);

  return (
    <>
      <div className={compact ? "flow-grid flow-grid--hero" : "flow-grid"}>
        {FLOWS.map((f) => (
          <button
            key={f.key}
            className="flow-card"
            style={{ ["--hue" as string]: f.hue }}
            onClick={() => setOpen(f)}
            aria-label={`${f.title}. ${f.blurb}`}
          >
            <span className="flow-card-art">
              <FlowCanvas graph={f.graph} dense />
            </span>
            <span className="flow-card-body">
              <span className="flow-card-title">{f.title}</span>
              <span className="flow-card-blurb">{f.blurb}</span>
              {!compact && (
                <span className="flow-card-more">
                  See how it runs <Arrow />
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      {open && <Sheet flow={open} onClose={() => setOpen(null)} />}
    </>
  );
}
