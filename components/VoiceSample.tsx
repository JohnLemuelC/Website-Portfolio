"use client";

import { useEffect, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const PEAKS = [
  0.84, 0.81, 0.92, 0.82, 0.74, 0.77, 0.76, 0.74, 0.69, 0.75, 0.83, 0.43, 0.84, 0.71, 0.94, 0.74,
  0.78, 0.87, 0.67, 0.41, 0.75, 0.54, 0.1, 0.69, 0.77, 0.89, 0.95, 0.86, 0.18, 0.86, 0.77, 0.61,
  0.74, 0.73, 0.98, 0.83, 0.65, 0.67, 0.93, 0.75, 0.17, 0.71, 0.69, 0.93, 0.44, 0.99, 0.82, 0.69,
  0.89, 0.76, 0.6, 1.0, 0.82, 0.92, 0.42, 0.95, 0.39, 0.96, 0.85, 0.1, 0.91, 0.96, 0.53, 0.88,
  0.94, 0.79, 0.79, 0.86, 0.65, 0.11, 0.82, 0.12,
];

const TRANSCRIPT = [
  { t: 0, who: "agent", text: "Hi there, this is Eva calling on a recorded line about the piece of land you reached out to us about. Do you have a quick minute?" },
  { t: 6.8, who: "seller", text: "Oh yeah, sure. I've got a minute." },
  { t: 9.3, who: "agent", text: "Great, thanks. Just to make sure I've got the right property, is this about the 10-acre lot in Marion County, Florida?" },
  { t: 16.3, who: "seller", text: "Yeah, that's the one." },
  { t: 18.3, who: "agent", text: "Perfect. And is that owned free and clear, or is there still a loan on it?" },
  { t: 23.8, who: "seller", text: "No, it's paid off. Owned outright." },
  { t: 27.1, who: "agent", text: "Good to know. Do you have a rough number in mind for what you'd want to get for it?" },
  { t: 31.1, who: "seller", text: "I was hoping for somewhere around 40,000." },
  { t: 34.4, who: "agent", text: "Okay, that helps. Here's what I'd suggest. Let me set you up with one of our land specialists for a quick call to go over a cash offer. I've got tomorrow at 2pm or Thursday morning at 10. Which works better for you?" },
  { t: 47.6, who: "seller", text: "Tomorrow at 2 is good." },
  { t: 49.6, who: "agent", text: "You're all set for tomorrow at 2pm. A specialist will give you a call then to walk through your offer. Thanks for your time, and talk soon." },
  { t: 58.1, who: "seller", text: "Sounds good, thanks." },
];

const fmt = (s: number) => {
  const total = Math.max(0, Math.floor(s));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

export default function VoiceSample() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 60);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setTime(0);
      audio.currentTime = 0;
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.min(Math.max(0, seconds), duration);
    audio.currentTime = next;
    setTime(next);
  };

  const ratio = duration ? time / duration : 0;
  const active = TRANSCRIPT.reduce((acc, line, i) => (time >= line.t ? i : acc), -1);

  return (
    <div className="vs">
      <div className="vs-head">
        <span className="vs-tag">Sample call</span>
        <span className="vs-meta">Outbound seller qualification · Retell AI</span>
      </div>

      <div className="vs-player">
        <button className="vs-play" onClick={toggle} aria-label={playing ? "Pause sample call" : "Play sample call"}>
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
              <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          )}
        </button>

        <div
          className="vs-wave"
          role="slider"
          tabIndex={0}
          aria-label="Seek through the call"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - r.left) / r.width) * duration);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") seek(time + 5);
            else if (e.key === "ArrowLeft") seek(time - 5);
            else if (e.key === " " || e.key === "Enter") toggle();
            else return;
            e.preventDefault();
          }}
        >
          {PEAKS.map((p, i) => (
            <span key={i} className={`vs-bar${i / PEAKS.length <= ratio ? " on" : ""}`} style={{ height: `${Math.round(p * 100)}%` }} />
          ))}
        </div>

        <span className="vs-time">
          {fmt(time)} <span>/ {fmt(duration)}</span>
        </span>
      </div>

      <p className="vs-caption">
        The agent verifies the property, checks whether it is owned outright, asks what the seller wants for it, and books
        the callback. No human on the line.
      </p>

      <button className="vs-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? "Hide transcript" : "Show transcript"}
      </button>

      {open && (
        <ol className="vs-script">
          {TRANSCRIPT.map((line, i) => (
            <li key={line.t} className={`${line.who}${i === active ? " active" : ""}`}>
              <button onClick={() => seek(line.t)} aria-label={`Play from ${fmt(line.t)}`}>
                <span className="vs-who">{line.who === "agent" ? "AI" : "Seller"}</span>
                <span>{line.text}</span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <audio ref={audioRef} src={`${BASE}/audio/ai-receptionist-sample.mp3`} preload="metadata" />
    </div>
  );
}
