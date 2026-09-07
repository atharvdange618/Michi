import type { CSSProperties } from "react";
import { defineRoute, Link, useRouterState } from "michi";
import { useSEO } from "../../components/use-seo";

export const route = defineRoute("/showcase/featured");

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

const sectionLabel: CSSProperties = {
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--ink-faint)",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const linkBtnStyle: CSSProperties = {
  display: "inline-block",
  padding: "0.5rem 1rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  fontSize: "14px",
  textDecoration: "none",
  color: "var(--ink)",
  background: "var(--surface)",
};

export default function RouteRankingPage() {
  const state = useRouterState();
  const matchedId = state.matches[state.matches.length - 1]?.routeId ?? "?";

  useSEO({
    title: "Route Ranking",
    description:
      "Two patterns match the same URL. The more specific one wins by score, not by definition order. /showcase/featured beats /showcase/$id.",
    path: "/showcase/featured",
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
        Route Ranking
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-muted)",
          margin: "0 0 2rem",
          maxWidth: "55ch",
          lineHeight: 1.6,
        }}
      >
        This URL, <code>/showcase/featured</code>, matches two patterns:{" "}
        <code>/showcase/featured</code> and <code>/showcase/$id</code> with{" "}
        <code>id = "featured"</code>. The static route wins because it scores
        higher. Where the two sit in the route tree does not decide it.
      </p>

      <div style={{ ...metaBlockStyle, marginBottom: "1.5rem" }}>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>matched route: </span>
          <span style={{ color: "var(--accent)" }}>{matchedId}</span>
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>
            /showcase/featured:{" "}
          </span>
          10 + 10 = score 20
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>/showcase/$id: </span>
          10 + 3 = score 13
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem" }}>
        <Link to="/showcase/featured" style={linkBtnStyle}>
          /showcase/featured
        </Link>
        <Link to="/showcase/atharv" style={linkBtnStyle}>
          /showcase/atharv
        </Link>
      </div>

      <div
        style={{
          padding: "1.25rem 1.5rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface)",
        }}
      >
        <div style={sectionLabel}>how it works</div>
        <pre style={codeBlockStyle}>
          {`// matcher.ts - every route gets a score, higher = more specific
function scoreRoute(path) {
  if (isLayoutRoute(path)) return Number.MAX_SAFE_INTEGER;
  return path.split("/").filter(Boolean).reduce((score, seg) => {
    if (seg === "*") return score + 1;          // wildcard
    if (seg.startsWith("$")) return score + 3;  // dynamic param
    return score + 10;                          // static segment
  }, 0);
}

// matchTree sorts each sibling group by score before walking it
const ranked = [...routes].sort(
  (a, b) => scoreRoute(b.path) - scoreRoute(a.path),
);
// first match wins, but "first" is now "highest ranked"`}
        </pre>
      </div>

      <div style={{ ...metaBlockStyle, marginTop: "6px" }}>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>rule: </span>
          static segment &gt; dynamic param &gt; wildcard
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>tie: </span>
          equal scores keep definition order (stable sort)
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>codegen: </span>
          also sorts by specificity, so routeTree.gen.ts stays readable
        </div>
      </div>
    </div>
  );
}
