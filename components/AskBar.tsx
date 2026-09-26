"use client";

import { useEffect, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Msg = { role: "you" | "bot"; text: string };

const ANSWERS: { keys: string[]; text: string }[] = [
  {
    keys: ["available", "availability", "start", "hire", "free", "capacity", "book"],
    text: "Available now, up to 40 hours a week. I work 1PM to 9PM UK time, which is 8AM to 4PM US Eastern. Email j.culinares06@gmail.com and we can talk this week.",
  },
  {
    keys: ["rate", "cost", "price", "pricing", "budget", "charge", "fee", "much"],
    text: "Depends on scope. I work either on a project rate agreed before anything starts, or hourly against a capped budget. Tell me the problem and I will price it properly rather than guess.",
  },
  {
    keys: ["voice", "receptionist", "retell", "call", "phone", "answering"],
    text: "I have three voice agents running in production on Retell AI. One handles inbound real estate qualification, one takes inbound seller calls for a land buying company, and one runs outbound pre-qualification with SMS follow-up. There is a recorded sample call in the Proof section.",
  },
  {
    keys: ["n8n", "zapier", "make", "workflow", "automation", "automate", "pipeline"],
    text: "This is most of my work. Self-hosted n8n on a VPS for anything complex, Zapier or Make when a client wants something they can maintain. Recent builds include a 5-workflow content pipeline and an 18-node candidate scoring workflow.",
  },
  {
    keys: ["crm", "ghl", "gohighlevel", "zoho", "pipedrive", "hubspot", "salesforce"],
    text: "GoHighLevel and Zoho CRM mostly, plus Pipedrive. I have built full GHL sub-accounts with pipelines, smart forms and missed-call text-back, and a two-way Zoho sync with conflict handling and 650+ automated tests behind it.",
  },
  {
    keys: ["dashboard", "report", "data", "analytics", "bigquery", "metrics"],
    text: "I build reporting that makes the decision, not just the chart. Examples: a 187-account marketing dashboard across 5 ad platforms, a daily MER engine normalising spend to EUR, and an ad system that returns SCALE, KILL or ITERATE per ad.",
  },
  {
    keys: ["stack", "tech", "tools", "language", "python", "typescript"],
    text: "Python and TypeScript, Next.js and React, Supabase, PostgreSQL and MySQL, Railway for hosting. On the AI side: Claude API, OpenAI, Retell AI, MCP servers, and n8n for orchestration.",
  },
  {
    keys: ["where", "based", "location", "timezone", "time zone", "remote", "hours"],
    text: "Philippines, fully remote. I work 1PM to 9PM UK time, so there is solid overlap with both the UK and US Eastern.",
  },
  {
    keys: ["experience", "years", "background", "who", "about"],
    text: "Four years building AI and automation systems, after a run in marketing and customer operations. Clients have been UK and US based, in real estate, land acquisition, e-commerce and marketing agencies.",
  },
  {
    keys: ["cv", "resume", "portfolio"],
    text: `The full CV is at ${BASE || ""}/cv.html with every project and role on it. Ask about any of them.`,
  },
  {
    keys: ["contact", "email", "reach", "talk", "whatsapp"],
    text: "Email j.culinares06@gmail.com or WhatsApp +63 976 117 2117. I answer same day during UK hours.",
  },
];

const SUGGESTIONS = ["What do you build?", "Are you available?", "What does it cost?", "Where are you based?"];

const FALLBACK =
  "I do not have a saved answer for that one. Email j.culinares06@gmail.com with the detail and John will come back to you the same day.";

const reply = (q: string) => {
  const s = q.toLowerCase();
  let best: { score: number; text: string } | null = null;
  for (const a of ANSWERS) {
    const score = a.keys.reduce((n, k) => (s.includes(k) ? n + k.length : n), 0);
    if (score > 0 && (!best || score > best.score)) best = { score, text: a.text };
  }
  if (best) return best.text;
  if (s.includes("build") || s.includes("do you do") || s.includes("services"))
    return "Four things: AI and automation, custom software, integrations, and turning data into decisions. The What I build section breaks each one down.";
  return FALLBACK;
};

export default function AskBar() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setOpen(true);
    setValue("");
    setMsgs((m) => [...m, { role: "you", text: q }]);
    window.setTimeout(() => setMsgs((m) => [...m, { role: "bot", text: reply(q) }]), 260);
  };

  return (
    <div className={`askbar${open ? " is-open" : ""}`}>
      {open && (
        <div className="ask-panel">
          <div className="ask-panel-head">
            <span className="ask-dot" />
            AskJohn
            <span className="ask-note">saved answers, not a live model</span>
            <button onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>
          <div className="ask-body" ref={bodyRef}>
            {msgs.length === 0 && <p className="ask-empty">Ask about the work, the stack, availability or rates.</p>}
            {msgs.map((m, i) => (
              <div key={i} className={`ask-msg ${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="ask-suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        className="ask-form"
        onSubmit={(e) => {
          e.preventDefault();
          send(value);
        }}
      >
        <span className="ask-dot" aria-hidden="true" />
        <span className="ask-name">AskJohn</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Ask about the work, or tell me your problem..."
          aria-label="Ask about John's work"
        />
        <button type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
