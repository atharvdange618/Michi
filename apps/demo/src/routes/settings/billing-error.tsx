import { useRouteError, type LoaderContext } from "michi";
import type { CSSProperties } from "react";
import { useSEO } from "../../components/use-seo";

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

const calloutStyle: CSSProperties = {
  background: "var(--blue-soft)",
  border: "1px solid var(--blue-border)",
  borderRadius: "var(--radius)",
  padding: "1rem 1.25rem",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--blue)",
};

const codeStyle: CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "12px",
  background: "rgba(55, 100, 180, 0.1)",
  padding: "1px 6px",
  borderRadius: "4px",
};

export async function loader(_: LoaderContext) {
  await new Promise((r) => setTimeout(r, 200));
  throw new Error("billing-api.ts: subscription data unavailable");
}

function BillingError() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div>
      <div style={errorBadgeStyle}>
        <span style={{ fontSize: "12px" }}>&#9679;</span>
        child route error
      </div>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: "0 0 1rem",
        }}
      >
        Billing Error
      </h2>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          marginBottom: "1.25rem",
          background: "var(--surface)",
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            background: "var(--bg-raised)",
            borderBottom: "1px solid var(--border-subtle)",
            fontSize: "12px",
            fontFamily: "'Geist Mono', monospace",
            color: "var(--ink-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          useRouteError()
        </div>
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

      <div style={calloutStyle}>
        <strong>Error isolation in action:</strong>
        <br />
        Look at the green border around this page. That's <code style={codeStyle}>settings.tsx</code>{" "}
        (the parent layout). It's still rendering normally even though this child route's loader
        threw.
        <br />
        <br />
        <strong>Why:</strong> Each route gets its own <code style={codeStyle}>RouteErrorBoundary</code>.
        The error landed on this route's <code style={codeStyle}>match.error</code>, not the parent's.
        The settings sidebar, the nav bar, everything outside this Outlet stays untouched.
        <br />
        <br />
        <strong>The hook:</strong> <code style={codeStyle}>useRouteError()</code> reads the error from{" "}
        <code style={codeStyle}>RouteErrorContext</code> - the same error that landed on{" "}
        <code style={codeStyle}>match.error</code>. It returns{" "}
        <code style={codeStyle}>undefined</code> when there's no error.
      </div>
    </div>
  );
}

export const errorComponent = BillingError;

export default function BillingErrorPage() {
  useSEO({
    title: "Billing Error",
    description:
      "Demo of parent/child error isolation - the settings layout stays while the child route errors.",
    path: "/settings/billing-error",
  });
  return <h1>You should never see this - the loader always throws</h1>;
}
