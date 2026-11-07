import { Info, Route, Settings } from "lucide-react";
import { useSyncExternalStore } from "react";

const sidebarLinks = [
  { id: "route-finder", label: "Route finder", Icon: Route },
  { id: "info", label: "Info", Icon: Info },
  { id: "settings", label: "Settings", Icon: Settings },
];

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getActivePage() {
  const hash = window.location.hash.slice(1);
  return hash === "info" || hash === "settings" ? hash : "route-finder";
}

export function HomeSidebar() {
  const activePage = useSyncExternalStore(
    subscribeToHash,
    getActivePage,
    () => "route-finder",
  );

  return (
    <nav className="portfolio-sidebar" aria-label="Map tools">
      {sidebarLinks.map(({ id, label, Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          aria-current={activePage === id ? "page" : undefined}
          title={label}
        >
          <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
