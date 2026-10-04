"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import CaseSheet from "@/components/CaseSheet";
import { CASE_STUDIES } from "@/app/work/casestudies";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function SelectedWork() {
  const [study, setStudy] = useState<number | null>(null);

  return (
    <section id="work" className="section">
      <div className="wrap">
        <Reveal>
          <h2 className="h2">Selected work</h2>
          <p className="lede">
            Six, written up in full: the problem, what I built, and the part that nearly did not work.
          </p>
        </Reveal>

        <div className="sw-list">
          {CASE_STUDIES.map((c, i) => (
            <Reveal key={c.key} delay={(i % 2) * 80}>
              <article className="sw-row">
                <span className="sw-n">{String(i + 1).padStart(2, "0")}</span>
                <div className="sw-copy">
                  <p className="sw-kicker">{c.kicker}</p>
                  <h3>{c.key}</h3>
                  <p className="sw-desc">{c.summary}</p>
                  {c.scale && <p className="sw-scale">{c.scale}</p>}
                  <ul className="sw-points">
                    {c.features.slice(0, 3).map((f) => (
                      <li key={f.name}>
                        <b>{f.name}</b> {f.body}
                      </li>
                    ))}
                  </ul>
                  <div className="sw-actions">
                    <button className="btn" onClick={() => setStudy(i)}>
                      Read the case study
                    </button>
                    {c.live && (
                      <a className="btn ghost" href={c.live.href} target="_blank" rel="noopener">
                        {c.live.label}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <a className="sw-all" href={`${BASE}/work/`}>
            All 30 projects, five demos and a sample call
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>
      </div>

      {study !== null && <CaseSheet index={study} onClose={() => setStudy(null)} onMove={setStudy} />}
    </section>
  );
}
