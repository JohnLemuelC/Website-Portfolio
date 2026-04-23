"use client";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const experiences = [
  {
    role: "AI & Automation Specialist",
    company: "Contract / Project-Based",
    period: "2025 - Present",
    status: "current",
    highlights: [
      "Central KPI Datahub aggregating LinkedIn, Meta, and Bing ad performance",
      "MCP servers for Google Ads, GA4, and Search Console exposing live data to AI agents",
      "5-workflow n8n blog automation pipeline (keyword research → WordPress)",
      "AdLlama contributions — Next.js + Python Google Ads platform",
      "Pipedrive CRM integrations and automated weekly Google Ads client check-ins",
      "WordPress lead capture automations and monthly reporting pipelines",
    ],
  },
  {
    role: "AI Integration Specialist",
    company: "Contract / Project-Based",
    period: "2025",
    status: "prev",
    highlights: [
      "Company AI — centralized team knowledge system with conversation classification",
      "Copy Chief — AI copywriting evaluator using a 7-criterion scoring rubric",
      "AdLoop — Meta Ads + Triple Whale + Funnelish dashboard with SCALE/KILL/ITERATE analysis",
      "Funnel generator and Calendar tracker with jobstopper detection",
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
      "AI Receptionist — 24/7 voice AI agent for real estate lead qualification",
      "GoHighLevel (GHL) integrations for automated lead capture and CRM sync",
      "Automated GHL lead collection routing contacts into nurture sequences",
      "Automated daily reporting delivered via Slack digests",
      "n8n workflows on VPS for webhook processing and cross-tool automation",
      "Slack and Discord bots for team digests, jobstopper detection, and notifications",
    ],
  },
  {
    role: "Marketing Associate",
    company: "Synergy Data Investments (Remote)",
    period: "2024 - 2025",
    status: "prev",
    highlights: [
      "Created 200+ professional marketing assets",
      "Built email nurture journeys in Customer.io & Mailchimp",
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
      "Managed ~20 daily inquiries with <1-hour first response",
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
      "Authored macros and SOPs for the team",
    ],
  },
  {
    role: "Marketing Assistant",
    company: "Metalkin Australia (Remote)",
    period: "2022 - 2023",
    status: "prev",
    highlights: [
      "Generated 168 leads, booked 54 meetings, closed 5 deals",
      "Weekly performance and budget reports",
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
      "40% Instagram growth, 95 average sign-ups",
      "Branded search volume up 28%",
      "65% increase in profile visits",
    ],
  },
];

const certs = [
  { name: "Google Analytics Certification", issuer: "Google", date: "Oct 2025 - Oct 2026" },
  { name: "Google Ads Search Certification", issuer: "Google", date: "Oct 2025 - Oct 2026" },
];

export default function ExperienceTab() {
  return (
    <>
      <div className="page-header">
        <h1 className="kanban-title" style={{ fontSize: "1.15rem" }}>Work Experience</h1>
      </div>

      <div className="list-view section-block">
        {experiences.map((exp, i) => (
          <div key={i} className="list-item" style={{ alignItems: "flex-start", padding: "1.25rem" }}>
            <div
              className={`list-status ${exp.status === "current" ? "active" : "completed"}`}
              style={{ marginTop: "0.4rem" }}
            />
            <div className="list-content">
              <div className="list-title">{exp.role}</div>
              <div className="list-subtitle">{exp.company}</div>
              <ul style={{
                marginTop: "0.5rem",
                paddingLeft: "1rem",
                listStyle: "disc",
              }}>
                {exp.highlights.map((h, hi) => (
                  <li key={hi} style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.2rem", lineHeight: "1.5" }}>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: "0.3rem" }}>
              <span className={`list-badge ${exp.status === "current" ? "current" : "prev"}`}>
                {exp.status === "current" ? "Current" : "Completed"}
              </span>
              <span className="list-meta">{exp.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="section-block">
        <div className="section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15l-2 5l1.5-3h1l1.5 3l-2-5z" />
            <circle cx="12" cy="9" r="6" />
          </svg>
          Certifications
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="cert-card">
            <img src={`${BASE}/images/certs/certifications.png`} alt="Google Certs" />
            <div className="cert-info">
              <h4>{certs[0].name}</h4>
              <p>{certs[0].issuer} &middot; {certs[0].date}</p>
            </div>
          </div>
          <div className="cert-card">
            <img src={`${BASE}/images/certs/certifications.png`} alt="Google Certs" />
            <div className="cert-info">
              <h4>{certs[1].name}</h4>
              <p>{certs[1].issuer} &middot; {certs[1].date}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
