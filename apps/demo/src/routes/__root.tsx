import type { CSSProperties } from "react";
import { Link, Outlet } from "michi";
import { Footer } from "../components/footer";

const navSections = [
  {
    label: "Core",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/navigate", label: "Navigate" },
    ],
  },
  {
    label: "Params",
    links: [
      { to: "/user/atharv", label: "Atharv" },
      { to: "/user/maithili", label: "Maithili" },
      { to: "/showcase/michi", label: "useParams" },
    ],
  },
  {
    label: "Layouts",
    links: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/dashboard/analytics", label: "Analytics" },
      { to: "/settings/profile", label: "Profile" },
      { to: "/settings/billing", label: "Billing" },
    ],
  },
  {
    label: "Edge cases",
    links: [
      { to: "/files/public/uploads/report.pdf", label: "Files" },
      { to: "/errors/loader-fail", label: "Loader Fail" },
      { to: "/errors/render-fail", label: "Render Fail" },
    ],
  },
];

const logoStyle: CSSProperties = {
  fontWeight: 800,
  fontSize: "16px",
  letterSpacing: "-0.5px",
  textDecoration: "none",
  color: "var(--ink)",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  flexShrink: 0,
};

const navLinkStyle: CSSProperties = {
  color: "var(--ink-muted)",
  textDecoration: "none",
  fontSize: "13px",
  padding: "4px 8px",
  borderRadius: "var(--radius-sm)",
  transition: "opacity 150ms ease",
  whiteSpace: "nowrap",
};

export default function RootLayout() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            height: "56px",
          }}
        >
          <Link to="/" style={logoStyle}>
            <span style={{ fontSize: "18px", opacity: 0.7 }}>道</span>
            Michi
          </Link>

          <nav
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              flex: 1,
            }}
          >
            {navSections.map((section, i) => (
              <div
                key={section.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                {i > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "var(--border)",
                      fontSize: "12px",
                      userSelect: "none",
                    }}
                  >
                    ·
                  </span>
                )}
                {section.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--ink)";
                      e.currentTarget.style.background = "var(--bg-raised)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--ink-muted)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          width: "100%",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
