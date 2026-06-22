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

export default function DashboardHome() {
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
        Dashboard Overview
      </h2>
      <div style={calloutStyle}>
        <strong>What's happening here:</strong>
        <br />
        The URL is <code style={codeStyle}>/dashboard</code>. Michi matched{" "}
        <code style={codeStyle}>dashboard.tsx</code> as a layout route - it
        renders the sidebar + <code style={codeStyle}>&lt;Outlet /&gt;</code>.
        Then it matched <code style={codeStyle}>dashboard/index.tsx</code> as
        the child, which renders inside that Outlet.
        <br />
        <br />
        <strong>Route tree:</strong> <code style={codeStyle}>__root</code> →{" "}
        <code style={codeStyle}>_auth</code> →{" "}
        <code style={codeStyle}>dashboard</code> →{" "}
        <code style={codeStyle}>dashboard/index</code>
        <br />
        The sidebar stays mounted when you navigate to Analytics - only the
        Outlet content swaps.
      </div>
    </div>
  );
}
