import type { CSSProperties } from "react";
import { Outlet } from "michi";

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  marginBottom: "1rem",
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--green)",
  padding: "3px 10px",
  background: "var(--surface)",
  border: "1px solid var(--green-border)",
  borderRadius: "4px",
};

export default function AuthLayout() {
  return (
    <div
      style={{
        border: "1px solid var(--green-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        background: "var(--green-soft)",
      }}
    >
      <div style={badgeStyle}>
        <span style={{ fontSize: "12px" }}>&#9679;</span>
        _auth layout - pathless, adds no URL segment
      </div>
      <Outlet />
    </div>
  );
}
