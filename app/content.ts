// Shared by the main page and the /alt layout, so the two cannot drift.

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const BUILD = [
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

export const ABOUT: { k: string; v: string; art: "pin" | "globe" | "people" | "layers" }[] = [
  { k: "Based in", v: "Philippines, on UK and US hours", art: "pin" },
  { k: "Clients in", v: "the UK, the US and Australia", art: "globe" },
  { k: "Who I build for", v: "Agencies, property and real estate", art: "people" },
  { k: "How I work", v: "One person, first call to handover", art: "layers" },
];

export const STACK: { label: string; items: string }[] = [
  { label: "Agents and models", items: "Claude API, OpenAI, MCP servers, custom GPTs" },
  { label: "Voice", items: "Retell AI, Vapi, Twilio SMS" },
  { label: "Automation", items: "n8n, Make, Zapier, Google Apps Script" },
  { label: "Apps", items: "Next.js, React, TypeScript, tRPC, Python" },
  { label: "Data", items: "Supabase, PostgreSQL, MySQL, BigQuery, Sheets" },
  { label: "Platforms", items: "GoHighLevel, Zoho CRM, Pipedrive, Google Ads, Meta" },
];

export const PROOF: {
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

export const DELIVER = [
  { n: "01", title: "Find the bottleneck", body: "A call, then I go looking at where the time actually goes. Usually it is not the thing you think it is." },
  { n: "02", title: "Build the smallest version that works", body: "One workflow, one agent, one screen. Something you can judge in a week rather than a quarter." },
  { n: "03", title: "Test it against real data", body: "Edge cases, bad input, the call that goes sideways. If it cannot survive your worst Tuesday it is not finished." },
  { n: "04", title: "Hand it over documented", body: "SOPs and a walkthrough so your team runs it. When the project ends you are not tied to me." },
];

export const FAQ = [
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
