import { useSEO } from "../../../components/use-seo";

const calloutStyle: React.CSSProperties = {
  background: "var(--green-soft)",
  border: "1px solid var(--green-border)",
  borderRadius: "var(--radius)",
  padding: "1rem 1.25rem",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--green)",
};

const codeStyle: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "12px",
  background: "rgba(45, 138, 78, 0.1)",
  padding: "1px 6px",
  borderRadius: "4px",
};

export default function AnalyticsPage() {
  useSEO({
    title: "Analytics",
    description:
      "Analytics dashboard page - nested child route within the dashboard layout using Outlet pattern.",
    path: "/dashboard/analytics",
  });
  return (
    <div>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: "0 0 1.25rem",
        }}
      >
        Analytics
      </h2>
      <div style={calloutStyle}>
        <strong>What's happening here:</strong>
        <br />
        The URL is <code style={codeStyle}>/dashboard/analytics</code>. Michi walked the route tree
        and found 4 matches:
        <br />
        <br />
        <code style={codeStyle}>__root</code> (always matches) →{" "}
        <code style={codeStyle}>_auth</code> (pathless layout, no URL segment) →{" "}
        <code style={codeStyle}>dashboard</code> (matches <code style={codeStyle}>/dashboard</code>)
        → <code style={codeStyle}>dashboard/analytics</code> (matches{" "}
        <code style={codeStyle}>/analytics</code> under parent)
        <br />
        <br />
        <strong>Key concept:</strong> <code style={codeStyle}>_auth</code> is a{" "}
        <em>pathless layout</em> - its filename prefix <code style={codeStyle}>_</code> tells Michi
        it adds no URL segment. It wraps children without affecting the URL.
        <br />
        <br />
        <strong>Outlet chain:</strong> root renders Outlet → auth renders Outlet → dashboard renders
        Outlet → analytics renders (leaf, no Outlet).
      </div>
    </div>
  );
}
