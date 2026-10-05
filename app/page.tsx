import GlobeStack from "@/components/GlobeStack";
import Marquee from "@/components/Marquee";
import CountUp from "@/components/CountUp";
import SelectedWork from "@/components/SelectedWork";
import ContactForm from "@/components/ContactForm";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import { BUILD, ABOUT, STACK, PROOF, DELIVER, FAQ } from "./content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function Head({ n, title, lede }: { n: string; title: React.ReactNode; lede?: string }) {
  return (
    <header className="sec-head">
      <span className="sec-n">{n}</span>
      <h2 className="sec-h">{title}</h2>
      {lede && <p className="sec-lede">{lede}</p>}
    </header>
  );
}

function AboutIcon({ art }: { art: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {art === "pin" && <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>}
      {art === "globe" && <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" /></>}
      {art === "people" && <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M18 20a5 5 0 0 0-2-4" /></>}
      {art === "layers" && <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>}
    </svg>
  );
}

function Art({ kind }: { kind: string }) {
  if (kind === "agents")
    return (
      <svg viewBox="0 0 220 160" className="card-art" aria-hidden="true">
        <circle cx="110" cy="80" r="26" className="a-fill" />
        <path d="M110 66v28M100 72v16M120 72v16M92 78v4M128 78v4" className="a-line" />
        <circle cx="42" cy="44" r="15" className="a-ghost" />
        <circle cx="178" cy="44" r="15" className="a-ghost" />
        <circle cx="42" cy="122" r="15" className="a-ghost" />
        <circle cx="178" cy="122" r="15" className="a-ghost" />
        <path d="M56 51l28 16M164 51l-28 16M56 115l28-16M164 115l-28-16" className="a-dash" />
      </svg>
    );
  if (kind === "software")
    return (
      <svg viewBox="0 0 220 160" className="card-art" aria-hidden="true">
        <rect x="26" y="26" width="168" height="108" rx="10" className="a-stroke" />
        <path d="M26 52h168" className="a-stroke" />
        <circle cx="42" cy="39" r="3.4" className="a-soft" />
        <circle cx="54" cy="39" r="3.4" className="a-soft" />
        <circle cx="66" cy="39" r="3.4" className="a-soft" />
        <rect x="40" y="66" width="52" height="52" rx="7" className="a-fill" />
        <rect x="102" y="66" width="78" height="14" rx="5" className="a-soft" />
        <rect x="102" y="88" width="60" height="10" rx="4" className="a-soft" />
        <rect x="102" y="104" width="72" height="10" rx="4" className="a-soft" />
      </svg>
    );
  if (kind === "integrations")
    return (
      <svg viewBox="0 0 220 160" className="card-art" aria-hidden="true">
        <rect x="16" y="34" width="56" height="30" rx="8" className="a-stroke" />
        <rect x="16" y="94" width="56" height="30" rx="8" className="a-stroke" />
        <rect x="148" y="34" width="56" height="30" rx="8" className="a-stroke" />
        <rect x="148" y="94" width="56" height="30" rx="8" className="a-stroke" />
        <circle cx="110" cy="80" r="20" className="a-fill" />
        <path d="M72 49h18a8 8 0 0 1 8 8v12M72 109h18a8 8 0 0 0 8-8V89M148 49h-18a8 8 0 0 0-8 8v12M148 109h-18a8 8 0 0 1-8-8V89" className="a-dash" />
      </svg>
    );
  return (
    <svg viewBox="0 0 220 160" className="card-art" aria-hidden="true">
      <path d="M30 128h160" className="a-stroke" />
      <rect x="44" y="92" width="20" height="36" rx="4" className="a-soft" />
      <rect x="76" y="74" width="20" height="54" rx="4" className="a-soft" />
      <rect x="108" y="86" width="20" height="42" rx="4" className="a-soft" />
      <rect x="140" y="48" width="20" height="80" rx="4" className="a-fill" />
      <path d="M54 88 86 68l32 12 32-34" className="a-line" />
      <circle cx="150" cy="46" r="5" className="a-dot" />
    </svg>
  );
}

export default function Home() {
  return (
    <main id="top">
      <Starfield />

      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">AI Automation Specialist · Philippines</p>
        <p className="hero-status">
          <i aria-hidden="true" />
          Open to new projects
        </p>
        <h1 className="hero-h1">
          Most of the work draining your team can run itself.
        </h1>

        <GlobeStack />

        <h2 className="hero-h2">
          Knowing which part to hand over <em>first</em> is the real problem.
        </h2>
        <p className="hero-body">
          Four years building the systems that do it: voice agents that answer every call, pipelines that kill the
          retyping, reporting that makes the decision for you. I will tell you where to start.
        </p>
        <p className="hero-link">
          Not sure which part that is? <a href="#build">Keep scrolling</a>.
        </p>
        <a className="hero-cue" href="#build" aria-label="Scroll to the next section">
          <span />
        </a>
      </section>

      <Marquee />

      {/* ABOUT */}
      <section id="about" className="section about">
        <div className="wrap">
          <div className="about-grid">
            <Reveal>
              <figure className="about-figure">
                <img
                  src={`${BASE}/images/headshot/john-cutout.webp`}
                  alt="John Lemuel Culinares"
                  width={1100}
                  height={1500}
                />
              </figure>
            </Reveal>

            <div className="about-side">
              <Reveal delay={60}>
                <p className="eyebrow">About me</p>
                <h2 className="about-h">
                  I start with your process, <em>not the software</em>.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="about-copy">
                  I build AI systems for businesses in the UK, the US and Australia, from a desk in the Philippines.
                  Most projects start the same way: a spreadsheet somebody updates by hand, a call nobody answers, or a
                  report that takes a day to assemble. I build the thing that ends it.
                </p>
                <p className="about-copy">
                  Before the automation work I ran marketing and customer operations, so I have sat on the side that has
                  to use the system after it is built.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <dl className="about-facts">
                  {ABOUT.map((a) => (
                    <div key={a.k}>
                      <dt>
                        <span className="about-icon" aria-hidden="true">
                          <AboutIcon art={a.art} />
                        </span>
                        {a.k}
                      </dt>
                      <dd>{a.v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <Reveal delay={230}>
                <a className="about-cta" href="#contact">
                  Contact me
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="build" className="section">
        <div className="wrap">
          <Reveal>
            <Head n="01" title="What I take off your plate" lede={'Four things, concretely. Not "digital transformation".'} />
          </Reveal>

          <div className="svc">
            {BUILD.map((b) => (
              <article className="svc-row" key={b.n}>
                <span className="svc-n">{b.n}</span>
                <div className="svc-copy">
                  <span className="svc-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {b.art === "agents" && <><path d="M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5l2.6-1.5M17.2 9l2.6-1.5" /><circle cx="12" cy="12" r="4" /></>}
                      {b.art === "software" && <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3M7 9l2.5 2.5L7 14" /></>}
                      {b.art === "integrations" && <><path d="M9 7V4M15 7V4M7 7h10v6a5 5 0 0 1-10 0z" /><path d="M12 18v3" /></>}
                      {b.art === "data" && <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>}
                    </svg>
                  </span>
                  <h3 className="svc-title">{b.title}</h3>
                  <p className="svc-lead">{b.lead}</p>
                  <p className="svc-body">{b.body}</p>
                  <ul className="svc-points">
                    {b.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="svc-art">
                  <Art kind={b.art} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <SelectedWork />

      {/* PROOF */}
      <section id="proof" className="section">
        <div className="wrap">
          <Reveal>
            <Head n="03" title="Already running" lede="Three systems in production right now, not mockups." />
          </Reveal>

          <div className="proof-grid">
            {PROOF.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <article className="proof-card">
                  <span className="proof-kicker">{p.kicker}</span>
                  <h3 className="proof-title">{p.title}</h3>
                  <p className="proof-body">{p.body}</p>
                  <div className="proof-foot">
                    <div className="proof-metric">
                      <strong>
                        <CountUp value={p.metric} />
                      </strong>
                      <span>{p.metricLabel}</span>
                    </div>
                    <div className="proof-link-row">
                      {p.href && (
                        <a className="proof-link" href={p.href} target="_blank" rel="noopener">
                          {p.linkLabel}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="deliver" className="section">
        <div className="wrap">
          <Reveal>
            <Head n="04" title="How a project runs" lede="Same four steps every time." />
          </Reveal>
          <div className="flow">
            {DELIVER.map((d, i) => (
              <Reveal key={d.n} delay={i * 80}>
                <div className="flow-step">
                  <span className="flow-n">{d.n}</span>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WORK CTA */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <a className="work-banner" href={`${BASE}/work/`}>
              <div className="work-banner-copy">
                <span className="eyebrow">The build log</span>
                <h2>
                  Every project, every demo, and a <em>recording of an agent</em> taking a call.
                </h2>
                <p>
                  30 builds across AI agents, automation, web apps and marketing. Five dashboards you can click around
                  in. One minute of a voice agent qualifying a seller, with the transcript.
                </p>
                <span className="work-banner-go">
                  Open the build log
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
              <div className="work-banner-art" aria-hidden="true">
                <span className="wb-card">
                  <b>30</b>
                  projects
                </span>
                <span className="wb-card">
                  <b>5</b>
                  live demos
                </span>
                <span className="wb-card">
                  <b>1:00</b>
                  sample call
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="section">
        <div className="wrap">
          <Reveal>
            <Head n="05" title="What I build with" lede="The tools in the hero, written out." />
          </Reveal>
          <dl className="kit">
            {STACK.map((g, i) => (
              <Reveal key={g.label} delay={(i % 3) * 70}>
                <div className="kit-row">
                  <dt>{g.label}</dt>
                  <dd>{g.items}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="wrap wrap-narrow">
          <Reveal>
            <Head n="06" title="Questions I get asked" />
          </Reveal>
          <div className="faq">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details>
                  <summary>
                    {f.q}
                    <span aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section contact">
        <div className="wrap wrap-narrow">
          <Reveal>
            <h2 className="h2 contact-h2">
              Tell me <em>where the time goes</em>.
            </h2>
            <p className="lede center">
              One call, no pitch. If I am not the right person for it, I will tell you that too.
            </p>
            <div className="contact-actions">
              <a className="btn" href="mailto:j.culinares06@gmail.com">
                Email John
              </a>
              <a className="btn ghost" href="https://wa.me/639761172117" target="_blank" rel="noopener">
                WhatsApp
              </a>
              <a className="btn ghost" href={`${BASE}/cv.html`} target="_blank" rel="noopener">
                View CV
              </a>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <footer className="foot">
        <span>John Lemuel Culinares</span>
        <span>AI automation &amp; systems · Philippines, remote</span>
        <a href="https://linkedin.com/in/john-lemuel-culinares" target="_blank" rel="noopener">
          LinkedIn
        </a>
      </footer>
    </main>
  );
}
