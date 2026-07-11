import type { CSSProperties } from "react";
import { Link } from "michi";
import { useSEO } from "../components/use-seo";

const featureCardStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 18px",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius)",
  textDecoration: "none",
  color: "inherit",
  background: "var(--surface)",
  transition: "opacity 150ms ease",
};

const tagStyle: CSSProperties = {
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--ink-faint)",
  whiteSpace: "nowrap",
  marginLeft: "1rem",
  padding: "2px 8px",
  background: "var(--bg-raised)",
  borderRadius: "4px",
};

const features = [
  {
    title: "Dynamic Params",
    desc: "/user/$id fetches data via loader + useLoaderData()",
    to: "/user/atharv",
    tag: "Slice 4",
  },
  {
    title: "useParams Hook",
    desc: "/showcase/$id extracts URL params directly - no loader",
    to: "/showcase/michi",
    tag: "Slice 2",
  },
  {
    title: "Wildcard Routes",
    desc: "/files/* catches any depth of path segments",
    to: "/files/public/uploads/report.pdf",
    tag: "Slice 2",
  },
  {
    title: "Nested Layouts",
    desc: "/settings wraps children in a persistent sidebar",
    to: "/settings/profile",
    tag: "Slice 3",
  },
  {
    title: "Pathless Layouts",
    desc: "_auth wraps routes without adding a URL segment",
    to: "/dashboard",
    tag: "Slice 3",
  },
  {
    title: "Programmatic Nav",
    desc: "useRouter() for navigation from handlers and effects",
    to: "/navigate",
    tag: "Slice 1",
  },
  {
    title: "Loader Errors",
    desc: "Per-route error isolation when a loader throws",
    to: "/errors/loader-fail",
    tag: "Slice 5",
  },
  {
    title: "Render Errors",
    desc: "React error boundaries catch component throw",
    to: "/errors/render-fail",
    tag: "Slice 5",
  },
  {
    title: "Prefetch on Hover",
    desc: 'Hover a link with prefetch="intent" to run its loader early',
    to: "/prefetch",
    tag: "Slice 6",
  },
];

export default function IndexPage() {
  useSEO({
    title: "Michi",
    description:
      "A client-side router for React, built from first principles. No library abstractions - just the History API, regex pattern matching, and React primitives.",
    path: "/",
  });

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "3.5rem" }}>
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "0 0 1rem",
            color: "var(--ink)",
            textWrap: "balance",
          }}
        >
          What actually happens
          <br />
          when you click a link
          <br />
          <span style={{ color: "var(--accent)" }}>in React?</span>
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--ink-muted)",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "540px",
          }}
        >
          Michi is a client-side router built from first principles - the raw History API, regex
          pattern matching, and React's useSyncExternalStore. No library abstractions. Every line
          has a reason.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(194, 120, 50, 0.08)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "2px",
                  color: "var(--ink)",
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: "13px", color: "var(--ink-muted)" }}>{f.desc}</div>
            </div>
            <span style={tagStyle}>{f.tag}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
