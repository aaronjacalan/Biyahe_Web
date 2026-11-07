"use client";

import { HomeSidebar } from "./home/_components/home-sidebar";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="portfolio-shell">
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById("main-content")?.focus()}
      >
        Skip to content
      </button>
      <HomeSidebar />
      <main id="main-content" tabIndex={-1} className="portfolio-main">
        {children}
      </main>
    </div>
  );
}
