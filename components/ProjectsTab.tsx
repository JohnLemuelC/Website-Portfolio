"use client";

import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface Project {
  title: string;
  desc: string;
  tags: string[];
  img: string;
  color: string;
  details?: string;
}

interface Section {
  label: string;
  icon: React.ReactNode;
  projects: Project[];
}

const sections: Section[] = [
  {
    label: "AI Agents",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
    projects: [
      {
        title: "Google Ads MCP Server",
        desc: "Open-source MCP server enabling Claude/ChatGPT to query and manage Google Ads natively.",
        tags: ["MCP", "Python", "Google Ads API"],
        img: `${BASE}/images/projects/Google Ads MCP Server.png`,
        color: "emerald",
        details: "Built an MCP (Model Context Protocol) server that connects large language models like Claude and ChatGPT directly to Google Ads. This allows conversational querying of campaign performance, keyword data, and ad metrics without needing to navigate the Ads dashboard.",
      },
      {
        title: "AdLlama — AI Ads Platform",
        desc: "Next.js + Python platform for managing Google Ads via Claude-powered chat. Built Keyword Planner API & Ad Copy Validation.",
        tags: ["Next.js", "Python", "Claude API", "Google Ads"],
        img: `${BASE}/images/projects/Adllama-logo.png`,
        color: "violet",
        details: "Contributor to AdLlama, an AI-powered Google Ads management platform. Built the Keyword Planner API integration and the Ad Copy Validation layer that checks compliance, character limits, and CTA effectiveness before ads go live.",
      },
      {
        title: "Google Ads AI Agent",
        desc: "Custom GPT + MCP server pulling all Google Ads metrics conversationally.",
        tags: ["Custom GPT", "MCP", "Google Ads"],
        img: `${BASE}/images/projects/Gemini_Generated_Image_330ieb330ieb330i.png`,
        color: "cyan",
        details: "A conversational AI agent that connects to live Google Ads data. Users can ask natural language questions like 'What's my top performing campaign this week?' and get instant, accurate answers pulled directly from the Ads API.",
      },
      {
        title: "Ad Writing AI GPT",
        desc: "Self-learning agent writing Google Ad copy from live campaign data with CTA optimization.",
        tags: ["Custom GPT", "Google Ads", "AI"],
        img: `${BASE}/images/projects/Gemini_Generated_Image_dcpnjzdcpnjzdcpn.png`,
        color: "amber",
        details: "Custom GPT that generates platform-specific ad copy with strict character count enforcement and CTA optimization. Learns from live campaign performance data to continuously improve copy quality.",
      },
      {
        title: "AI Receptionist (ACE)",
        desc: "Voice AI agent for real estate lead qualification and appointment scheduling.",
        tags: ["Retell AI", "Voice AI", "Real Estate"],
        img: `${BASE}/images/projects/ACE.png`,
        color: "rose",
        details: "Built an AI-powered voice receptionist using Retell AI for a real estate company. Handles inbound calls, qualifies leads with targeted questions, and schedules appointments directly into the CRM calendar.",
      },
      {
        title: "Google Analytics AI Agent",
        desc: "Custom GPT + MCP server for GA4 data queries via natural language.",
        tags: ["Custom GPT", "MCP", "GA4"],
        img: `${BASE}/images/projects/Gemini_Generated_Image_rpkijmrpkijmrpki.png`,
        color: "emerald",
        details: "Connects Google Analytics 4 to a conversational interface. Users can query traffic, conversion, and audience data using natural language instead of navigating the complex GA4 reporting interface.",
      },
      {
        title: "Basecamp AI Agent",
        desc: "Full Basecamp workspace made conversational via MCP, with daily Slack briefings.",
        tags: ["Zapier", "ChatGPT", "Slack"],
        img: `${BASE}/images/projects/zapier-basecamp-chatgpt-slack.png`,
        color: "cyan",
        details: "Zapier-powered agent that processes Basecamp comments through ChatGPT, generates summaries, and posts daily briefings to Slack. Makes an entire Basecamp workspace queryable through conversation.",
      },
      {
        title: "Copy Chief AI",
        desc: "AI copywriting evaluator using a 7-criterion scoring rubric.",
        tags: ["AI", "Copywriting", "Evaluation"],
        img: `${BASE}/images/projects/Copy Chief.png`,
        color: "violet",
        details: "An AI-powered copy evaluation tool that scores ad copy against a 7-criterion rubric covering clarity, emotional impact, CTA strength, brand voice consistency, and more. Provides actionable feedback for improvement.",
      },
    ],
  },
  {
    label: "Workflows & Automation",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
    projects: [
      {
        title: "N8N Blog Automation",
        desc: "5-workflow system: keyword research to WordPress publishing, fully automated.",
        tags: ["N8N", "OpenAI", "Google Sheets", "WordPress"],
        img: `${BASE}/images/projects/n8n-workflows.png`,
        color: "emerald",
        details: "A comprehensive 5-workflow automation system that handles the entire blog content pipeline: keyword research, content brief generation, AI-powered writing, SEO optimization, and direct WordPress publishing with proper formatting.",
      },
      {
        title: "Video Production Workflow",
        desc: "File processing, AI audio generation, and status tracking pipeline.",
        tags: ["N8N", "AI Audio", "Render API"],
        img: `${BASE}/images/projects/n8n-video.png`,
        color: "cyan",
        details: "Automated video production pipeline handling file processing, AI-powered audio generation, rendering, and status tracking. Reduced manual video production time significantly.",
      },
      {
        title: "KPI Data Manager",
        desc: "Apps Script aggregating KPIs from LinkedIn, Meta, Bing, StackAdapt with Discord alerts.",
        tags: ["Apps Script", "APIs", "Discord"],
        img: `${BASE}/images/projects/apps-script.png`,
        color: "amber",
        details: "Google Apps Script solution that aggregates key performance indicators from multiple advertising platforms (LinkedIn, Meta, Bing, StackAdapt) into a single dashboard with automated Discord notifications for anomalies.",
      },
      {
        title: "FB Lead Capture Pipeline",
        desc: "Facebook Lead Ads to Google Sheets with automated email notifications.",
        tags: ["Zapier", "Facebook", "Sheets"],
        img: `${BASE}/images/projects/zapier-facebook-sheets-email.png`,
        color: "violet",
        details: "Zapier automation that captures leads from Facebook Lead Ad forms, logs them into Google Sheets for tracking, and triggers instant email notifications to the sales team.",
      },
      {
        title: "LinkedIn Ads to HubSpot",
        desc: "Routes LinkedIn leads and creates HubSpot engagement records automatically.",
        tags: ["Zapier", "LinkedIn", "HubSpot"],
        img: `${BASE}/images/projects/zapier-linkedin-hubspot.png`,
        color: "rose",
        details: "Automated pipeline that routes new LinkedIn advertising leads directly into HubSpot CRM, creating contact records and engagement entries for immediate sales team follow-up.",
      },
      {
        title: "Pipeline to Webinar Registration",
        desc: "Auto-registers contacts for Zoom when they reach a pipeline stage.",
        tags: ["Zapier", "CRM", "Zoom"],
        img: `${BASE}/images/projects/zapier-leadconnector-zoom.png`,
        color: "cyan",
        details: "When a prospect reaches a specific pipeline stage in the CRM, this automation automatically registers them for the next Zoom webinar and sends personalized confirmation details.",
      },
      {
        title: "Purchase to CRM Sync",
        desc: "Gumroad purchases automatically create LeadConnector contacts.",
        tags: ["Zapier", "Gumroad", "LeadConnector"],
        img: `${BASE}/images/projects/zapier-gumroad-leadconnector.png`,
        color: "amber",
        details: "Syncs Gumroad purchase data into LeadConnector CRM, creating new contacts with purchase details for automated follow-up sequences and customer nurturing.",
      },
      {
        title: "LinkedIn Lead Alert",
        desc: "Instant email notifications for new LinkedIn Lead Gen Form responses.",
        tags: ["Zapier", "LinkedIn", "Email"],
        img: `${BASE}/images/projects/zapier-linkedin-email.png`,
        color: "emerald",
        details: "Real-time email alerts triggered whenever a new lead submits a LinkedIn Lead Gen Form, ensuring zero response time delay for the sales team.",
      },
      {
        title: "Customer.io Email Automation",
        desc: "90-day nurture sequences, A/B tested outreach, re-engagement flows.",
        tags: ["Customer.io", "Email", "Automation"],
        img: `${BASE}/images/projects/CIO1.png`,
        color: "violet",
        details: "Designed and implemented comprehensive 90-day email nurture sequences in Customer.io with A/B tested subject lines, audience-segmented journeys, and re-engagement flows for inactive subscribers. Achieved 5.6% CTR.",
      },
    ],
  },
  {
    label: "Web Apps",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    projects: [
      {
        title: "Blog Automation Web App",
        desc: "Full UI for SEO-optimized blog content generation and management.",
        tags: ["Web App", "SEO", "AI"],
        img: `${BASE}/images/projects/blog-app.png`,
        color: "violet",
        details: "A web application with a complete UI for generating SEO-optimized blog content. Users can input topics, configure SEO parameters, and generate full articles with proper heading structure, meta descriptions, and keyword optimization.",
      },
      {
        title: "Canva Listing Automation",
        desc: "Real estate branded graphics from property data with batch CSV support.",
        tags: ["Web App", "Canva API", "Real Estate"],
        img: `${BASE}/images/projects/canva-listing.png`,
        color: "cyan",
        details: "Generates branded real estate listing graphics automatically from property data. Supports batch processing via CSV upload, creating consistent branded materials for multiple properties in minutes.",
      },
      {
        title: "Video AI Merger",
        desc: "6-step video pipeline with AI voiceovers and automated editing.",
        tags: ["Web App", "AI Voice", "Video"],
        img: `${BASE}/images/projects/video-merger.png`,
        color: "amber",
        details: "A 6-step automated video production pipeline that handles script generation, AI voiceover creation, clip selection, editing, rendering, and export. Dramatically reduces video production time.",
      },
    ],
  },
  {
    label: "Marketing Campaigns",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    projects: [
      {
        title: "Synergy Data Investments",
        desc: "200+ marketing assets, 30% engagement increase, 28 deals closed.",
        tags: ["Marketing", "Content", "Investment"],
        img: `${BASE}/images/projects/marketing-sdi.png`,
        color: "rose",
        details: "Created 200+ professional marketing assets including investor presentations, social media content, email campaigns, and branded collateral. Achieved 30% engagement increase and contributed to closing 28 investment deals.",
      },
      {
        title: "Synergy Estates",
        desc: "62% faster production, 91% on-time delivery rate achieved.",
        tags: ["Marketing", "Real Estate", "Content"],
        img: `${BASE}/images/projects/marketing-synergy-estates.png`,
        color: "emerald",
        details: "Led marketing content production for a property investment platform. Achieved 62% faster production turnaround and 91% on-time delivery through optimized workflows and template systems.",
      },
      {
        title: "Metalkin Australia (Liquoroo)",
        desc: "168 leads generated, 54 meetings booked, 5 deals closed.",
        tags: ["Marketing", "Lead Gen", "B2B"],
        img: `${BASE}/images/projects/marketing-metalkin.png`,
        color: "violet",
        details: "Ran comprehensive B2B marketing campaigns generating 168 qualified leads, booking 54 meetings with decision-makers, and closing 5 enterprise deals. Included weekly performance and budget reporting.",
      },
      {
        title: "Aljay Agro-Industrial (YFarmers)",
        desc: "70K Facebook likes in 3 months, 40% Instagram growth, 95 sign-ups.",
        tags: ["Marketing", "Social Media", "Agriculture"],
        img: `${BASE}/images/projects/marketing-yfarmers.png`,
        color: "cyan",
        details: "Built social media presence from scratch to 70K Facebook likes in just 3 months. Grew Instagram following by 40%, generated 95 platform sign-ups, and increased branded search volume by 28%.",
      },
    ],
  },
  {
    label: "Websites",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    projects: [
      {
        title: "Synergy Data Investments Website",
        desc: "Investment company site with portfolios, investor tools, and guides.",
        tags: ["Website", "Finance", "WordPress"],
        img: `${BASE}/images/projects/webdesign-sdi.png`,
        color: "amber",
        details: "Designed and built a professional website for an investment company featuring portfolio showcases, investor tools, educational guides, and lead capture forms optimized for conversion.",
      },
      {
        title: "Synergy Estates Website",
        desc: "Property investment platform with UK News, rankings, and guides.",
        tags: ["Website", "Real Estate", "WordPress"],
        img: `${BASE}/images/projects/webdesign-synergy.png`,
        color: "rose",
        details: "Built a comprehensive property investment platform featuring UK property news, area rankings, investment guides, and property listing pages with advanced search functionality.",
      },
    ],
  },
];

export default function ProjectsTab() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");

  const allLabels = ["All", ...sections.map((s) => s.label)];
  const visibleSections = filter === "All" ? sections : sections.filter((s) => s.label === filter);

  return (
    <>
      <div className="kanban-header">
        <h2 className="kanban-title">Projects</h2>
        <div className="kanban-filter">
          {allLabels.map((c) => (
            <button
              key={c}
              className={`filter-pill ${filter === c ? "active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {visibleSections.map((section, si) => (
        <div key={si} className="section-block">
          <div className="section-label">
            {section.icon}
            {section.label}
            <span style={{
              marginLeft: "0.5rem",
              fontSize: "0.65rem",
              fontWeight: 600,
              background: "rgba(59, 130, 246, 0.15)",
              color: "var(--accent)",
              padding: "0.1rem 0.5rem",
              borderRadius: "10px",
              letterSpacing: "0",
              textTransform: "none",
            }}>
              {section.projects.length}
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}>
            {section.projects.map((p, pi) => (
              <div key={pi} className="kanban-card" onClick={() => setSelected(p)}>
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
      ))}

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            <img className="modal-img" src={selected.img} alt={selected.title} />
            <div className="modal-title">{selected.title}</div>
            <div className="modal-desc">{selected.details || selected.desc}</div>
            <div className="modal-tags">
              {selected.tags.map((t) => (
                <span key={t} className={`card-tag ${selected.color}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
