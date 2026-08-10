"use client";

import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ---- DATA ----

const stats = [
  { value: "4+", label: "Years Experience", sub: "Since 2021" },
  { value: "200+", label: "Marketing Assets", sub: "Built & delivered" },
  { value: "62%", label: "Faster Production", sub: "Avg turnaround gain" },
  { value: "70K", label: "Facebook Likes", sub: "Grown in 3 months" },
];

const metrics = [
  { n: "58%", label: "Admin time reduced for clients" },
  { n: "42%", label: "Fewer missed follow-ups" },
  { n: "5.6%", label: "Email CTR achieved" },
  { n: "90%+", label: "CSAT score, consistently" },
  { n: "28", label: "Investment deals closed" },
  { n: "168", label: "Leads generated" },
  { n: "91%", label: "On-time delivery rate" },
  { n: "22%", label: "Increase in call show-up rate" },
];

const featured = [
  {
    title: "AdLoop",
    desc: "Meta Ads + Triple Whale + Funnelish intelligence dashboard. Uses Claude to output SCALE / KILL / ITERATE decisions for e-commerce brands.",
    tags: ["Claude API", "Python", "Supabase"],
    color: "violet",
    img: `${BASE}/images/projects/Copy Chief.png`,
  },
  {
    title: "MER Engine",
    desc: "Daily batch system computing Marketing Efficiency Ratio across multiple markets. Converts all ad spend to EUR and feeds Supabase and Google Sheets.",
    tags: ["Python", "Supabase", "Google Ads"],
    color: "emerald",
    img: `${BASE}/images/projects/apps-script.png`,
  },
  {
    title: "AI Receptionist (ACE)",
    desc: "Voice AI agent on Retell AI handling inbound lead qualification and appointment scheduling 24/7 for a real estate client.",
    tags: ["Retell AI", "GoHighLevel", "Voice AI"],
    color: "rose",
    img: `${BASE}/images/projects/ACE.png`,
  },
];

const projectSections = [
  {
    label: "AI Agents",
    projects: [
      {
        title: "Google Ads MCP Server",
        desc: "Open-source MCP server enabling Claude/ChatGPT to query and manage Google Ads natively.",
        tags: ["MCP", "Python", "Google Ads API"],
        img: `${BASE}/images/projects/Google Ads MCP Server.png`,
        color: "emerald",
      },
      {
        title: "AdLlama",
        desc: "Next.js + Python platform for managing Google Ads via Claude-powered chat. Built Keyword Planner API and Ad Copy Validation.",
        tags: ["Next.js", "Python", "Claude API"],
        img: `${BASE}/images/projects/Adllama-logo.png`,
        color: "violet",
      },
      {
        title: "Google Ads AI Agent",
        desc: "Custom GPT + MCP server pulling all Google Ads metrics conversationally.",
        tags: ["Custom GPT", "MCP", "Google Ads"],
        img: `${BASE}/images/projects/Gemini_Generated_Image_330ieb330ieb330i.png`,
        color: "cyan",
      },
      {
        title: "Ad Writing AI GPT",
        desc: "Self-learning agent writing Google Ad copy from live campaign data with CTA optimization.",
        tags: ["Custom GPT", "Google Ads", "AI"],
        img: `${BASE}/images/projects/Gemini_Generated_Image_dcpnjzdcpnjzdcpn.png`,
        color: "amber",
      },
      {
        title: "AI Receptionist (ACE)",
        desc: "Voice AI agent for real estate lead qualification and appointment scheduling.",
        tags: ["Retell AI", "Voice AI", "Real Estate"],
        img: `${BASE}/images/projects/ACE.png`,
        color: "rose",
      },
      {
        title: "Google Analytics AI Agent",
        desc: "Custom GPT + MCP server for GA4 data queries via natural language.",
        tags: ["Custom GPT", "MCP", "GA4"],
        img: `${BASE}/images/projects/Gemini_Generated_Image_rpkijmrpkijmrpki.png`,
        color: "emerald",
      },
      {
        title: "Basecamp AI Agent",
        desc: "Full Basecamp workspace made conversational via MCP, with daily Slack briefings.",
        tags: ["Zapier", "ChatGPT", "Slack"],
        img: `${BASE}/images/projects/zapier-basecamp-chatgpt-slack.png`,
        color: "cyan",
      },
      {
        title: "Copy Chief AI",
        desc: "AI copywriting evaluator using a 7-criterion scoring rubric.",
        tags: ["Claude API", "Copywriting", "Evaluation"],
        img: `${BASE}/images/projects/Copy Chief.png`,
        color: "violet",
      },
    ],
  },
  {
    label: "Workflows & Automation",
    projects: [
      {
        title: "N8N Blog Automation",
        desc: "5-workflow system: keyword research to WordPress publishing, fully automated.",
        tags: ["N8N", "OpenAI", "WordPress"],
        img: `${BASE}/images/projects/n8n-workflows.png`,
        color: "emerald",
      },
      {
        title: "KPI Data Manager",
        desc: "Apps Script aggregating KPIs from LinkedIn, Meta, Bing, StackAdapt with Discord alerts.",
        tags: ["Apps Script", "APIs", "Discord"],
        img: `${BASE}/images/projects/apps-script.png`,
        color: "amber",
      },
      {
        title: "FB Lead Capture Pipeline",
        desc: "Facebook Lead Ads to Google Sheets with automated email notifications.",
        tags: ["Zapier", "Facebook", "Sheets"],
        img: `${BASE}/images/projects/zapier-facebook-sheets-email.png`,
        color: "violet",
      },
      {
        title: "LinkedIn Ads to HubSpot",
        desc: "Routes LinkedIn leads and creates HubSpot engagement records automatically.",
        tags: ["Zapier", "LinkedIn", "HubSpot"],
        img: `${BASE}/images/projects/zapier-linkedin-hubspot.png`,
        color: "rose",
      },
      {
        title: "Customer.io Email Automation",
        desc: "90-day nurture sequences, A/B tested outreach, re-engagement flows. 5.6% CTR.",
        tags: ["Customer.io", "Email", "Automation"],
        img: `${BASE}/images/projects/CIO1.png`,
        color: "violet",
      },
      {
        title: "Pipeline to Webinar Registration",
        desc: "Auto-registers contacts for Zoom when they reach a pipeline stage.",
        tags: ["Zapier", "CRM", "Zoom"],
        img: `${BASE}/images/projects/zapier-leadconnector-zoom.png`,
        color: "cyan",
      },
      {
        title: "Pipedrive to Google Ads",
        desc: "n8n workflow mapping Pipedrive deal stages to Google Ads offline conversion events.",
        tags: ["n8n", "Pipedrive", "Google Ads"],
        img: `${BASE}/images/projects/n8n-workflows.png`,
        color: "emerald",
      },
      {
        title: "LinkedIn Lead Alert",
        desc: "Instant email notifications for new LinkedIn Lead Gen Form responses.",
        tags: ["Zapier", "LinkedIn", "Email"],
        img: `${BASE}/images/projects/zapier-linkedin-email.png`,
        color: "cyan",
      },
    ],
  },
  {
    label: "Web Apps",
    projects: [
      {
        title: "Blog Automation Web App",
        desc: "Full UI for SEO-optimized blog content generation and management.",
        tags: ["Web App", "SEO", "AI"],
        img: `${BASE}/images/projects/blog-app.png`,
        color: "violet",
      },
      {
        title: "Canva Listing Automation",
        desc: "Real estate branded graphics from property data with batch CSV support.",
        tags: ["Web App", "Canva API", "Real Estate"],
        img: `${BASE}/images/projects/canva-listing.png`,
        color: "cyan",
      },
      {
        title: "Video AI Merger",
        desc: "6-step video pipeline with AI voiceovers and automated editing.",
        tags: ["Web App", "AI Voice", "Video"],
        img: `${BASE}/images/projects/video-merger.png`,
        color: "amber",
      },
    ],
  },
  {
    label: "Marketing",
    projects: [
      {
        title: "Synergy Data Investments",
        desc: "200+ marketing assets, 30% engagement increase, 28 deals closed.",
        tags: ["Marketing", "Content", "Investment"],
        img: `${BASE}/images/projects/marketing-sdi.png`,
        color: "rose",
      },
      {
        title: "Synergy Estates",
        desc: "62% faster production, 91% on-time delivery rate achieved.",
        tags: ["Marketing", "Real Estate", "Content"],
        img: `${BASE}/images/projects/marketing-synergy-estates.png`,
        color: "emerald",
      },
      {
        title: "Metalkin Australia",
        desc: "168 leads generated, 54 meetings booked, 5 deals closed.",
        tags: ["Marketing", "Lead Gen", "B2B"],
        img: `${BASE}/images/projects/marketing-metalkin.png`,
        color: "violet",
      },
      {
        title: "Aljay Agro-Industrial",
        desc: "70K Facebook likes in 3 months, 40% Instagram growth.",
        tags: ["Marketing", "Social Media", "Agriculture"],
        img: `${BASE}/images/projects/marketing-yfarmers.png`,
        color: "cyan",
      },
    ],
  },
  {
    label: "Websites",
    projects: [
      {
        title: "Synergy Data Investments Website",
        desc: "Investment company site with portfolios, investor tools, and guides.",
        tags: ["Website", "Finance", "WordPress"],
        img: `${BASE}/images/projects/webdesign-sdi.png`,
        color: "amber",
      },
      {
        title: "Synergy Estates Website",
        desc: "Property investment platform with UK News, rankings, and guides.",
        tags: ["Website", "Real Estate", "WordPress"],
        img: `${BASE}/images/projects/webdesign-synergy.png`,
        color: "rose",
      },
    ],
  },
];

const experiences = [
  {
    role: "AI & Automation Specialist",
    company: "Contract / Project-Based",
    period: "2025 - Present",
    status: "current",
    highlights: [
      "Central KPI Datahub aggregating LinkedIn, Meta, and Bing ad performance",
      "MCP servers for Google Ads, GA4, and Search Console exposing live data to AI agents",
      "5-workflow n8n blog automation pipeline (keyword research to WordPress)",
      "AdLlama contributions: Next.js + Python Google Ads platform",
      "Pipedrive CRM integrations and automated weekly Google Ads client check-ins",
    ],
  },
  {
    role: "AI Integration Specialist",
    company: "Contract / Project-Based",
    period: "2025",
    status: "prev",
    highlights: [
      "Copy Chief: AI copywriting evaluator using a 7-criterion scoring rubric",
      "AdLoop: Meta Ads + Triple Whale + Funnelish dashboard with SCALE/KILL/ITERATE analysis",
      "Winning ads analysis loop that recreates top-performing ad variations",
      "Email marketing automations across Mailchimp, ActiveCampaign, and Customer.io",
    ],
  },
  {
    role: "AI Automation & Workflow Specialist",
    company: "Contract / Project-Based",
    period: "2025",
    status: "prev",
    highlights: [
      "AI Receptionist: 24/7 voice AI agent for real estate lead qualification",
      "GoHighLevel integrations for automated lead capture and CRM sync",
      "Automated daily reporting delivered via Slack digests",
      "n8n workflows on VPS for webhook processing and cross-tool automation",
    ],
  },
  {
    role: "Marketing Associate",
    company: "Synergy Data Investments (Remote)",
    period: "2024 - 2025",
    status: "prev",
    highlights: [
      "Created 200+ professional marketing assets",
      "Built email nurture journeys in Customer.io and Mailchimp",
      "Contributed to closing 28 investment deals",
      "30% engagement increase across campaigns",
    ],
  },
  {
    role: "Customer Success Associate",
    company: "SDI Living (Remote)",
    period: "2024 - 2025",
    status: "prev",
    highlights: [
      "Maintained 90%+ CSAT score consistently",
      "22% increase in call show-up rate",
      "CRM data cleanup cutting duplicates by 40%",
    ],
  },
  {
    role: "Customer Service Associate",
    company: "PeakSupport (Remote, BPO)",
    period: "2023 - 2024",
    status: "prev",
    highlights: [
      "Resolved 60+ tickets/day with 92% SLA compliance",
      "18% average handling time reduction",
      "94% CSAT rating",
    ],
  },
  {
    role: "Marketing Assistant",
    company: "Metalkin Australia (Remote)",
    period: "2022 - 2023",
    status: "prev",
    highlights: [
      "Generated 168 leads, booked 54 meetings, closed 5 deals",
      "B2B marketing campaign management",
    ],
  },
  {
    role: "Digital Marketing Support",
    company: "Aljay Agro-Industrial (Remote)",
    period: "2021 - 2022",
    status: "prev",
    highlights: [
      "Grew Facebook page to 70K likes in 3 months",
      "40% Instagram growth, 28% branded search volume increase",
    ],
  },
];

const toolGroups = [
  {
    label: "AI & Agents",
    tools: ["Claude API", "OpenAI", "Retell AI", "Custom GPTs", "MCP Servers", "Prompt Engineering"],
  },
  {
    label: "Automation",
    tools: ["n8n", "Zapier", "Make.com", "Google Apps Script", "Webhooks"],
  },
  {
    label: "Development",
    tools: ["Python", "TypeScript", "Node.js", "Next.js", "FastAPI", "Supabase", "PostgreSQL", "REST APIs", "GitHub", "Railway", "Vercel"],
  },
  {
    label: "CRM & Ops",
    tools: ["GoHighLevel", "HubSpot", "Pipedrive", "Salesforce", "Respond.io", "LeadConnector"],
  },
  {
    label: "Marketing & Ads",
    tools: ["Google Ads", "Meta Ads", "Google Analytics", "LinkedIn Ads", "Bing Ads", "StackAdapt", "Customer.io", "Mailchimp", "ActiveCampaign", "Unbounce"],
  },
  {
    label: "Productivity",
    tools: ["Google Workspace", "Microsoft 365", "Slack", "Discord", "Basecamp", "Monday.com", "Notion", "Calendly"],
  },
  {
    label: "Design & Content",
    tools: ["Canva", "Photoshop", "CapCut"],
  },
];

const filterLabels = ["All", "AI Agents", "Workflows & Automation", "Web Apps", "Marketing", "Websites"];

// ---- PAGE ----

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<(typeof projectSections[0]["projects"][0]) | null>(null);

  const visibleSections = filter === "All" ? projectSections : projectSections.filter((s) => s.label === filter);

  return (
    <>
      {/* HERO */}
      <section id="hero" className="hero-section">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5" />
              </svg>
              Available for new projects
            </div>
            <h1 className="hero-name">John Lemuel<br />Culinares</h1>
            <p className="hero-title">AI Automation Specialist · Claude Expert · Workflow Engineer</p>
            <p className="hero-bio">
              I build production AI systems for real businesses. Agents, automations, and data pipelines that run live and deliver measurable results. Every system I ship is documented so the client's team can operate it without me.
            </p>
            <div className="hero-ctas">
              <a href="#projects" className="btn-primary">
                See My Work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#contact" className="btn-secondary">
                Get in Touch
              </a>
            </div>
          </div>
          <div className="hero-photo-wrap">
            <img
              className="hero-photo"
              src={`${BASE}/images/avatar.png`}
              alt="John Lemuel Culinares"
            />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-block">
              <div className="stat-value" style={{ color: "var(--accent)" }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-tag">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="section section-alt">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-text">
              <div className="section-eyebrow">About</div>
              <h2>I turn business problems into AI systems that actually work.</h2>
              <p>
                I'm an AI Automation Specialist and Claude expert based in the Philippines. I work with founders and ops teams to replace manual workflows with AI agents, automations, and data pipelines. My focus is production output, not demos.
              </p>
              <p>
                Over the past four years I've worked across AI integration, marketing operations, and customer success. Today I spend most of my time working with Claude API, building MCP servers, and wiring together systems with n8n, Python, and Supabase.
              </p>
              <p>
                Every system I ship gets documented. When a project ends, the team can run it without me.
              </p>
              <div className="about-tags">
                {["Philippines", "Full-Time Remote", "U.S. Hours Overlap", "English Fluent"].map((t) => (
                  <span key={t} className="card-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="about-photo-wrap">
              <img src={`${BASE}/images/avatar.png`} alt="John Lemuel Culinares" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Featured Work</div>
          <h2 className="section-heading">Systems built for real clients</h2>
          <p className="section-sub">Three projects that represent the kind of work I do: data-heavy, AI-powered, and built to run in production.</p>
          <div className="featured-grid">
            {featured.map((p) => (
              <div key={p.title} className="proj-card">
                <img className="proj-img" src={p.img} alt={p.title} />
                <div className="proj-body">
                  <div className="proj-title">{p.title}</div>
                  <div className="proj-desc">{p.desc}</div>
                  <div className="tag-row">
                    {p.tags.map((t) => (
                      <span key={t} className={`tag ${p.color}`}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT METRICS */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-eyebrow">Impact</div>
          <h2 className="section-heading">Results across clients</h2>
          <p className="section-sub">Numbers pulled directly from client deliverables and reporting.</p>
          <div className="metrics-grid">
            {metrics.map((m) => (
              <div key={m.label} className="metric-card">
                <div className="metric-number" style={{ color: "var(--accent)" }}>{m.n}</div>
                <div className="metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PROJECTS */}
      <section id="projects" className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Projects</div>
          <h2 className="section-heading">Everything I've built</h2>
          <p className="section-sub">AI agents, workflow automations, web apps, and marketing campaigns.</p>

          <div className="filter-bar">
            {filterLabels.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {visibleSections.map((section) => (
            <div key={section.label} style={{ marginBottom: "3rem" }}>
              <h3 style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-subtle)", marginBottom: "1.25rem" }}>
                {section.label}
                <span style={{ marginLeft: "0.5rem", color: "var(--accent)", background: "var(--accent-glow)", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.68rem", textTransform: "none", letterSpacing: 0 }}>
                  {section.projects.length}
                </span>
              </h3>
              <div className="projects-grid">
                {section.projects.map((p) => (
                  <div key={p.title} className="proj-card" onClick={() => setSelected(p)} style={{ cursor: "pointer" }}>
                    <img className="proj-img" src={p.img} alt={p.title} />
                    <div className="proj-body">
                      <div className="proj-title">{p.title}</div>
                      <div className="proj-desc">{p.desc}</div>
                      <div className="tag-row">
                        {p.tags.map((t) => (
                          <span key={t} className={`tag ${p.color}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section section-alt">
        <div className="section-inner">
          <div className="section-eyebrow">Experience</div>
          <h2 className="section-heading">Work history</h2>
          <p className="section-sub">Eight roles across AI automation, marketing, and customer operations.</p>

          <div className="exp-list">
            {experiences.map((exp, i) => (
              <div key={i} className="exp-card">
                <div>
                  <div className="exp-role">{exp.role}</div>
                  <div className="exp-company">{exp.company}</div>
                  <ul className="exp-highlights">
                    {exp.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </ul>
                </div>
                <div className="exp-meta">
                  <span className={`badge ${exp.status === "current" ? "badge-current" : "badge-prev"}`}>
                    {exp.status === "current" ? "Current" : "Completed"}
                  </span>
                  <span className="exp-period">{exp.period}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <h3 style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-subtle)", marginTop: "3rem", marginBottom: "1.25rem" }}>
            Certifications
          </h3>
          <div className="certs-grid">
            <div className="cert-card">
              <img src={`${BASE}/images/certs/certifications.png`} alt="Google Certification" />
              <div className="cert-info">
                <h4>Google Analytics Certification</h4>
                <p>Google · Oct 2025 – Oct 2026</p>
              </div>
            </div>
            <div className="cert-card">
              <img src={`${BASE}/images/certs/certifications.png`} alt="Google Certification" />
              <div className="cert-info">
                <h4>Google Ads Search Certification</h4>
                <p>Google · Oct 2025 – Oct 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS & TOOLS */}
      <section id="skills" className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Skills & Tools</div>
          <h2 className="section-heading">Tech stack</h2>
          <p className="section-sub">Tools I use in real projects, not just things I've heard of.</p>

          <div className="tools-sections">
            {toolGroups.map((group) => (
              <div key={group.label}>
                <div className="tool-group-label">{group.label}</div>
                <div className="tool-pills">
                  {group.tools.map((t) => (
                    <span key={t} className="tool-pill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section section-alt">
        <div className="section-inner" style={{ textAlign: "center" }}>
          <div className="section-eyebrow">Contact</div>
          <h2 className="section-heading">Let's work together</h2>
          <p className="section-sub" style={{ margin: "0 auto 2.5rem" }}>
            I'm open to project-based and full-time remote contracts. Philippines-based with strong U.S. hours overlap.
          </p>

          <div className="contact-grid-wrap">
            <a href="mailto:j.culinares06@gmail.com" className="contact-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span className="cc-label">Email</span>
              <span className="cc-value">j.culinares06@gmail.com</span>
              <span className="cc-link">Send email</span>
            </a>

            <a href="https://wa.me/639761172117" target="_blank" rel="noopener" className="contact-card">
              <svg viewBox="0 0 24 24" fill="var(--emerald)" stroke="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.557 4.112 1.528 5.836L0 24l6.29-1.496A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.963 9.963 0 0 1-5.138-1.418l-.368-.22-3.734.888.943-3.616-.24-.373A9.962 9.962 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              <span className="cc-label">WhatsApp</span>
              <span className="cc-value">+63 976 117 2117</span>
              <span className="cc-link">Message me</span>
            </a>

            <a href="https://linkedin.com/in/john-lemuel-culinares" target="_blank" rel="noopener" className="contact-card">
              <svg viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="cc-label">LinkedIn</span>
              <span className="cc-value">john-lemuel-culinares</span>
              <span className="cc-link">View profile</span>
            </a>

            <a href="https://johnlemuelc.github.io/Website-Portfolio/" target="_blank" rel="noopener" className="contact-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span className="cc-label">Portfolio</span>
              <span className="cc-value">johnlemuelc.github.io</span>
              <span className="cc-link">View portfolio</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <p>John Lemuel Culinares · AI Automation Specialist · Philippines</p>
      </footer>

      {/* PROJECT MODAL */}
      {selected && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "var(--surface)", borderRadius: "16px",
              maxWidth: "560px", width: "100%", padding: "2rem",
              boxShadow: "var(--shadow-lg)", position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute", top: "1rem", right: "1rem",
                background: "var(--surface-2)", border: "none", borderRadius: "50%",
                width: "28px", height: "28px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", color: "var(--text-muted)",
              }}
            >
              &times;
            </button>
            <img
              src={selected.img} alt={selected.title}
              style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", marginBottom: "1.25rem", background: "var(--surface-2)" }}
            />
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.65rem" }}>
              {selected.title}
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "1rem" }}>
              {selected.desc}
            </div>
            <div className="tag-row">
              {selected.tags.map((t) => (
                <span key={t} className={`tag ${selected.color}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
