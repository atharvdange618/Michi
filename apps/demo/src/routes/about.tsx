import type { CSSProperties } from "react";
import { useSEO } from "../components/use-seo";

const outlineBtnStyle: CSSProperties = {
  padding: "6px 12px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  fontSize: "13px",
  color: "var(--ink-muted)",
  textDecoration: "none",
  transition: "opacity 150ms ease",
  background: "var(--surface)",
};

const blogCardStyle: CSSProperties = {
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

export default function AboutPage() {
  useSEO({
    title: "About",
    description:
      "Learn why Michi was built, the tech stack behind it, and the architectural decisions that make it work. TypeScript, Turborepo, Vitest, and zero runtime dependencies.",
    path: "/about",
  });

  return (
    <div style={{ maxWidth: "720px" }}>
      <h1
        style={{
          fontSize: "clamp(32px, 4vw, 44px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: "0 0 2rem",
          textWrap: "balance",
        }}
      >
        About Michi
      </h1>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 700,
            margin: "0 0 0.6rem",
            letterSpacing: "-0.01em",
          }}
        >
          What is this?
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--ink-muted)",
            lineHeight: 1.7,
            margin: 0,
            maxWidth: "60ch",
          }}
        >
          Michi (道) is a client-side router for React, built from first principles. No routing
          libraries, no framework abstractions - just the raw History API, regex pattern matching,
          and React's <code>useSyncExternalStore</code>. It's not trying to replace React Router or
          TanStack Router. It's here to answer the question: what actually happens between the click
          and the render?
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 700,
            margin: "0 0 0.6rem",
            letterSpacing: "-0.01em",
          }}
        >
          Why does this exist?
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--ink-muted)",
            lineHeight: 1.7,
            margin: 0,
            maxWidth: "60ch",
          }}
        >
          I've used React Router and TanStack Router in production for years. They work great. But I
          never really understood <em>how</em> they work - not the API or docs-level understanding,
          but the actual internals. What happens between the click and the render. How does the URL
          change without a page reload. How does a pattern like <code>/user/$id</code> turn into
          something that actually matches <code>/user/atharv</code>. What keeps two components from
          seeing different URLs in the same render pass.
        </p>
        <p
          style={{
            fontSize: "15px",
            color: "var(--ink-muted)",
            lineHeight: 1.7,
            margin: "1rem 0 0",
            maxWidth: "60ch",
          }}
        >
          So I started building one. Michi follows the same spirit as my other deep-dive projects -
          the code teaches, the README/Blog explains the why. Each feature is built as a
          self-contained slice that answers a specific question about how routing works.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            marginTop: "1.25rem",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://github.com/atharvdange618/rendering-strategies"
            target="_blank"
            rel="noopener noreferrer"
            style={outlineBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--ink-muted)";
            }}
          >
            rendering-strategies
          </a>
          <a
            href="https://tty.atharvdangedev.in/blog/rendering-strategies"
            target="_blank"
            rel="noopener noreferrer"
            style={outlineBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--ink-muted)";
            }}
          >
            rendering strategies blog
          </a>
          <a
            href="https://github.com/atharvdange618/Hikari"
            target="_blank"
            rel="noopener noreferrer"
            style={outlineBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--ink-muted)";
            }}
          >
            Hikari
          </a>
        </div>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 700,
            margin: "0 0 0.6rem",
            letterSpacing: "-0.01em",
          }}
        >
          Blog posts
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--ink-muted)",
            lineHeight: 1.7,
            margin: "0 0 1rem",
            maxWidth: "60ch",
          }}
        >
          Each slice of Michi has a corresponding blog post that walks through the implementation
          from first principles.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <a
            href="https://tty.atharvdangedev.in/blog/what-happens-when-you-click-a-link-in-react"
            target="_blank"
            rel="noopener noreferrer"
            style={blogCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "2px",
                }}
              >
                What Actually Happens When You Click a Link in React
              </div>
              <div style={{ fontSize: "13px", color: "var(--ink-muted)" }}>
                History API, route matching, useSyncExternalStore - Slices 1-2
              </div>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "'Geist Mono', monospace",
                color: "var(--ink-faint)",
                whiteSpace: "nowrap",
                marginLeft: "1rem",
              }}
            >
              June 12
            </span>
          </a>
          <a
            href="https://tty.atharvdangedev.in/blog/layout-that-persists-and-data-that-arrives-before-you-do"
            target="_blank"
            rel="noopener noreferrer"
            style={blogCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "2px",
                }}
              >
                Layouts That Persist and Data That Arrives Before You Do
              </div>
              <div style={{ fontSize: "13px", color: "var(--ink-muted)" }}>
                Nested routes, Outlet pattern, data loaders - Slices 3-4
              </div>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "'Geist Mono', monospace",
                color: "var(--ink-faint)",
                whiteSpace: "nowrap",
                marginLeft: "1rem",
              }}
            >
              June 16
            </span>
          </a>
          <a
            href="https://tty.atharvdangedev.in/blog/per-route-error-boundaries-and-prefetch-on-hover"
            target="_blank"
            rel="noopener noreferrer"
            style={blogCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "2px",
                }}
              >
                Per-Route Error Boundaries and Prefetch on Hover
              </div>
              <div style={{ fontSize: "13px", color: "var(--ink-muted)" }}>
                Error isolation, prefetch cache, search params - Slices 5-6
              </div>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "'Geist Mono', monospace",
                color: "var(--ink-faint)",
                whiteSpace: "nowrap",
                marginLeft: "1rem",
              }}
            >
              June 20
            </span>
          </a>
          <a
            href="https://tty.atharvdangedev.in/blog/the-url-remembers-and-the-filesystem-already-knows"
            target="_blank"
            rel="noopener noreferrer"
            style={blogCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "2px",
                }}
              >
                The URL Remembers, and the Filesystem Already Knows
              </div>
              <div style={{ fontSize: "13px", color: "var(--ink-muted)" }}>
                Search params, codegen, typed routes - Slices 7-8
              </div>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "'Geist Mono', monospace",
                color: "var(--ink-faint)",
                whiteSpace: "nowrap",
                marginLeft: "1rem",
              }}
            >
              July 22
            </span>
          </a>
        </div>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 700,
            margin: "0 0 0.6rem",
            letterSpacing: "-0.01em",
          }}
        >
          The name
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--ink-muted)",
            lineHeight: 1.7,
            margin: 0,
            maxWidth: "60ch",
          }}
        >
          道 (michi) is Japanese for "path" or "the way." Seemed fitting for a project about
          understanding how routing works - the path between a URL change and what renders on
          screen.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 700,
            margin: "0 0 0.6rem",
            letterSpacing: "-0.01em",
          }}
        >
          Tech stack
        </h2>
        <ul
          style={{
            fontSize: "15px",
            color: "var(--ink-muted)",
            lineHeight: 1.7,
            margin: 0,
            paddingLeft: "1.25rem",
            maxWidth: "60ch",
          }}
        >
          <li>TypeScript (strict, from day one)</li>
          <li>Turborepo + pnpm workspaces</li>
          <li>Vite + React 19 for the demo app</li>
          <li>Pure TypeScript for the router - zero runtime dependencies</li>
          <li>Vitest + @testing-library/react for tests</li>
          <li>Blume for the docs site</li>
        </ul>
      </section>
    </div>
  );
}
