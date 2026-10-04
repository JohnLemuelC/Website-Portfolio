import GlobeStack from "@/components/GlobeStack";
import Marquee from "@/components/Marquee";
import CountUp from "@/components/CountUp";
import SelectedWork from "@/components/SelectedWork";
import ContactForm from "@/components/ContactForm";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const BUILD = [
  {
    n: "01",
    title: "Voice agents & automation",
    lead: "Put the agents on the work that is eating your week.",
    body: "Voice agents that answer and qualify calls around the clock, and workflows that carry a lead from first contact to booked appointment without anyone retyping it.",
    points: ["Voice AI receptionists on Retell", "n8n and Zapier pipelines", "Missed-call text-back and follow-up"],
    art: "agents",
  },
  {
    n: "02",
    title: "Internal tools & portals",
    lead: "The tool your business needs and nobody sells.",
    body: "Client portals, internal dashboards and the small apps that remove a spreadsheet from your process. Built to be handed over, documented, and run without me.",
    points: ["Client portals and internal tools", "Next.js, Python, Supabase", "Tested and documented on handover"],
    art: "software",
  },
  {
    n: "03",
    title: "Connected systems",
    lead: "Stop typing the same record into two systems.",
    body: "Two-way syncs between the tools you already pay for, with the boring parts handled: duplicate matching, conflict holds, retries, and an alert when something genuinely breaks.",
    points: ["CRM, accounting and ad platforms", "Two-way sync with conflict handling", "Webhooks, REST APIs, MCP servers"],
    art: "integrations",
  },
  {
    n: "04",
    title: "Reporting that decides",
    lead: "Numbers that tell you what to do next.",
    body: "Numbers pulled from every platform into one place, then an AI layer on top that returns a decision instead of another chart nobody opens.",
    points: ["Multi-platform ad and SEO reporting", "Scale, kill or iterate calls per ad", "Daily batch jobs and Slack digests"],
    art: "data",
  },
];

const ABOUT = [
  { k: "Based in", v: "Philippines, working UK and US hours" },
  { k: "Clients in", v: "the UK, the US and Australia" },
  { k: "Who I build for", v: "Agencies, property and real estate" },
  { k: "How I work", v: "One person, first call to handover" },
];

const STACK: { label: string; items: string }[] = [
  { label: "Agents and models", items: "Claude API, OpenAI, MCP servers, custom GPTs" },
  { label: "Voice", items: "Retell AI, Vapi, Twilio SMS" },
  { label: "Automation", items: "n8n, Make, Zapier, Google Apps Script" },
  { label: "Apps", items: "Next.js, React, TypeScript, tRPC, Python" },
  { label: "Data", items: "Supabase, PostgreSQL, MySQL, BigQuery, Sheets" },
  { label: "Platforms", items: "GoHighLevel, Zoho CRM, Pipedrive, Google Ads, Meta" },
];

const PROOF: {
  kicker: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  href?: string;
  linkLabel?: string;
}[] = [
  {
    kicker: "Voice AI",
    title: "Three receptionists answering real calls",
    body: "ACE qualifies inbound real estate leads. GRACE takes inbound seller calls. SARAH runs outbound pre-qualification with SMS follow-up. All live, all handing clean records to the CRM.",
    metric: "24/7",
    metricLabel: "call coverage, no human on the line",
    href: `${BASE}/demos/cascade-land-buyers-dashboard-demo.html`,
    linkLabel: "Open the dashboard demo",
  },
  {
    kicker: "Integrations",
    title: "A portal and a CRM that never disagree",
    body: "A client portal for a UK property group, synced two ways with Zoho CRM. Address matching killed the duplicates, conflicts get held for a human, and 650+ tests keep it honest.",
    metric: "264 → 252",
    metricLabel: "records after 12 duplicate pairs merged",
  },
  {
    kicker: "Data",
    title: "187 accounts in one place",
    body: "Five ad platforms and three SEO sources unified into a warehouse with 25 analysis views, budget pacing and wasted-spend detection, then queried in plain English.",
    metric: "187",
    metricLabel: "client accounts reporting daily",
    href: `${BASE}/demos/marketing-dashboard-demo.html`,
    linkLabel: "Open the live demo",
  },
];

const DELIVER = [
  { n: "01", title: "Find the bottleneck", body: "A call, then I go looking at where the time actually goes. Usually it is not the thing you think it is." },
  { n: "02", title: "Build the smallest version that works", body: "One workflow, one agent, one screen. Something you can judge in a week rather than a quarter." },
  { n: "03", title: "Test it against real data", body: "Edge cases, bad input, the call that goes sideways. If it cannot survive your worst Tuesday it is not finished." },
  { n: "04", title: "Hand it over documented", body: "SOPs and a walkthrough so your team runs it. When the project ends you are not tied to me." },
];

const FAQ = [
  {
    q: "What hours do you work?",
    a: "1PM to 9PM UK time, which covers the UK working afternoon and the US Eastern morning. I am in the Philippines and fully remote, and most of my clients have been UK or US based, so the overlap is the part I plan around.",
  },
  {
    q: "Is this a fit for my business?",
    a: "Owner-led businesses and small teams carrying work that should not need a person: chasing leads, retyping records between systems, pulling the same report every Monday. If you have staff doing that, there is something here.",
  },
  {
    q: "What happens on the first call?",
    a: "A short call about the problem, not the software. I come back with what I would build first, what it costs and how long it takes. If the honest answer is that you do not need me, I will say so.",
  },
  {
    q: "What does it cost?",
    a: "Either a project rate agreed before work starts, or hourly against a cap you set. Anything outside the agreed scope gets discussed before I touch it, never after.",
  },
  {
    q: "Do I get locked in?",
    a: "No. Everything ships documented, in your accounts, on your infrastructure. The whole point of the handover is that your team can run it without me.",
  },
];

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
      <section id="about" className="section">
        <div className="wrap">
          <Reveal>
            <div className="about">
              <img className="about-photo" src={`${BASE}/images/headshot/john.webp`} alt="John Lemuel Culinares" />
              <div className="about-copy">
                <p className="eyebrow">About me</p>
                <h2 className="h2">
                  I start with your process, <em>not the software</em>.
                </h2>
                <p>
                  Four years building AI systems for businesses in the UK, the US and Australia, from a desk in the
                  Philippines. Before the automation work I ran marketing and customer operations, so I have sat on the
                  side that has to use the thing after it is built.
                </p>
                <p>
                  Most projects start the same way: a spreadsheet somebody updates by hand, a call nobody answers, or a
                  report that takes a day to assemble. I build the system that ends it.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <dl className="about-meta">
              {ABOUT.map((a) => (
                <div key={a.k}>
                  <dt>{a.k}</dt>
                  <dd>{a.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="build" className="section">
        <div className="wrap">
          <Reveal>
            <h2 className="h2">What I take off your plate</h2>
            <p className="lede">Four things, concretely. Not &quot;digital transformation&quot;.</p>
          </Reveal>

          <div className="stack">
            {BUILD.map((b, i) => (
              <article className="stack-card" key={b.n} style={{ top: `calc(7rem + ${i * 14}px)`, zIndex: i + 1 }}>
                <span className="stack-num">{b.n}</span>
                <div className="stack-copy">
                  <span className="stack-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {b.art === "agents" && <><path d="M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5l2.6-1.5M17.2 9l2.6-1.5" /><circle cx="12" cy="12" r="4" /></>}
                      {b.art === "software" && <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3M7 9l2.5 2.5L7 14" /></>}
                      {b.art === "integrations" && <><path d="M9 7V4M15 7V4M7 7h10v6a5 5 0 0 1-10 0z" /><path d="M12 18v3" /></>}
                      {b.art === "data" && <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>}
                    </svg>
                  </span>
                  <h3 className="stack-title">{b.title}</h3>
                  <p className="stack-lead">{b.lead}</p>
                  <p className="stack-body">{b.body}</p>
                  <ul className="stack-points">
                    {b.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="stack-art">
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
            <h2 className="h2">Already running</h2>
            <p className="lede">Three systems in production right now, not mockups.</p>
          </Reveal>

          <div className="proof-grid">
            {PROOF.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <article className="proof-card">
                  <span className="proof-kicker">{p.kicker}</span>
                  <h3 className="proof-title">{p.title}</h3>
                  <p className="proof-body">{p.body}</p>
                  <div className="proof-metric">
                    <strong>
                      <CountUp value={p.metric} />
                    </strong>
                    <span>{p.metricLabel}</span>
                  </div>
                  {p.href && (
                    <a className="proof-link" href={p.href} target="_blank" rel="noopener">
                      {p.linkLabel}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  )}
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
            <h2 className="h2">How a project runs</h2>
            <p className="lede">Same four steps every time.</p>
          </Reveal>
          <div className="deliver-grid">
            {DELIVER.map((d, i) => (
              <Reveal key={d.n} delay={i * 80}>
                <div className="deliver-step">
                  <span className="deliver-num">{d.n}</span>
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
            <h2 className="h2">What I build with</h2>
            <p className="lede">The tools in the hero, written out.</p>
          </Reveal>
          <div className="stack-list">
            {STACK.map((g, i) => (
              <Reveal key={g.label} delay={(i % 3) * 70}>
                <div className="stack-row">
                  <h3>{g.label}</h3>
                  <p>{g.items}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="wrap wrap-narrow">
          <Reveal>
            <h2 className="h2">Questions I get asked</h2>
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
