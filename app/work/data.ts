const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export type Project = {
  title: string;
  desc: string;
  /** what the build contains, countable by opening it. not a tracked outcome. */
  scale?: string;
  tags: string[];
  img: string;
  images?: string[];
  color: string;
  demo?: string;
  casestudy?: string;
  audio?: string;
};

export const projectSections: { label: string; projects: Project[] }[] = [
  {
    label: "Workflows & Automation",
    projects: [
      {
        title: "N8N Blog Automation",
        desc: "5-workflow system: keyword research to WordPress publishing, fully automated.",
        scale: "5 workflows, research to published",
        tags: ["N8N", "OpenAI", "WordPress"],
        img: `${BASE}/images/projects/n8n-workflows.png`,
        color: "emerald",
      },
      {
        title: "KPI Data Manager",
        desc: "Apps Script aggregating KPIs from LinkedIn, Meta, Bing, StackAdapt with Discord alerts.",
        scale: "4 ad platforms, alerts to Discord",
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
        scale: "90-day nurture, A/B tested",
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
        scale: "3 deal stages mapped to conversions",
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
    label: "AI Agents",
    projects: [
      {
        title: "Google Ads MCP Server",
        desc: "Open-source MCP server enabling Claude/ChatGPT to query and manage Google Ads natively.",
        scale: "Open source, any MCP client",
        tags: ["MCP", "Python", "Google Ads API"],
        img: `${BASE}/images/projects/Google Ads MCP Server.png`,
        color: "emerald",
      },
      {
        title: "AdLlama",
        desc: "Next.js + Python platform for managing Google Ads via Claude-powered chat. Built Keyword Planner API and Ad Copy Validation.",
        scale: "Keyword Planner API and ad copy validation",
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
        title: "ACE AI Receptionist",
        desc: "Voice AI agent for real estate lead qualification and appointment scheduling.",
        scale: "24/7, qualifies and books",
        tags: ["Retell AI", "Voice AI", "Real Estate"],
        img: `${BASE}/images/projects/ACE.png`,
        color: "rose",
      },
      {
        title: "Grace Inbound AI Receptionist",
        desc: "24/7 inbound voice AI agent for a land buying company. GRACE handles incoming seller calls, qualifies leads in real time, and books appointments without human intervention.",
        scale: "24/7, inbound seller calls",
        tags: ["Retell AI", "Voice AI", "Inbound", "Land Buying"],
        img: `${BASE}/images/projects/Grace.png`,
        color: "rose",
      },
      {
        title: "Sarah Outbound AI Receptionist",
        desc: "Outbound AI calling agent for a land buying company. SARAH proactively pre-qualifies seller leads via automated calls and follows up with SMS to keep every lead engaged.",
        scale: "Outbound calls with SMS follow-up",
        tags: ["Retell AI", "Voice AI", "Outbound", "SMS"],
        img: `${BASE}/images/projects/Sarah.png`,
        color: "violet",
        audio: `${BASE}/audio/ai-receptionist-sample.mp3`,
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
        scale: "Whole workspace, daily Slack briefing",
        tags: ["Zapier", "ChatGPT", "Slack"],
        img: `${BASE}/images/projects/zapier-basecamp-chatgpt-slack.png`,
        color: "cyan",
      },
      {
        title: "Copy Chief AI",
        desc: "AI copywriting evaluator using a 7-criterion scoring rubric.",
        scale: "7 criteria, scored separately",
        tags: ["Claude API", "Copywriting", "Evaluation"],
        img: `${BASE}/images/projects/copy-chief.png`,
        color: "violet",
      },
    ],
  },
  {
    label: "Web Apps",
    projects: [
      {
        title: "Housing Portal + Zoho CRM Sync",
        desc: "Client portal built onto a UK property group's existing site, kept in step with Zoho CRM in both directions. Owners submit properties, care providers shortlist and request viewings, and records stop being typed twice. 650+ automated tests.",
        scale: "650+ tests, 264 records to 252",
        tags: ["TypeScript", "React", "tRPC", "Zoho CRM", "MySQL", "Railway"],
        img: `${BASE}/images/projects/housing-portal.svg`,
        color: "cyan",
        casestudy: `${BASE}/demos/housing-portal-casestudy.html`,
      },
      {
        title: "Marketing Dashboard",
        desc: "Multi-channel analytics platform for a 187-account agency. Unified 5 ad platforms + 3 SEO sources into a cloud warehouse with 25 analysis views, budget pacing, wasted-spend detection, and AI-powered querying.",
        scale: "187 accounts, 8 sources",
        tags: ["Next.js", "BigQuery", "TypeScript", "Python"],
        img: `${BASE}/images/projects/marketing-sdi.png`,
        color: "cyan",
        demo: `${BASE}/demos/marketing-dashboard-demo.html`,
        casestudy: `${BASE}/demos/marketing-dashboard-casestudy.html`,
      },
      {
        title: "GHL Dashboard",
        desc: "Custom GoHighLevel CRM setup for a real estate company. Includes automated pre-qualification workflows, a multi-step form builder, and tailored custom fields to track and convert inbound leads.",
        scale: "Pre-qual workflows, form builder, custom fields",
        tags: ["GoHighLevel", "CRM", "Automation", "Real Estate"],
        img: `${BASE}/images/projects/ghl/01_workflows_clean.png`,
        images: [
          `${BASE}/images/projects/ghl/01_workflows_clean.png`,
          `${BASE}/images/projects/ghl/02_prequal_workflows_clean.png`,
          `${BASE}/images/projects/ghl/03_builder_clean.png`,
          `${BASE}/images/projects/ghl/05_custom_fields_clean.png`,
        ],
        color: "violet",
      },
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
        scale: "6-step pipeline, voiceover to cut",
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
export const demos = [
  {
    title: "Marketing Dashboard",
    desc: "Multi-channel analytics for a 187-account agency. Switch accounts, change date ranges, sort and filter campaigns, and hover the spend chart.",
    scale: "187 accounts, 8 sources",
    href: `${BASE}/demos/marketing-dashboard-demo.html`,
    shot: `${BASE}/images/demos/marketing-dashboard.webp`,
    tag: { label: "Analytics", color: "cyan" },
    from: "#0891B2",
    to: "#0e7490",
    icon: "chart",
  },
  {
    title: "Upwork Lead Dashboard",
    desc: "Lead tracking dashboard with job filtering, proposal drafting, and pipeline management. Click around, filter jobs, and draft a proposal.",
    scale: "Filter, draft, track in one place",
    href: `${BASE}/demos/upwork-lead-dashboard-demo.html`,
    shot: `${BASE}/images/demos/upwork-lead.webp`,
    tag: { label: "Lead Management", color: "emerald" },
    from: "#059669",
    to: "#047857",
    icon: "target",
  },
  {
    title: "Law Firm Lead Dashboard",
    desc: "Full lead management system for a law firm: intake tracking, case pipeline, conversion rates, and performance charts across practice areas.",
    scale: "4 views across practice areas",
    href: `${BASE}/demos/law-firm-lead-dashboard.html`,
    shot: `${BASE}/images/demos/law-firm.webp`,
    tag: { label: "Legal Tech", color: "violet" },
    from: "#2E3192",
    to: "#4150B5",
    icon: "scale",
  },
  {
    title: "Prism Marketing Dashboard",
    desc: "Social content generation, AI image studio, content calendar, multi-platform ad tracking, and SEO analysis in one dashboard. All tabs are fully interactive.",
    scale: "5 tools in one dashboard",
    href: `${BASE}/demos/prism-marketing-dashboard.html`,
    shot: `${BASE}/images/demos/prism.webp`,
    tag: { label: "Social & Ads", color: "violet" },
    from: "#6366F1",
    to: "#06B6D4",
    icon: "monitor",
  },
  {
    title: "AI Receptionist Dashboard",
    desc: "Real-time call monitoring, lead pipeline, and AI agent performance tracking for a land buying company. Explore live calls, transcripts, and conversion metrics.",
    href: `${BASE}/demos/cascade-land-buyers-dashboard-demo.html`,
    shot: `${BASE}/images/demos/ai-receptionist.webp`,
    tag: { label: "Voice AI", color: "violet" },
    from: "#6d28d9",
    to: "#8b5cf6",
    icon: "bot",
  },
];
