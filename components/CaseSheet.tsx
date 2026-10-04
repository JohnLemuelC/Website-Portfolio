"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CASE_STUDIES } from "@/app/work/casestudies";

export default function CaseSheet({
  index,
  onClose,
  onMove,
}: {
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  // main has its own stacking context, so the panel goes on the body instead
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const c = CASE_STUDIES[index];
  const total = CASE_STUDIES.length;
  const next = (index + 1) % total;
  const prev = (index - 1 + total) % total;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(next);
      if (e.key === "ArrowLeft") onMove(prev);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onMove, next, prev]);

  if (!c || !mounted) return null;

  return createPortal(
    <div className="case" onClick={onClose}>
      <article
        className="case-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Case study: ${c.key}`}
      >
        <header className="case-bar">
          <p className="case-count">
            Case study <b>{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
          </p>
          <div className="case-nav">
            <button onClick={() => onMove(prev)} aria-label="Previous case study">
              ←
            </button>
            <button onClick={() => onMove(next)} aria-label="Next case study">
              →
            </button>
            <button className="case-x" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        </header>

        <div className="case-body">
          <p className="eyebrow">{c.kicker}</p>
          <h2>{c.key}</h2>
          <p className="case-lede">{c.summary}</p>

          <dl className="case-meta">
            <div>
              <dt>Client</dt>
              <dd>{c.client}</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>{c.platform}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{c.role}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{c.stack}</dd>
            </div>
          </dl>

          {c.scale && <p className="case-scale">{c.scale}</p>}

          <h3>The problem</h3>
          {c.challenge.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <h3>What I built</h3>
          {c.built.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <h3>What it does</h3>
          <ul className="case-features">
            {c.features.map((f) => (
              <li key={f.name}>
                <b>{f.name}</b>
                <span>{f.body}</span>
              </li>
            ))}
          </ul>

          <h3>The hard part</h3>
          <p className="case-hard">{c.hardPart}</p>

          <h3>Where it got to</h3>
          <p>{c.result}</p>

          {c.live && (
            <a className="btn" href={c.live.href} target="_blank" rel="noopener">
              {c.live.label}
            </a>
          )}

          <button className="case-next" onClick={() => onMove(next)}>
            <span>Next case study</span>
            <b>{CASE_STUDIES[next].key}</b>
          </button>
        </div>
      </article>
    </div>,
    document.body
  );
}
