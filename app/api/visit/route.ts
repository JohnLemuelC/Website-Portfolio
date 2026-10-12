import { NextResponse } from "next/server";

// Emails John when someone who is not him opens the portfolio.
// Vercel runs this. The GitHub Pages build is a static export and skips it,
// where the ping just 404s and the client ignores it.
export const runtime = "nodejs";

const TO = "j.culinares06@gmail.com";

// crawlers, previewers and link unfurlers. none of these are a human reading it.
const BOT =
  /bot|crawl|spider|slurp|headless|preview|facebookexternalhit|whatsapp|telegram|slackbot|discordbot|linkedinbot|twitterbot|embedly|quora|pinterest|vercel|lighthouse|pagespeed|gtmetrix|monitor|uptime|curl|wget|python-requests|axios|node-fetch/i;

export async function POST(req: Request) {
  let body: { path?: string; ref?: string; tag?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const h = req.headers;
  const ua = h.get("user-agent") || "";

  // a bot, a prefetch, or Vercel's own checks: not a visit
  if (BOT.test(ua) || h.get("purpose") === "prefetch" || h.get("sec-purpose")?.includes("prefetch")) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  const city = h.get("x-vercel-ip-city");
  const country = h.get("x-vercel-ip-country");
  const region = h.get("x-vercel-ip-country-region");
  const where = [city && decodeURIComponent(city), region, country].filter(Boolean).join(", ") || "unknown";

  const ref = (body.ref || "").trim();
  const tag = (body.tag || "").trim();

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("visit: RESEND_API_KEY is not set");
    return NextResponse.json({ ok: true });
  }

  // the tag is the useful bit: it says which application this visit came from
  const subject = tag ? `Portfolio opened from: ${tag}` : `Portfolio opened (${where})`;
  const lines = [
    `Page:      ${body.path || "/"}`,
    tag ? `Tag:       ${tag}` : null,
    `From:      ${where}`,
    `Referrer:  ${ref || "typed or no referrer"}`,
    `Device:    ${ua.slice(0, 180)}`,
    `Time:      ${new Date().toUTCString()}`,
  ].filter(Boolean);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [TO],
      subject,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) console.error("visit: resend said", res.status, await res.text());
  return NextResponse.json({ ok: true });
}
