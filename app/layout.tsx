import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "John Lemuel Culinares | AI Automation Specialist",
  description:
    "I build production AI systems for real businesses. Agents, automations, and data pipelines that deliver measurable results. 4+ years across AI integration, marketing, and customer operations.",
  keywords: ["AI automation", "Claude API", "MCP servers", "n8n", "workflow automation", "AI agents", "Google Ads", "Python"],
  authors: [{ name: "John Lemuel Culinares" }],
  openGraph: {
    title: "John Lemuel Culinares | AI Automation Specialist",
    description: "I build production AI systems for real businesses.",
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Topbar />
        {children}
      </body>
    </html>
  );
}
