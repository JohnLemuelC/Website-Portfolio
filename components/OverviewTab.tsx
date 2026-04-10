"use client";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const stats = [
  { label: "Years Experience", value: "4+", tag: "Since 2021", color: "var(--accent)" },
  { label: "Assets Created", value: "200+", tag: "Marketing & Content", color: "var(--cyan)" },
  { label: "Faster Turnaround", value: "62%", tag: "Production Speed", color: "var(--emerald)" },
  { label: "FB Likes Grown", value: "70K", tag: "In 3 Months", color: "var(--amber)" },
];

const highlights = [
  { number: "58%", label: "Admin Time Reduced" },
  { number: "42%", label: "Fewer Missed Follow-ups" },
  { number: "5.6%", label: "Email CTR" },
  { number: "91%", label: "On-Time Delivery" },
  { number: "90%+", label: "CSAT Score" },
  { number: "28", label: "Deals Closed" },
  { number: "168", label: "Leads Generated" },
  { number: "94%", label: "Customer Satisfaction" },
];

const featured = [
  {
    title: "Google Ads MCP Server",
    desc: "Open-source MCP server enabling Claude/ChatGPT to query and manage Google Ads natively.",
    tags: ["MCP", "Python", "Google Ads API"],
    img: `${BASE}/images/projects/Google Ads MCP Server.png`,
    color: "emerald",
  },
  {
    title: "AdLlama — AI Ads Platform",
    desc: "Next.js + Python platform for managing Google Ads via Claude-powered chat.",
    tags: ["Next.js", "Python", "Claude API"],
    img: `${BASE}/images/projects/Adllama-logo.png`,
    color: "violet",
  },
  {
    title: "N8N Blog Automation",
    desc: "5-workflow system automating the full blog pipeline from keyword research to WordPress publishing.",
    tags: ["N8N", "OpenAI", "WordPress"],
    img: `${BASE}/images/projects/n8n-workflows.png`,
    color: "cyan",
  },
];

export default function OverviewTab({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <>
      {/* Hero Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--accent)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
            Automation & AI Systems Engineer
          </span>
        </div>
        <h1 className="page-title">
          Transforming Manual Work into <span style={{ color: "var(--accent)" }}>Automated Systems</span>
        </h1>
        <p className="page-subtitle">
          Building workflow automations, AI agents, and marketing systems that eliminate manual work and drive measurable outcomes.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-tag" style={{ background: `${s.color}15`, color: s.color }}>{s.tag}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="about-split">
        <img className="about-photo" src={`${BASE}/images/headshot/profile.png`} alt="John Lemuel" />
        <div className="about-text">
          <h3>About Me</h3>
          <p>
            I specialize in building automation systems that eliminate repetitive tasks and create operational efficiency.
            From multi-step N8N workflows to custom web applications, I transform complex manual processes into streamlined, reliable systems.
          </p>
          <p>
            Beyond automation, I bring extensive marketing experience &mdash; creating 200+ professional content assets, running social media campaigns,
            and designing investor-facing materials that drive real business results. Google certified in Analytics and Ads Search.
          </p>
          <div className="about-tags">
            {["N8N & Zapier", "AI Agents", "Google Ads MCP", "Marketing Ops", "Web Apps", "Retell AI"].map((t) => (
              <span key={t} className="card-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="section-block">
        <div className="kanban-header">
          <h2 className="kanban-title">Featured Projects</h2>
          <button
            className="filter-pill active"
            onClick={() => onNavigate("projects")}
          >
            View All Projects &rarr;
          </button>
        </div>
        <div className="kanban-board">
          {featured.map((p, i) => (
            <div key={i} className="kanban-card">
              <img className="kanban-card-img" src={p.img} alt={p.title} />
              <div className="kanban-card-title">{p.title}</div>
              <div className="kanban-card-desc">{p.desc}</div>
              <div className="kanban-card-tags">
                {p.tags.map((t) => (
                  <span key={t} className={`card-tag ${p.color}`}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="section-block">
        <div className="section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          Impact Metrics
        </div>
        <div className="results-grid">
          {highlights.map((h, i) => (
            <div key={i} className="result-card">
              <div className="result-number" style={{ color: i % 2 === 0 ? "var(--accent)" : "var(--cyan)" }}>{h.number}</div>
              <div className="result-label">{h.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
