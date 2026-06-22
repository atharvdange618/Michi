const calloutStyle: React.CSSProperties = {
  background: "var(--blue-soft)",
  border: "1px solid var(--blue-border)",
  borderRadius: "var(--radius)",
  padding: "1rem 1.25rem",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--blue)",
};

const codeStyle: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "12px",
  background: "rgba(55, 100, 180, 0.1)",
  padding: "1px 6px",
  borderRadius: "4px",
};

export default function ProfilePage() {
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
        Profile
      </h2>
      <div style={calloutStyle}>
        <strong>What's happening here:</strong>
        <br />
        The URL is <code style={codeStyle}>/settings/profile</code>. Michi matched the route tree
        and built a flat matches array:
        <br />
        <br />
        <code style={codeStyle}>matches[0]</code> = <code style={codeStyle}>__root</code> (the
        outermost shell - nav bar)
        <br />
        <code style={codeStyle}>matches[1]</code> = <code style={codeStyle}>settings</code> (layout
        - sidebar + Outlet)
        <br />
        <code style={codeStyle}>matches[2]</code> = <code style={codeStyle}>settings/profile</code>{" "}
        (this page, the leaf)
        <br />
        <br />
        <strong>Outlet depth:</strong> <code style={codeStyle}>RouterProvider</code> renders{" "}
        <code style={codeStyle}>matches[0]</code> and passes depth <code style={codeStyle}>1</code>{" "}
        via context. Each <code style={codeStyle}>&lt;Outlet /&gt;</code> reads its depth, renders{" "}
        <code style={codeStyle}>matches[depth]</code>, and increments.
        <br />
        <br />
        <strong>Layout persistence:</strong> Navigate to Billing -{" "}
        <code style={codeStyle}>settings.tsx</code> stays mounted. Only{" "}
        <code style={codeStyle}>matches[2]</code> changes from profile to billing.
      </div>
    </div>
  );
}
