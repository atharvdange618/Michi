import { FaGithub, FaXTwitter } from "react-icons/fa6";
import type { CSSProperties } from "react";

const footerStyle: CSSProperties = {
  borderTop: "1px solid var(--border)",
  padding: "1.5rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.75rem",
  fontSize: "13px",
  color: "var(--ink-faint)",
};

export function Footer() {
  return (
    <footer style={footerStyle}>
      <span>
        Built by{" "}
        <a
          href="https://atharvdangedev.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--ink-muted)",
            fontWeight: 500,
            transition: "color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--ink-muted)";
          }}
        >
          Atharv Dange
        </a>
      </span>
      <span style={{ color: "var(--border)" }}>·</span>
      <a
        href="https://github.com/atharvdange618/Michi"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--ink-faint)",
          transition: "color 150ms ease",
          display: "flex",
          alignItems: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--ink)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--ink-faint)";
        }}
      >
        <FaGithub size={15} />
      </a>
      <a
        href="https://x.com/atharvdangedev"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--ink-faint)",
          transition: "color 150ms ease",
          display: "flex",
          alignItems: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--ink)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--ink-faint)";
        }}
      >
        <FaXTwitter size={15} />
      </a>
    </footer>
  );
}
