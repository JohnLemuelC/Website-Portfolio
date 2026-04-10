"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import OverviewTab from "@/components/OverviewTab";
import ProjectsTab from "@/components/ProjectsTab";
import ExperienceTab from "@/components/ExperienceTab";
import ToolsTab from "@/components/ToolsTab";
import ContactTab from "@/components/ContactTab";

const TABS = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "experience", label: "Experience", icon: "briefcase" },
  { id: "skills", label: "Skills & Tools", icon: "cpu" },
  { id: "contact", label: "Contact", icon: "mail" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard">
      <Topbar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="dashboard-content">
        <div className={`tab-panel ${activeTab === "overview" ? "active" : ""}`}>
          <OverviewTab onNavigate={setActiveTab} />
        </div>
        <div className={`tab-panel ${activeTab === "projects" ? "active" : ""}`}>
          <ProjectsTab />
        </div>
        <div className={`tab-panel ${activeTab === "experience" ? "active" : ""}`}>
          <ExperienceTab />
        </div>
        <div className={`tab-panel ${activeTab === "skills" ? "active" : ""}`}>
          <ToolsTab />
        </div>
        <div className={`tab-panel ${activeTab === "contact" ? "active" : ""}`}>
          <ContactTab />
        </div>
      </div>
    </div>
  );
}
