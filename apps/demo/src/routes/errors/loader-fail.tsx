import type { CSSProperties } from "react";
import { Link, type LoaderContext } from "michi";

const errorBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--red)",
  background: "var(--red-soft)",
  border: "1px solid var(--red-border)",
  borderRadius: "4px",
  padding: "3px 10px",
  marginBottom: "1rem",
};

const codeHeaderStyle: CSSProperties = {
  padding: "8px 16px",
  background: "var(--bg-raised)",
  borderBottom: "1px solid var(--border-subtle)",
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--ink-faint)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

export async function loader(_: LoaderContext) {
  await new Promise((r) => setTimeout(r, 300));
  throw new Error("fetchDoomedResource() always fails - this is intentional");
}

function LoaderFailError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={errorBadgeStyle}>
        <span style={{ fontSize: "12px" }}>&#9679;</span>
        loader error
      </div>
      <h1
        style={{
          fontSize: "clamp(28px, 4vw, 36px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: "0 0 0.5rem",
        }}
      >
        Loader threw
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-muted)",
          lineHeight: 1.65,
          margin: "0 0 2rem",
          maxWidth: "50ch",
        }}
      >
        The route's loader failed before the component could render. The <code>errorComponent</code>{" "}
        receives the error and renders this UI instead.
      </p>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: "1.5rem",
          background: "var(--surface)",
        }}
      >
        <div style={codeHeaderStyle}>thrown error</div>
        <pre
          style={{
            margin: 0,
            padding: "1rem 1.25rem",
            fontSize: "13px",
            fontFamily: "'Geist Mono', monospace",
            color: "var(--red)",
            lineHeight: 1.6,
            overflowX: "auto",
          }}
        >
          {message}
        </pre>
      </div>

      <div
        style={{
          padding: "1rem 1.25rem",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius)",
          background: "var(--bg-raised)",
          fontSize: "14px",
          color: "var(--ink-muted)",
          lineHeight: 1.6,
        }}
      >
        Navigate away, then come back - the loader re-runs from scratch. If it fails again, the
        error component renders again.
        <br />
        <br />
        <strong>Tip:</strong> Open your browser's DevTools console to see the full error with stack
        trace - Michi logs loader errors there automatically.
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <Link
          to="/"
          style={{
            fontSize: "14px",
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 500,
            transition: "opacity 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          &larr; back to home
        </Link>
      </div>
    </div>
  );
}

export const errorComponent = LoaderFailError;

export default function LoaderFailPage() {
  return <h1>You should never see this - the loader always throws</h1>;
}
