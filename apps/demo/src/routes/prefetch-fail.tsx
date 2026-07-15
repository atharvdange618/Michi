import { useRouteError, type LoaderContext } from "michi";
import type { CSSProperties } from "react";
import { useSEO } from "../components/use-seo";

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
  await new Promise((r) => setTimeout(r, 300));
  throw new Error("prefetch failed: network timeout");
}

function PrefetchFailError() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={errorBadgeStyle}>
        <span style={{ fontSize: "12px" }}>&#9679;</span>
        prefetch failed &rarr; loader error
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
        Prefetch Failed
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
        The prefetch ran when you hovered, but the loader threw. Michi logged the error to console
        and discarded the failed result. When you clicked, the loader re-ran and failed again -
        this time the error boundary caught it.
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
          thrown error
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
        <strong>What happened:</strong>
        <br />
        1. You hovered the link. After 50ms, <code style={codeStyle}>router.prefetch()</code> ran
        the loader.
        <br />
        2. The loader threw. PrefetchCache marked the entry as rejected (no valid data cached).
        <br />
        3. You clicked. The router found a cached result, but it was a rejection - so it ran the
        loader fresh.
        <br />
        4. The loader threw again. This time the error landed on{" "}
        <code style={codeStyle}>match.error</code> and the error boundary rendered this UI.
        <br />
        <br />
        <strong>Key point:</strong> A failed prefetch never blocks navigation. The user always gets
        a fresh attempt on click.
      </div>
    </div>
  );
}

export const errorComponent = PrefetchFailError;

export default function PrefetchFailPage() {
  useSEO({
    title: "Prefetch Failed",
    description:
      "Demo of failed prefetch handling - the loader throws during prefetch and on click.",
    path: "/prefetch-fail",
  });
  return <h1>You should never see this - the loader always throws</h1>;
}
