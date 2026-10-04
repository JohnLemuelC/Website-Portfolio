"use client";

import { useState } from "react";

const EMAIL = "j.culinares06@gmail.com";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
// On Vercel the app keeps its server, so the form posts to our own route.
// The GitHub Pages copy is a static export with no server, so it falls back to
// composing a mail. BASE is only set on the Pages build, which is the tell.
const ENDPOINT = BASE ? "" : "/api/contact";

const JOBS = [
  "A voice agent that answers calls",
  "An automation or pipeline",
  "A dashboard or reporting",
  "An app or portal",
  "Not sure yet",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const name = String(d.get("name") || "");
    const email = String(d.get("email") || "");
    const job = String(d.get("job") || "");
    const message = String(d.get("message") || "");

    if (!ENDPOINT) {
      // no backend on a static host, so hand the composed mail to their client
      const body = `${message}\n\nWhat I need: ${job}\nFrom: ${name} (${email})`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        `Project enquiry from ${name}`
      )}&body=${encodeURIComponent(body)}`;
      setSent(true);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: d,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || String(res.status));
      }
      form.reset();
      setSent(true);
    } catch (err) {
      const why = err instanceof Error && !/^\d+$/.test(err.message) ? `${err.message} ` : "";
      setError(`${why}Email me directly at ${EMAIL}.`);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="cform cform-done" role="status">
        <h3>Got it.</h3>
        <p>
          I reply to everything within a day. If it is urgent,{" "}
          <a href="https://wa.me/639761172117" target="_blank" rel="noopener">
            WhatsApp me
          </a>{" "}
          instead.
        </p>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={onSubmit}>
      <h3>Or tell me here</h3>
      <input
        className="cform-trap"
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="cform-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <label>
        <span>What do you need</span>
        <select name="job" defaultValue={JOBS[0]}>
          {JOBS.map((j) => (
            <option key={j}>{j}</option>
          ))}
        </select>
      </label>
      <label>
        <span>What is eating the time</span>
        <textarea name="message" rows={4} required placeholder="The job your team keeps doing by hand." />
      </label>
      {error && <p className="cform-error">{error}</p>}
      <button className="btn" type="submit" disabled={busy}>
        {busy ? "Sending..." : "Send it"}
      </button>
      <p className="cform-note">Goes to me only. No list, no follow-up sequence.</p>
    </form>
  );
}
