import { Link, Outlet } from "michi";
import type { CSSProperties } from "react";
import { useSEO } from "../components/use-seo";

const links = [
  { to: "/settings/profile", label: "Profile" },
  { to: "/settings/billing", label: "Billing" },
];

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  marginBottom: "1rem",
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--green)",
  padding: "3px 10px",
  background: "var(--surface)",
  border: "1px solid var(--green-border)",
  borderRadius: "4px",
};

export default function SettingsLayout() {
  useSEO({
    title: "Settings",
    description:
      "Settings layout demo - persistent sidebar with Outlet for nested child routes in a client-side router.",
    path: "/settings",
  });
  return (
    <div
      style={{
        border: "1px solid var(--green-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        background: "var(--green-soft)",
      }}
    >
      <div style={badgeStyle}>
        <span style={{ fontSize: "12px" }}>&#9679;</span>
        settings layout - direct child of __root, wraps profile &amp; billing
      </div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <aside style={{ minWidth: "160px", paddingTop: "0.25rem" }}>
          <h3
            style={{
              margin: "0 0 0.6rem",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ink-faint)",
            }}
          >
            Settings
          </h3>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: "6px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  color: "var(--ink-muted)",
                  textDecoration: "none",
                  transition: "opacity 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--ink)";
                  e.currentTarget.style.background = "var(--bg-inset)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--ink-muted)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
