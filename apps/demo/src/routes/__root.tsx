import { Link, Outlet, type NavigateTo } from "michi";
import type { CSSProperties } from "react";
import { Footer } from "../components/footer";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Michi",
  url: "https://michi.atharvdangedev.in",
  description:
    "A client-side router for React, built from first principles. No library abstractions - just the History API, regex pattern matching, and React primitives.",
  author: {
    "@type": "Person",
    name: "Atharv Dange",
    url: "https://github.com/atharvdange618",
  },
  programmingLanguage: "TypeScript",
  license: "https://opensource.org/licenses/MIT",
  codeRepository: "https://github.com/atharvdange618/Michi",
};

const navSections: Array<{
  label: string;
  links: Array<{
    to: NavigateTo;
    label: string;
    prefetch?: "intent" | "none";
    external?: boolean;
  }>;
}> = [
  {
    label: "Core",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/navigate", label: "Navigate" },
    ],
  },
  {
    label: "Features",
    links: [
      { to: "/user/atharv", label: "Params", prefetch: "intent" },
      { to: "/settings/profile", label: "Layouts" },
      { to: "/prefetch", label: "Prefetch", prefetch: "intent" },
      { to: "/users?page=1", label: "Search" },
    ],
  },
  {
    label: "Errors",
    links: [
      { to: "/errors/loader-fail", label: "Loader" },
      { to: "/errors/render-fail", label: "Render" },
      { to: "/settings/billing-error", label: "Isolation" },
    ],
  },
  {
    label: "Links",
    links: [
      { to: "https://michi-docs.vercel.app", label: "Docs", external: true },
      {
        to: "https://github.com/atharvdange618/Michi",
        label: "GitHub",
        external: true,
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
                {section.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.to}
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
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
                    </a>
                  ) : (
                    <Link
                      key={link.to}
                      to={link.to}
                      prefetch={link.prefetch}
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
                  ),
                )}
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
