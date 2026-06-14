export default function AboutPage() {
  return (
    <div style={{ maxWidth: "640px" }}>
      <h1
        style={{
          fontSize: "40px",
          fontWeight: 800,
          letterSpacing: "-1.5px",
          margin: "0 0 1.5rem",
        }}
      >
        About Michi
      </h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            margin: "0 0 0.5rem",
          }}
        >
          What is this?
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#555",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Michi (道) is a client-side router for React, built from first
          principles. No routing libraries, no framework abstractions - just the
          raw History API, regex pattern matching, and React's{" "}
          <code>useSyncExternalStore</code>. It's not trying to replace React
          Router or TanStack Router. It's here to answer the question: what
          actually happens between the click and the render?
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            margin: "0 0 0.5rem",
          }}
        >
          Why does this exist?
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#555",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          I've used React Router and TanStack Router in production for years.
          They work great. But I never really understood <em>how</em> they work
          - not the API or docs-level understanding, but the actual internals.
          What happens between the click and the render. How does the URL change
          without a page reload. How does a pattern like <code>/user/$id</code>{" "}
          turn into something that actually matches <code>/user/atharv</code>.
          What keeps two components from seeing different URLs in the same
          render pass.
        </p>
        <p
          style={{
            fontSize: "15px",
            color: "#555",
            lineHeight: 1.7,
            margin: "1rem 0 0",
          }}
        >
          So I started building one. Michi follows the same spirit as my other
          deep-dive projects - the code teaches, the README/Blog explains the
          why. Each feature is built as a self-contained slice that answers a
          specific question about how routing works.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://github.com/atharvdange618/rendering-strategies"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #e0dbd4",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#555",
              textDecoration: "none",
            }}
          >
            rendering-strategies
          </a>
          <a
            href="https://tty.atharvdangedev.in/blog/rendering-strategies"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #e0dbd4",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#555",
              textDecoration: "none",
            }}
          >
            rendering strategies blog
          </a>
          <a
            href="https://github.com/atharvdange618/React-Vdom"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #e0dbd4",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#555",
              textDecoration: "none",
            }}
          >
            React-Vdom
          </a>
        </div>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            margin: "0 0 0.5rem",
          }}
        >
          The name
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#555",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          道 (michi) is Japanese for "path" or "the way." Seemed fitting for a
          project about understanding how routing works - the path between a URL
          change and what renders on screen.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            margin: "0 0 0.5rem",
          }}
        >
          Tech stack
        </h2>
        <ul
          style={{
            fontSize: "15px",
            color: "#555",
            lineHeight: 1.7,
            margin: 0,
            paddingLeft: "1.25rem",
          }}
        >
          <li>TypeScript (strict, from day one)</li>
          <li>Turborepo + pnpm workspaces</li>
          <li>Vite + React 19 for the demo app</li>
          <li>Pure TypeScript for the router - zero runtime dependencies</li>
          <li>Vitest + @testing-library/react for tests</li>
        </ul>
      </section>
    </div>
  );
}
