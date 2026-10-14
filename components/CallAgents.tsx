const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// The two agents that are live on real numbers. Order here is the order shown.
const AGENTS = [
  {
    name: "SARAH",
    role: "Outbound pre-qualification",
    detail: "Calls out, qualifies the seller, books the closer, follows up by SMS if the call does not connect.",
    display: "+1 (385) 429 1357",
    dial: "+13854291357",
  },
  {
    name: "GRACE",
    role: "Inbound seller calls",
    detail: "Answers, qualifies on the parcel and the timeline, and books the appointment. No human on the line.",
    display: "+1 (801) 348 6026",
    dial: "+18013486026",
  },
];

export default function CallAgents() {
  return (
    <div className="ca">
      <figure className="ca-result">
        <img
          src={`${BASE}/images/voice-agent-result.webp`}
          alt="Closed on a cold outbound call: $165,000 on a property comped at $250,000"
          width={1200}
          height={1200}
          loading="lazy"
        />
      </figure>

      <div className="ca-copy">
        <p className="ca-kicker">Call them yourself</p>
        <h3 className="ca-h">
          The recording below is a <em>demo</em>. These numbers are the real thing.
        </h3>
        <p className="ca-lede">
          Both agents are live and answering. Ring either one and you will hear exactly what a seller hears, running at
          full capability rather than the trimmed version in the sample.
        </p>

        <ul className="ca-list">
          {AGENTS.map((a) => (
            <li key={a.name}>
              <div className="ca-who">
                <span className="ca-name">{a.name}</span>
                <span className="ca-role">{a.role}</span>
              </div>
              <p className="ca-detail">{a.detail}</p>
              <a className="ca-num" href={`tel:${a.dial}`}>
                {a.display}
              </a>
            </li>
          ))}
        </ul>

        <p className="ca-note">
          Live client systems. Please keep it to one call, and hang up when you have heard enough.
        </p>
      </div>
    </div>
  );
}
