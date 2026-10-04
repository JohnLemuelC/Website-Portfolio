import { NextResponse } from "next/server";

// Vercel runs this. The GitHub Pages build is a static export and skips it,
// where the form falls back to composing a mail instead.
export const runtime = "nodejs";

const TO = "j.culinares06@gmail.com";

export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    const form = await req.formData();
    data = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  } catch {
    return NextResponse.json({ error: "Could not read that form." }, { status: 400 });
  }

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();
  const job = (data.job || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are all needed." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email does not look right." }, { status: 400 });
  }
  // a bot fills every field it finds, including the one nobody can see
  if ((data.company || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // nothing to send with, so say so rather than swallowing the enquiry
    console.error("contact: RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Mail is not configured yet." }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [TO],
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `${message}\n\nWhat they need: ${job || "not said"}\nFrom: ${name} <${email}>`,
    }),
  });

  if (!res.ok) {
    console.error("contact: resend said", res.status, await res.text());
    return NextResponse.json({ error: "That did not send." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
