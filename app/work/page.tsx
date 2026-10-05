"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import VoiceSample from "@/components/VoiceSample";
import CaseSheet from "@/components/CaseSheet";
import { projectSections, demos, type Project } from "./data";
import { CASE_STUDIES } from "./casestudies";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const FILTERS = ["All", ...projectSections.map((s) => s.label)];

const COUNT = projectSections.reduce((n, s) => n + s.projects.length, 0);

export default function Work() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<Project | null>(null);
  const [study, setStudy] = useState<number | null>(null);
  const studyIndex = (title: string) => CASE_STUDIES.findIndex((c) => c.key === title);

  const sections = filter === "All" ? projectSections : projectSections.filter((s) => s.label === filter);

  return (
    <main className="alt work">
      <header className="work-head">
        <div className="wrap">
          <a className="work-back" href={`${BASE}/`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to the site
          </a>
          <p className="eyebrow">The build log</p>
          <h1 className="work-h1">Everything I have shipped.</h1>
          <p className="lede">
            {COUNT} projects across AI agents, automation, web apps and marketing. Plus a recording of one of the voice
            agents doing its job, and five dashboards you can click around in.
          </p>
        </div>
      </header>

      {/* CASE STUDIES */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <h2 className="h2">Six, in full</h2>
            <p className="lede">
              The problem, what I built, and the part that nearly did not work. Open one and arrow through the rest.
            </p>
          </Reveal>
          <div className="case-grid">
            {CASE_STUDIES.map((c, i) => (
              <Reveal key={c.key} delay={(i % 3) * 70}>
                <button className="case-card" onClick={() => setStudy(i)}>
                  <span className="case-card-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="case-card-kicker">{c.kicker}</span>
                  <span className="case-card-title">{c.key}</span>
                  <span className="case-card-desc">{c.summary}</span>
                  {c.scale && <span className="case-card-scale">{c.scale}</span>}
                  <span className="case-card-go">Read it</span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <h2 className="h2">Hear one working</h2>
            <p className="lede">A minute of an outbound qualification call for a land acquisition client.</p>
          </Reveal>
          <Reveal delay={80}>
            <VoiceSample />
          </Reveal>
        </div>
      </section>

      {/* DEMOS */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <h2 className="h2">Click around a demo</h2>
            <p className="lede">Live builds with synthetic data. Everything in them responds.</p>
          </Reveal>
          <div className="demo-grid">
            {demos.map((d, i) => (
              <Reveal key={d.title} delay={(i % 3) * 70}>
                <a className="demo-card" href={d.href} target="_blank" rel="noopener">
                  <span className="demo-shot" style={{ background: `linear-gradient(135deg, ${d.from}, ${d.to})` }}>
                    <img src={d.shot} alt={`${d.title} screenshot`} loading="lazy" />
                  </span>
                  <span className="demo-title">{d.title}</span>
                  <span className="demo-desc">{d.desc}</span>
                  <span className="demo-go">
                    Open demo
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <h2 className="h2">Every project</h2>
            <p className="lede">Click any card for the detail.</p>
          </Reveal>

          <div className="work-filters">
            {FILTERS.map((f) => (
              <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)} aria-pressed={filter === f}>
                {f}
              </button>
            ))}
          </div>

          {sections.map((s) => (
            <div key={s.label} className="work-group">
              <h3 className="work-group-label">
                {s.label}
                <span>{s.projects.length}</span>
              </h3>
              <div className="work-grid">
                {s.projects.map((p, i) => (
                  <Reveal key={p.title} delay={(i % 3) * 60}>
                    <button className="work-card" onClick={() => setOpen(p)}>
                      <span className="work-shot">
                        <img src={p.img} alt="" loading="lazy" />
                      </span>
                      <span className="work-name">{p.title}</span>
                      <span className="work-desc">{p.desc}</span>
                      {p.scale && <span className="work-scale">{p.scale}</span>}
                      <span className="work-tags">
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </span>
                      {(p.demo || p.casestudy || p.audio || studyIndex(p.title) >= 0) && (
                        <span className="work-flags">
                          {studyIndex(p.title) >= 0 && <em className="on">Case study</em>}
                          {p.demo && <em>Live demo</em>}
                          {p.casestudy && <em>Case study</em>}
                          {p.audio && <em>Sample call</em>}
                        </span>
                      )}
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section work-cta">
        <div className="wrap wrap-narrow">
          <h2 className="h2">Seen enough?</h2>
          <p className="lede center">Tell me the part of your week you want back.</p>
          <div className="contact-actions">
            <a className="btn" href="mailto:j.culinares06@gmail.com">
              Email John
            </a>
            <a className="btn ghost" href={`${BASE}/`}>
              Back to the site
            </a>
          </div>
        </div>
      </section>

      {open && (
        <div className="sheet" onClick={() => setOpen(null)}>
          <div className="sheet-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={open.title}>
            <button className="sheet-close" onClick={() => setOpen(null)} aria-label="Close">
              ×
            </button>
            <img className="sheet-shot" src={open.img} alt="" />
            <h3>{open.title}</h3>
            <p>{open.desc}</p>
            <div className="work-tags">
              {open.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            {open.audio && (
              <div className="sheet-audio">
                <VoiceSample />
              </div>
            )}
            {(open.demo || open.casestudy || studyIndex(open.title) >= 0) && (
              <div className="sheet-actions">
                {studyIndex(open.title) >= 0 && (
                  <button
                    className="btn"
                    onClick={() => {
                      const i = studyIndex(open.title);
                      setOpen(null);
                      setStudy(i);
                    }}
                  >
                    Read the case study
                  </button>
                )}
                {open.demo && (
                  <a className="btn" href={open.demo} target="_blank" rel="noopener">
                    Open live demo
                  </a>
                )}
                {open.casestudy && (
                  <a className="btn ghost" href={open.casestudy} target="_blank" rel="noopener">
                    Read case study
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {study !== null && <CaseSheet index={study} onClose={() => setStudy(null)} onMove={setStudy} />}
    </main>
  );
}
