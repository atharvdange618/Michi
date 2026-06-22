import type { CSSProperties } from "react";
import { useParams } from "michi";
import { useSEO } from "../../components/use-seo";

const breadcrumbBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
  padding: "1rem 1.25rem",
  background: "var(--surface)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  marginBottom: "1rem",
};

const filePathTagStyle: CSSProperties = {
  padding: "3px 10px",
  background: "var(--accent-soft)",
  border: "1px solid rgba(232, 146, 58, 0.2)",
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--accent)",
  fontWeight: 600,
};

const segmentTagBaseStyle: CSSProperties = {
  padding: "3px 10px",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
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

const infoBoxStyle: CSSProperties = {
  marginTop: "1.5rem",
  padding: "1rem 1.25rem",
  border: "1px solid var(--green-border)",
  borderRadius: "var(--radius)",
  background: "var(--green-soft)",
  fontSize: "13px",
  color: "var(--green)",
  lineHeight: 1.6,
};

export default function FilePage() {
  const { "*": filePath } = useParams<{ "*": string }>();
  useSEO({
    title: "Wildcard Routes",
    description: `Wildcard path "${filePath}" caught by /files/* - demo of catch-all route parameters in a client-side router.`,
    path: `/files/${filePath}`,
  });
  const segments = filePath.split("/").filter(Boolean);

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
        File Viewer
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-muted)",
          margin: "0 0 2rem",
          maxWidth: "50ch",
        }}
      >
        This route uses a <code>*</code> wildcard - it matches any path under <code>/files/</code>,
        no matter how deep.
      </p>

      <div style={breadcrumbBarStyle}>
        <span style={filePathTagStyle}>/files</span>
        {segments.map((seg, i) => (
          <span key={seg} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                color: "var(--ink-faint)",
                fontSize: "12px",
                userSelect: "none",
              }}
            >
              /
            </span>
            <span
              style={{
                ...segmentTagBaseStyle,
                background: i === segments.length - 1 ? "var(--bg-inset)" : "var(--bg-raised)",
                color: i === segments.length - 1 ? "var(--ink)" : "var(--ink-muted)",
                fontWeight: i === segments.length - 1 ? 600 : 400,
              }}
            >
              {seg}
            </span>
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontFamily: "'Geist Mono', monospace",
            color: "var(--ink-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          depth
        </div>
        <div style={{ display: "flex", gap: "3px" }}>
          {Array.from({ length: Math.max(segments.length, 1) }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "24px",
                height: "6px",
                borderRadius: "3px",
                background: i < segments.length ? "var(--accent)" : "var(--border)",
                transition: "background 150ms ease",
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: "12px",
            fontFamily: "'Geist Mono', monospace",
            color: "var(--ink-muted)",
          }}
        >
          {segments.length} segment{segments.length !== 1 ? "s" : ""} captured
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: "1rem",
          background: "var(--surface)",
        }}
      >
        <div style={codeHeaderStyle}>params object</div>
        <div style={{ padding: "1rem 1.25rem" }}>
          <pre
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "13px",
              lineHeight: 1.8,
              margin: 0,
              whiteSpace: "pre-wrap",
              color: "var(--ink-muted)",
            }}
          >
            {`{
  "*": "${filePath}"
}`}
          </pre>
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "13px",
          padding: "1rem 1.25rem",
          background: "var(--bg-raised)",
          borderRadius: "var(--radius)",
          lineHeight: 1.8,
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <span style={{ color: "var(--ink-faint)" }}>route pattern:</span> /files/*
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>actual URL: </span> /files/{filePath}
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>wildcard key: </span> "*" (catches everything
          after /files/)
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>hook: </span> useParams&lt;{`{ "*": string }`}
          &gt;()
        </div>
      </div>

      <div style={infoBoxStyle}>
        <strong>How wildcard matching works:</strong> The{" "}
        <code style={{ background: "rgba(74, 222, 128, 0.12)" }}>*</code> in the route pattern
        converts to a regex that captures everything after{" "}
        <code style={{ background: "rgba(74, 222, 128, 0.12)" }}>/files/</code>. Unlike dynamic
        params (<code style={{ background: "rgba(74, 222, 128, 0.12)" }}>$id</code>) which match a
        single segment, wildcards match across multiple segments - so{" "}
        <code style={{ background: "rgba(74, 222, 128, 0.12)" }}>/files/a/b/c</code> and{" "}
        <code style={{ background: "rgba(74, 222, 128, 0.12)" }}>
          /files/public/uploads/report.pdf
        </code>{" "}
        both match, with the full path stored under the{" "}
        <code style={{ background: "rgba(74, 222, 128, 0.12)" }}>"*"</code> key.
      </div>
    </div>
  );
}
