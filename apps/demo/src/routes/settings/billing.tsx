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

export default function BillingPage() {
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
        Billing
      </h2>
      <div style={calloutStyle}>
        <strong>What's happening here:</strong>
        <br />
        The URL is <code style={codeStyle}>/settings/billing</code>. Same layout
        as Profile - the <code style={codeStyle}>settings.tsx</code> sidebar
        stayed mounted while <code style={codeStyle}>matches[2]</code> swapped
        from <code style={codeStyle}>profile</code> to{" "}
        <code style={codeStyle}>billing</code>.
        <br />
        <br />
        <strong>Why the sidebar persisted:</strong> Michi's matcher detected
        that <code style={codeStyle}>settings</code> is still in the matched
        route tree. Only the leaf changed. React sees the same parent component
        instance, so it doesn't remount - it just re-renders with new child
        content in the Outlet.
        <br />
        <br />
        <strong>Try it:</strong> Open React DevTools. Click Profile → Billing →
        Profile. Watch the <code style={codeStyle}>SettingsLayout</code>{" "}
        component - it never unmounts. Only the Outlet's child changes.
      </div>
    </div>
  );
}
