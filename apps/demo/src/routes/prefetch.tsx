import type { CSSProperties } from "react";
import { Link } from "michi";
import { useSEO } from "../components/use-seo";

const cardStyle: CSSProperties = {
  padding: "1.25rem",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius)",
  background: "var(--surface)",
  transition: "border-color 150ms ease, transform 150ms ease",
};

const labelStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: "14px",
  marginBottom: "0.5rem",
  color: "var(--ink)",
};

const descStyle: CSSProperties = {
  fontSize: "14px",
  color: "var(--ink-muted)",
  margin: "0 0 0.75rem",
  lineHeight: 1.6,
};

const primaryBtnStyle: CSSProperties = {
  display: "inline-block",
  padding: "0.5rem 1rem",
  background: "var(--accent)",
  color: "var(--bg)",
  borderRadius: "var(--radius-sm)",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 500,
  transition: "opacity 150ms ease",
};

const secondaryBtnStyle: CSSProperties = {
  display: "inline-block",
  padding: "0.5rem 1rem",
  background: "var(--bg-raised)",
  color: "var(--ink)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  textDecoration: "none",
  fontSize: "14px",
  transition: "border-color 150ms ease, opacity 150ms ease",
};

const warnBtnStyle: CSSProperties = {
  display: "inline-block",
  padding: "0.5rem 1rem",
  background: "var(--red-soft)",
  color: "var(--red)",
  border: "1px solid var(--red-border)",
  borderRadius: "var(--radius-sm)",
  textDecoration: "none",
  fontSize: "14px",
  transition: "border-color 150ms ease, opacity 150ms ease",
};

const codeBlockStyle: CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "13px",
  lineHeight: 1.8,
  margin: 0,
  whiteSpace: "pre-wrap",
  color: "var(--ink-muted)",
};

const metaBlockStyle: CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "13px",
  padding: "1rem 1.25rem",
  background: "var(--bg-raised)",
  borderRadius: "var(--radius)",
  lineHeight: 1.8,
  border: "1px solid var(--border-subtle)",
};

export default function PrefetchExplainerPage() {
  useSEO({
    title: "Prefetch on Hover",
    description:
      'Demo of prefetch="intent" - run route loaders early on hover for instant navigation.',
    path: "/prefetch",
  });

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
        Prefetch on Hover
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-muted)",
          margin: "0 0 2rem",
          maxWidth: "50ch",
          lineHeight: 1.6,
        }}
      >
        Add <code>prefetch="intent"</code> to a <code>&lt;Link&gt;</code> and Michi runs the target
        route's loader as soon as the user hovers - before they click. By the time they navigate,
        the data is already loaded.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={labelStyle}>With prefetch="intent"</div>
          <p style={descStyle}>
            Hover and hold for a moment, then click. The loader already ran while you were hovering
            - the page should appear instantly.
          </p>
          <Link
            to="/prefetch-demo?via=hover"
            prefetch="intent"
            style={primaryBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Hover me, then click &rarr;
          </Link>
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={labelStyle}>Without prefetch</div>
          <p style={descStyle}>Clicking always waits the full 800ms - nothing ran ahead of time.</p>
          <Link
            to="/prefetch-demo?via=direct"
            style={secondaryBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            Click directly (no hover prefetch) &rarr;
          </Link>
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={labelStyle}>Custom prefetchDelay</div>
          <p style={descStyle}>
            Default delay is 50ms. This link uses{" "}
            <code>
              prefetchDelay={"{"}500{"}"}
            </code>{" "}
            - hover and hold for half a second before the prefetch fires. Useful for avoiding
            prefetch on accidental micro-hovers.
          </p>
          <Link
            to="/prefetch-demo?via=slow-hover"
            prefetch="intent"
            prefetchDelay={500}
            style={primaryBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Hover for 500ms, then click &rarr;
          </Link>
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--red-border)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ ...labelStyle, color: "var(--red)" }}>Failed prefetch</div>
          <p style={descStyle}>
            This link's loader always throws. The prefetch fails silently (error logged to console).
            On click, the route's loader re-runs and the error boundary catches it.
          </p>
          <Link
            to="/prefetch-fail"
            prefetch="intent"
            style={warnBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Hover to prefetch (will fail), then click &rarr;
          </Link>
        </div>
      </div>

      <div
        style={{
          marginTop: "2rem",
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
          how it works
        </div>
        <pre style={codeBlockStyle}>
          {`// Add prefetch="intent" to any Link
<Link to="/page" prefetch="intent">
  Hover to prefetch
</Link>

// Custom delay (default is 50ms)
<Link to="/page" prefetch="intent" prefetchDelay={500}>
  Slower prefetch trigger
</Link>

// What happens under the hood:
// 1. onMouseEnter fires after delay
// 2. Router.prefetch() matches the route
// 3. Route loader runs, result cached (30s TTL)
// 4. On click, cached data used instantly
// 5. If loader fails, error logged, click re-runs`}
        </pre>
      </div>

      <div style={{ ...metaBlockStyle, marginTop: "6px" }}>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>prop: </span>
          prefetch="intent" | "none" (default)
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>delay: </span>
          50ms default (configurable via prefetchDelay)
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>cache: </span>
          TTL-based, deduped, consumed on navigation
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>failure: </span>
          logged to console, click re-runs loader
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>clear: </span>
          timer cancelled on mouseleave or unmount
        </div>
      </div>
    </div>
  );
}
