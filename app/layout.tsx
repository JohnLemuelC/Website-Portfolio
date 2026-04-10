import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Lemuel Culinares | Automation & AI Systems Engineer",
  description:
    "Building workflow automations, AI agents, and marketing systems that eliminate manual work and drive measurable outcomes. 4+ years across digital marketing, CRM, and workflow optimization.",
  keywords: ["automation", "n8n", "zapier", "AI agents", "marketing automation", "web apps", "Google Ads", "MCP"],
  authors: [{ name: "John Lemuel Culinares" }],
  openGraph: {
    title: "John Lemuel Culinares | Automation & AI Systems Engineer",
    description: "Transforming manual work into automated systems.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
