"use client";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Topbar() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <a className="nav-brand" href="#hero">
          <img src={`${BASE}/images/headshot/profile.png`} alt="John Lemuel" />
          John Culinares
        </a>

        <div className="nav-links">
          {links.map((l) => (
            <a key={l.label} className="nav-link" href={l.href}>
              {l.label}
            </a>
          ))}
          <a
            className="nav-link"
            href={`${BASE}/demos/marketing-dashboard-demo.html`}
            target="_blank"
            rel="noopener"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            Interactive Demo ↗
          </a>
        </div>

        <div className="nav-status">
          <span className="status-dot" />
          Available for work
        </div>
      </div>
    </nav>
  );
}
