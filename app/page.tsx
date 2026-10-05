"use client";

import { useState } from "react";
import Marquee from "@/components/Marquee";
import GlobeStack from "@/components/GlobeStack";
import ContactForm from "@/components/ContactForm";
import CaseSheet from "@/components/CaseSheet";
import Reveal from "@/components/Reveal";
import { CASE_STUDIES } from "@/app/work/casestudies";
import { BUILD, ABOUT, STACK, DELIVER } from "./content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const WHATSAPP = "https://wa.me/639761172117";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "CV", href: `${BASE}/cv.html` },
  { label: "Contact", href: "#contact" },
];

const FACT_ART: Record<string, React.ReactNode> = {
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M18 20a5 5 0 0 0-2-4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
};

const SVC_ART: Record<string, React.ReactNode> = {
  agents: (
    <>
      <path d="M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5l2.6-1.5M17.2 9l2.6-1.5" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  software: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 21h8M12 18v3M7 9l2.5 2.5L7 14" />
    </>
  ),
  integrations: (
    <>
      <path d="M9 7V4M15 7V4M7 7h10v6a5 5 0 0 1-10 0z" />
      <path d="M12 18v3" />
    </>
  ),
  data: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};

const TOOLS = [
  "anthropic", "openai", "modelcontextprotocol", "n8n", "make", "zapier", "googleappsscript",
  "python", "typescript", "react", "nextdotjs", "trpc", "railway", "supabase",
  "postgresql", "mysql", "googlebigquery", "googlesheets", "wordpress", "canva",
  "googleads", "googleanalytics", "meta", "linkedin", "zoho", "slack",
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export default function Home() {
  const [study, setStudy] = useState<number | null>(null);

  return (
    <div className="alt">
      <header className="alt-nav">
        {NAV.map((n) => (
          <a key={n.label} href={n.href} {...(n.href.startsWith("#") ? {} : { target: "_blank", rel: "noopener" })}>
            {n.label}
          </a>
        ))}
      </header>

      {/* HERO */}
      <section className="alt-hero">
        <h1 className="alt-wordmark">John Culinares</h1>
        <div className="alt-hero-mid">
          <img className="alt-portrait" src={`${BASE}/images/headshot/john-cutout.webp`} alt="John Lemuel Culinares" />
          <dl className="alt-hero-side">
            <div>
              <dt>Building since</dt>
              <dd>2022</dd>
            </div>
            <div>
              <dt>Shipped</dt>
              <dd>30 projects</dd>
            </div>
            <div>
              <dt>Clients in</dt>
              <dd>UK · US · AU</dd>
            </div>
            <div>
              <dt>Works</dt>
              <dd>UK and US hours</dd>
            </div>
          </dl>
        </div>
        <div className="alt-hero-foot">
          <div>
            <span className="alt-status">
              <i aria-hidden="true" />
              Open to new projects
            </span>
            <p className="alt-tagline">
              An AI automation specialist building the systems that take repetitive work off your team
            </p>
          </div>
          <a className="alt-pill" href="#contact">
            Contact me <Arrow />
          </a>
        </div>
      </section>

      <Marquee />

      {/* THE GLOBE, kept from the main site */}
      <section className="alt-globe">
        <p className="alt-globe-kicker">The stack, as one thing</p>
        <GlobeStack />
      </section>

      {/* ABOUT */}
      <section id="about" className="alt-sec alt-about">
        <div className="alt-about-stage">
          {ABOUT.map((a, i) => (
            <Reveal key={a.k} delay={i * 100}>
              <div className={`alt-fact alt-fact-${i + 1}`}>
                <span className="alt-fact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {FACT_ART[a.art]}
                  </svg>
                </span>
                <span className="alt-fact-k">{a.k}</span>
                <span className="alt-fact-v">{a.v}</span>
              </div>
            </Reveal>
          ))}
          <div className="alt-about-mid">
            <h2 className="alt-big">About me</h2>
            <p className="alt-about-copy">
              I build AI systems for businesses in the UK, the US and Australia, from a desk in the Philippines. Most
              projects start as a spreadsheet somebody updates by hand, a call nobody answers, or a report that takes a
              day to assemble. I build the thing that ends it.
            </p>
            <a className="alt-pill" href="#contact">
              Contact me <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="alt-sec">
        <h2 className="alt-big alt-left">Services</h2>
        <p className="alt-sub">One person from first call to handover, so nothing gets lost in a hand-off.</p>
        <div className="alt-svc-grid">
          {BUILD.map((b) => (
            <Reveal key={b.n}>
              <article className="alt-svc">
                <span className="alt-svc-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {SVC_ART[b.art]}
                  </svg>
                </span>
                <span className="alt-num">{b.n}</span>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
                <span className="alt-svc-stack">{b.points.join(" · ")}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="alt-sec">
        <h2 className="alt-big alt-left">Selected work</h2>
        <p className="alt-sub">Live systems in use today. On client systems, names are withheld.</p>
        <div className="alt-work">
          {CASE_STUDIES.map((c, i) => (
            <Reveal key={c.key}>
              <article className="alt-entry">
                {c.thumb && (
                  <button className="alt-shot" onClick={() => setStudy(i)} aria-label={`Open the ${c.key} case study`}>
                    <img src={`${BASE}${c.thumb}`} alt="" loading="lazy" />
                    <span className="alt-shot-go">
                      Case study <Arrow />
                    </span>
                  </button>
                )}
                <span className="alt-num">{String(i + 1).padStart(2, "0")}</span>
                <p className="alt-entry-kicker">{c.kicker}</p>
                <h3>{c.key}</h3>
                {c.scale && <p className="alt-entry-scale">{c.scale}</p>}
                <div className="alt-entry-actions">
                  <button className="alt-pill sm" onClick={() => setStudy(i)}>
                    Case study <Arrow />
                  </button>
                  {c.live && (
                    <a className="alt-pill sm" href={c.live.href} target="_blank" rel="noopener">
                      Live site <Arrow />
                    </a>
                  )}
                </div>
                <p className="alt-entry-desc">{c.summary}</p>
                <ul className="alt-entry-points">
                  {c.features.slice(0, 3).map((f) => (
                    <li key={f.name}>
                      <b>{f.name}</b>
                      {f.body}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <a className="alt-pill" href={`${BASE}/work/`}>
          Everything else, 30 projects <Arrow />
        </a>
      </section>

      {/* PROCESS */}
      <section className="alt-sec">
        <h2 className="alt-big alt-left">How a project goes</h2>
        <p className="alt-sub">Clear scope and price before any work starts.</p>
        <div className="alt-steps">
          {DELIVER.map((d) => (
            <Reveal key={d.n}>
              <div className="alt-step">
                <span className="alt-num">{d.n}</span>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STACK */}
      <section className="alt-sec">
        <h2 className="alt-big alt-left">What I build with</h2>
        <div className="alt-kit">
          {STACK.map((g) => (
            <Reveal key={g.label}>
              <div className="alt-kit-row">
                <h3>{g.label}</h3>
                <p>{g.items}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TOOL WALL */}
      <section className="alt-sec alt-wall-sec">
        <div className="alt-wall">
          {TOOLS.map((t) => (
            <span className="alt-wall-cell" key={t}>
              <img src={`${BASE}/images/tech/${t}.svg`} alt="" loading="lazy" />
            </span>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="alt-sec alt-contact">
        <h2 className="alt-big">Need a system built?</h2>
        <div className="alt-contact-grid">
          <ul className="alt-lines">
            <li>
              <span>Email</span>
              <a href="mailto:j.culinares06@gmail.com">j.culinares06@gmail.com</a>
            </li>
            <li>
              <span>WhatsApp</span>
              <a href={WHATSAPP} target="_blank" rel="noopener">
                +63 976 117 2117
              </a>
            </li>
            <li>
              <span>LinkedIn</span>
              <a href="https://linkedin.com/in/john-lemuel-culinares" target="_blank" rel="noopener">
                john-lemuel-culinares
              </a>
            </li>
            <li>
              <span>Based in</span>
              <em>Philippines, on UK and US hours</em>
            </li>
          </ul>
          <ContactForm />
        </div>
      </section>

      <footer className="alt-foot">
        <span>© {new Date().getFullYear()} John Lemuel Culinares</span>
        <a href="#top">Back to top</a>
      </footer>

      {study !== null && <CaseSheet index={study} onClose={() => setStudy(null)} onMove={setStudy} />}
    </div>
  );
}
