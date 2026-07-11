import type { CSSProperties } from "react";
import { useLoaderData, type LoaderContext } from "michi";
import { useSEO } from "../components/use-seo";
import { fetchPrefetchDemoData } from "../mocks/api";

export async function loader(_: LoaderContext) {
  return fetchPrefetchDemoData();
}

const dataBlockStyle: CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "13px",
  padding: "1rem",
  background: "var(--bg-inset)",
  borderRadius: "var(--radius)",
  lineHeight: 1.8,
  border: "1px solid var(--border-subtle)",
};

const dataLabelStyle: CSSProperties = {
  color: "var(--ink-faint)",
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

export default function PrefetchDemoTarget() {
  const data = useLoaderData<{ callCount: number; resolvedAt: string }>();
  useSEO({
    title: "Prefetch Target",
    description:
      "Loader target page for prefetch demo - 800ms artificial delay to demonstrate prefetch on hover.",
    path: "/prefetch-demo",
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
        Prefetch Target
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
        This page's loader artificially takes 800ms. If you hovered the prefetch link and waited
        before clicking, the loader had already finished by the time you clicked.
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
            padding: "1.25rem 1.5rem",
            background: "var(--bg-raised)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontFamily: "'Geist Mono', monospace",
              color: "var(--ink-faint)",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            loader result
          </div>
          <div style={dataBlockStyle}>
            <div>
              <span style={dataLabelStyle}>loader call #:</span> {data.callCount}
            </div>
            <div>
              <span style={dataLabelStyle}>resolved at:</span> {data.resolvedAt}
            </div>
          </div>
        </div>

        <div style={{ padding: "1.25rem 1.5rem" }}>
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
            how to verify
          </div>
          <ol
            style={{
              fontSize: "14px",
              color: "var(--ink-muted)",
              lineHeight: 1.8,
              margin: 0,
              paddingLeft: "1.25rem",
            }}
          >
            <li>
              Go back, hover the prefetch link - watch the console for{" "}
              <code>[michi] prefetch: (cache miss)</code>
            </li>
            <li>
              Hover again - you'll see <code>(cache hit)</code>, no new fetch
            </li>
            <li>Click the link - page loads instantly, call # stays the same</li>
            <li>Click "direct" link - full 800ms wait, call # increments</li>
          </ol>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
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
          this page's loader
        </div>
        <pre style={codeBlockStyle}>
          {`export async function loader(_: LoaderContext) {
  // Simulates a slow API call (800ms)
  return fetchPrefetchDemoData();
}

// The loader result is cached by PrefetchCache
// with a 30-second TTL. Multiple hovers reuse
// the same cached promise (dedup).`}
        </pre>
      </div>

      <div style={{ ...metaBlockStyle, marginTop: "6px" }}>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>route: </span>
          /prefetch-demo
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>loader: </span>
          fetchPrefetchDemoData() &rarr; 800ms delay
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>hook: </span>
          useLoaderData&lt;{`{ callCount, resolvedAt }`}&gt;()
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>cache: </span>
          PrefetchCache with 30s TTL, dedup on concurrent hovers
        </div>
      </div>
    </div>
  );
}
