import type { CSSProperties } from "react";
import { Link } from "michi";

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

function RenderFailError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={errorBadgeStyle}>
        <span style={{ fontSize: "12px" }}>&#9679;</span>
        render error
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
        Component threw
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
        The route's component threw during render. React's error boundary caught
        it and rendered this <code>errorComponent</code> instead.
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
        Unlike loader errors (which happen before render), this error comes from
        the component itself. The error boundary at the route level catches it
        and swaps in the error UI.
        <br />
        <br />
        <strong>Tip:</strong> Open your browser's DevTools console to see the
        full error with stack trace - React logs it there automatically.
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

export const errorComponent = RenderFailError;

export default function RenderFailPage() {
  throw new Error("Component intentionally threw during render");
  return null;
}
