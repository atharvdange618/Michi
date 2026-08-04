import type { CSSProperties } from "react";
import { useRouter } from "michi";
import { useSEO } from "../components/use-seo";

const navBtnStyle: CSSProperties = {
  padding: "12px 16px",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius)",
  background: "var(--surface)",
  fontSize: "14px",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "var(--ink)",
  transition: "opacity 150ms ease",
  fontFamily: "inherit",
};

const routes = [
  { label: "Go Home", path: "/" },
  { label: "Go to About", path: "/about" },
  { label: "Go to /user/michi", path: "/user/michi" },
  { label: "Go to /showcase/michi", path: "/showcase/michi" },
  { label: "Go to /files/a/b/c", path: "/files/a/b/c" },
  { label: "Go to /settings/profile", path: "/settings/profile" },
] as const;

export default function NavigatePage() {
  useSEO({
    title: "Programmatic Navigation",
    description:
      "Demo of useRouter() for programmatic navigation from event handlers and effects in a React client-side router.",
    path: "/navigate",
  });
  const router = useRouter();

  return (
    <div style={{ maxWidth: "720px" }}>
      <h1
        style={{
          fontSize: "clamp(28px, 4vw, 36px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: "0 0 0.5rem",
        }}
      >
        Programmatic Navigation
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-muted)",
          margin: "0 0 2rem",
          maxWidth: "50ch",
        }}
      >
        This page uses <code>useRouter()</code> to navigate via button clicks - no{" "}
        <code>&lt;Link&gt;</code> needed.
      </p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            ...navBtnStyle,
            justifyContent: "center",
            gap: "0.5rem",
            flex: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
          }}
        >
          &larr; Go Back
        </button>
        <button
          type="button"
          onClick={() => window.history.forward()}
          style={{
            ...navBtnStyle,
            justifyContent: "center",
            gap: "0.5rem",
            flex: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
          }}
        >
          Go Forward &rarr;
        </button>
      </div>
      <p
        style={{
          fontSize: "13px",
          color: "var(--ink-faint)",
          margin: "0 0 1.5rem",
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        These call <code>window.history.back()</code> / <code>window.history.forward()</code>{" "}
        directly, which fires the <code>popstate</code> event - the same mechanism the browser's
        back/forward buttons use.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {routes.map((r) => (
          <button
            key={r.path}
            type="button"
            onClick={() => router.navigate(r.path)}
            style={navBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(194, 120, 50, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(0.995)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
          >
            <span>{r.label}</span>
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "12px",
                color: "var(--ink-faint)",
              }}
            >
              {r.path}
            </span>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "2.5rem",
          padding: "1.25rem 1.5rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface)",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontFamily: "'Geist Mono', monospace",
            color: "var(--ink-faint)",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          type safety
        </div>
        <pre
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "13px",
            lineHeight: 1.8,
            margin: 0,
            whiteSpace: "pre-wrap",
            color: "var(--ink-muted)",
          }}
        >
          {`// Paths are checked at compile time - typos are errors
router.navigate("/settings/profile");  // ✓ registered path
router.navigate("/nonexistent");       // ✗ type error

// <Link> gets the same checking
<Link to="/settings/profile" />  // ✓
<Link to="/nonexistent" />       // ✗ type error

// External URLs always pass
<Link to="https://github.com" />  // ✓

// The routes array above is \`as const\`,
// so each path is a literal type, not just string.`}
        </pre>
      </div>
    </div>
  );
}
