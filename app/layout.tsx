import type { Metadata } from "next";
import "./globals.css";
import NavPill from "@/components/NavPill";
import AskBar from "@/components/AskBar";

export const metadata: Metadata = {
  title: "John Culinares | AI Automation & Systems Builder",
  description:
    "I build the AI systems that take repetitive work off your team. Voice agents, automation pipelines, dashboards and integrations, built by an operator.",
  keywords: ["AI automation", "Claude API", "MCP servers", "n8n", "voice AI", "Retell AI", "GoHighLevel", "Python"],
  authors: [{ name: "John Lemuel Culinares" }],
  openGraph: {
    title: "John Culinares | AI Automation & Systems Builder",
    description: "I build the AI systems that take repetitive work off your team.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <meta name="theme-color" content="#121017" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter+Tight:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NavPill />
        {children}
        <AskBar />
      </body>
    </html>
  );
}
