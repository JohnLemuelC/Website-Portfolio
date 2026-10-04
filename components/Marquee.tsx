"use client";

import { projectSections } from "@/app/work/data";

// every project name, in one long line that never stops moving
const NAMES = projectSections.flatMap((s) => s.projects.map((p) => p.title));

export default function Marquee() {
  // the track holds two copies, so translating it half way is a seamless loop
  const track = [...NAMES, ...NAMES];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {track.map((n, i) => (
          <span key={`${n}-${i}`}>
            {n}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}
