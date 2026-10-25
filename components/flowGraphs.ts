/**
 * The workflows drawn by FlowCanvas.
 *
 * Each one is a real build, reduced to the steps worth showing. The shapes
 * matter: the lead flow has a retry loop, the sync has a conflict branch that
 * stops rather than guesses. Those are the parts that are hard to get right,
 * so those are the parts on screen.
 */

export type Icon =
  | "bolt" | "filter" | "wave" | "rows" | "chat" | "date" | "retry" | "check"
  | "doc" | "user" | "upload" | "chart" | "link" | "shield";

export type Spec = {
  col: number;
  row: number;
  rows: number;
  label: string;
  icon: Icon;
  hue: string;
};

export type Graph = { nodes: Spec[]; edges: [number, number][] };

export type Flow = {
  key: string;
  title: string;
  blurb: string;
  hue: string;
  graph: Graph;
  /** what it replaced, what it does, what it cost to get right */
  detail: { h: string; p: string }[];
  scale: string;
};

const LEAD: Graph = {
  nodes: [
    { col: 0, row: 0, rows: 1, label: "New lead", icon: "bolt", hue: "#F5B544" },
    { col: 1, row: 0, rows: 1, label: "Enrich + dedupe", icon: "rows", hue: "#38BDF8" },
    { col: 2, row: 0, rows: 1, label: "n8n qualifies", icon: "filter", hue: "#EA4B71" },
    { col: 3, row: 0, rows: 2, label: "AI voice call", icon: "wave", hue: "#A78BFA" },
    { col: 3, row: 1, rows: 2, label: "Retry cadence", icon: "retry", hue: "#FB923C" },
    { col: 4, row: 0, rows: 2, label: "Books appointment", icon: "date", hue: "#60A5FA" },
    { col: 4, row: 1, rows: 2, label: "SMS fallback", icon: "chat", hue: "#34D399" },
    { col: 5, row: 0, rows: 1, label: "CRM updated", icon: "check", hue: "#4ADE80" },
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 5], [3, 4], [4, 3], [4, 6], [5, 7], [6, 7]],
};

const CONTENT: Graph = {
  nodes: [
    { col: 0, row: 0, rows: 1, label: "Keyword queue", icon: "bolt", hue: "#F5B544" },
    { col: 1, row: 0, rows: 1, label: "Checks coverage", icon: "filter", hue: "#EA4B71" },
    { col: 2, row: 0, rows: 1, label: "Drafts the piece", icon: "doc", hue: "#A78BFA" },
    { col: 3, row: 0, rows: 1, label: "Structure + links", icon: "link", hue: "#38BDF8" },
    { col: 4, row: 0, rows: 2, label: "Waits for a human", icon: "user", hue: "#FB923C" },
    { col: 4, row: 1, rows: 2, label: "Sent back", icon: "retry", hue: "#F5B544" },
    { col: 5, row: 0, rows: 1, label: "Published", icon: "upload", hue: "#4ADE80" },
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 6], [4, 5], [5, 2]],
};

const SYNC: Graph = {
  nodes: [
    { col: 0, row: 0, rows: 1, label: "Record changes", icon: "bolt", hue: "#F5B544" },
    { col: 1, row: 0, rows: 1, label: "Stamp its origin", icon: "shield", hue: "#A78BFA" },
    { col: 2, row: 0, rows: 1, label: "Match + dedupe", icon: "rows", hue: "#38BDF8" },
    { col: 3, row: 0, rows: 1, label: "Conflict?", icon: "filter", hue: "#EA4B71" },
    { col: 4, row: 0, rows: 2, label: "Held for review", icon: "user", hue: "#FB923C" },
    { col: 4, row: 1, rows: 2, label: "Writes across", icon: "upload", hue: "#60A5FA" },
    { col: 5, row: 0, rows: 1, label: "Both in step", icon: "check", hue: "#4ADE80" },
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]],
};

const ATTRIB: Graph = {
  nodes: [
    { col: 0, row: 0, rows: 1, label: "Deal moves stage", icon: "bolt", hue: "#F5B544" },
    { col: 1, row: 0, rows: 1, label: "Finds the click", icon: "link", hue: "#A78BFA" },
    { col: 2, row: 0, rows: 1, label: "Attaches value", icon: "chart", hue: "#38BDF8" },
    { col: 3, row: 0, rows: 1, label: "Uploads conversion", icon: "upload", hue: "#60A5FA" },
    { col: 4, row: 0, rows: 1, label: "Bids on revenue", icon: "check", hue: "#4ADE80" },
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
};

export const HERO_FLOW = LEAD;

export const FLOWS: Flow[] = [
  {
    key: "content",
    title: "Content pipeline",
    blurb: "Keyword in, published post out, with a person in the middle.",
    hue: "#A78BFA",
    graph: CONTENT,
    scale: "5 workflows · research to published",
    detail: [
      { h: "What it replaced", p: "A writer picking topics from a spreadsheet, checking by hand whether the site already covered them, then chasing someone for approval before anything went live." },
      { h: "How it runs", p: "Each stage only picks up work the previous one finished, so a failure stops one article rather than the pipeline. Status on the row is the queue." },
      { h: "The part that matters", p: "Nothing publishes without a person. Approval is a gate, not a notification, and anything sent back re-enters at the draft stage rather than starting over." },
    ],
  },
  {
    key: "sync",
    title: "Two way CRM sync",
    blurb: "The same record in two systems, never disagreeing.",
    hue: "#38BDF8",
    graph: SYNC,
    scale: "650+ automated tests · 264 in, 252 out",
    detail: [
      { h: "What it replaced", p: "Staff typing the same property into a client portal and into Zoho. Within a week the two disagreed and nobody could say which was right." },
      { h: "The hard part", p: "A write to one side fires the other side's webhook, which writes back, which fires again. Every write is stamped with its origin so each side ignores the changes it caused itself." },
      { h: "Conflicts stop, they do not resolve", p: "When both sides changed between syncs the record is held for a person. Guessing a winner silently is how data gets quietly wrong." },
      { h: "Why the tests", p: "On a two way sync the data is already wrong by the time a human notices, so 650+ tests run before anything deploys." },
    ],
  },
  {
    key: "attribution",
    title: "Revenue attribution",
    blurb: "Bid on deals closed, not forms filled.",
    hue: "#4ADE80",
    graph: ATTRIB,
    scale: "3 deal stages mapped to conversions",
    detail: [
      { h: "The problem", p: "Google Ads could only see the form submission, so it kept buying more of whatever produced forms, qualified or not. The outcome lived in the CRM, weeks later, where the ad platform never looks." },
      { h: "What it does", p: "Each deal stage uploads as its own offline conversion with its own value, matched back to the original click, so bidding optimises on revenue instead of volume." },
      { h: "Why earlier stages too", p: "A long sales cycle can outrun the 90 day window Google will accept, so qualified and proposal upload as well as closed won." },
    ],
  },
];
