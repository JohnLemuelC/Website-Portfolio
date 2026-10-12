"use client";

import { useEffect } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
// no server on the GitHub Pages export, so the ping only runs on Vercel
const ENDPOINT = BASE ? "" : "/api/visit/";

const OWNER_KEY = "jc_owner";
const SEEN_KEY = "jc_pinged";

/**
 * Tells John when someone else opens the portfolio.
 *
 * Visiting with ?me=1 marks this browser as his and it never pings again,
 * so the notifications only mean a real visitor. ?me=0 clears it.
 * One ping per browser session, so reading three pages is one email.
 */
export default function VisitPing() {
  useEffect(() => {
    if (!ENDPOINT) return;

    let params: URLSearchParams;
    try {
      params = new URLSearchParams(window.location.search);
    } catch {
      return;
    }

    try {
      const me = params.get("me");
      if (me === "1") {
        localStorage.setItem(OWNER_KEY, "1");
        return;
      }
      if (me === "0") localStorage.removeItem(OWNER_KEY);
      if (localStorage.getItem(OWNER_KEY) === "1") return;
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // private window or storage blocked. ping once rather than not at all.
    }

    const send = () => {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          path: window.location.pathname,
          ref: document.referrer,
          tag: params.get("r") || "",
        }),
      }).catch(() => {});
    };

    // a visitor who leaves in under three seconds did not read anything
    const t = window.setTimeout(send, 3000);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
