"use client";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const toolGroups = [
  {
    label: "Automation & AI",
    tools: [
      { name: "Claude Code", img: `${BASE}/images/tools/Claude Code.png` },
      { name: "OpenAI", img: `${BASE}/images/tools/OpenAI Logo.jpg` },
      { name: "Retell AI", img: `${BASE}/images/tools/Retell-AI-Logo.png` },
      { name: "AdLlama", img: `${BASE}/images/projects/Adllama-logo.png` },
      { name: "Twilio", img: `${BASE}/images/tools/twilio logo.jpg` },
    ],
  },
  {
    label: "Development",
    tools: [
      { name: "Python", img: `${BASE}/images/tools/Python logo.jpg` },
      { name: "Node.js", img: `${BASE}/images/tools/node js logo.jpg` },
      { name: "Next.js / React", img: `${BASE}/images/tools/Next.js_React logo.png` },
      { name: "HTML/CSS", img: `${BASE}/images/tools/tool-htmlcss.png` },
      { name: "GitHub", img: `${BASE}/images/tools/github logo.png` },
      { name: "Supabase", img: `${BASE}/images/tools/supabase-logo.png` },
      { name: "Vercel", img: `${BASE}/images/tools/Vercel-Logo.jpg` },
      { name: "Railway", img: `${BASE}/images/tools/railway logo.png` },
      { name: "WordPress", img: `${BASE}/images/tools/tool-wordpress.png` },
    ],
  },
  {
    label: "Marketing & Ads",
    tools: [
      { name: "Google Ads", img: `${BASE}/images/tools/google ads logo.jpg` },
      { name: "Google Analytics", img: `${BASE}/images/tools/google analytics logo.jpg` },
      { name: "Meta Business", img: `${BASE}/images/tools/tool-meta.png` },
      { name: "Mailchimp", img: `${BASE}/images/tools/tool-mailchimp.png` },
      { name: "Customer.io", img: `${BASE}/images/tools/CIO.png` },
      { name: "Unbounce", img: `${BASE}/images/tools/unbounce-logo.png` },
    ],
  },
  {
    label: "CRM & Sales",
    tools: [
      { name: "Salesforce", img: `${BASE}/images/tools/tool-salesforce.png` },
      { name: "Respond.io", img: `${BASE}/images/tools/tool-respondio.png` },
    ],
  },
  {
    label: "Productivity & Communication",
    tools: [
      { name: "Google Suite", img: `${BASE}/images/tools/tool-gsuite.png` },
      { name: "Microsoft 365", img: `${BASE}/images/tools/tool-microsoft.png` },
      { name: "Slack", img: `${BASE}/images/tools/slack logo.jpg` },
      { name: "Discord", img: `${BASE}/images/tools/Discord-logo.jpg` },
      { name: "Basecamp", img: `${BASE}/images/tools/tool-basecamp.jpg` },
      { name: "Monday.com", img: `${BASE}/images/tools/tool-monday.png` },
      { name: "Wrike", img: `${BASE}/images/tools/Wrike_logo_2020.png` },
      { name: "Calendly", img: `${BASE}/images/tools/Calendly.png` },
      { name: "Outlook", img: `${BASE}/images/tools/Outlook.com-Logo.wine.png` },
    ],
  },
  {
    label: "Design & Content",
    tools: [
      { name: "Canva", img: `${BASE}/images/tools/tool-canva.png` },
      { name: "Photoshop", img: `${BASE}/images/tools/tool-photoshop.png` },
      { name: "CapCut", img: `${BASE}/images/tools/tool-capcut.jpg` },
    ],
  },
  {
    label: "Hospitality",
    tools: [
      { name: "Guesty", img: `${BASE}/images/tools/tool-guesty.png` },
      { name: "Airbnb", img: `${BASE}/images/tools/tool-airbnb.png` },
      { name: "Booking.com", img: `${BASE}/images/tools/tool-booking.png` },
    ],
  },
];

export default function ToolsTab() {
  return (
    <>
      <div className="page-header">
        <h1 className="kanban-title" style={{ fontSize: "1.15rem" }}>Skills & Tools</h1>
        <p className="page-subtitle" style={{ fontSize: "0.85rem" }}>
          Technologies and platforms I work with daily.
        </p>
      </div>

      {toolGroups.map((group, gi) => (
        <div key={gi} className="section-block">
          <div className="section-label">{group.label}</div>
          <div className="tools-grid">
            {group.tools.map((tool, ti) => (
              <div key={ti} className="tool-item">
                <img src={tool.img} alt={tool.name} />
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
