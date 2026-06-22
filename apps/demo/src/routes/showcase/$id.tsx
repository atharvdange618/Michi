import { useParams } from "michi";
import { useSEO } from "../../components/use-seo";

export default function ParamsShowcasePage() {
  const params = useParams<{ id: string }>();
  useSEO({
    title: `Params: ${params.id}`,
    description: `URL parameter "${params.id}" extracted via useParams() - no loader required. Demo of dynamic route parameters.`,
    path: `/showcase/${params.id}`,
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
        useParams
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-muted)",
          margin: "0 0 2rem",
          maxWidth: "50ch",
        }}
      >
        This page uses <code>useParams()</code> to read dynamic segments directly from the URL - no
        loader needed. The hook merges params from all matched routes in the tree.
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
            extracted params
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {params.id}
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
            raw object
          </div>
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
  id: "${params.id}"
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
          <span style={{ color: "var(--ink-faint)" }}>route pattern:</span> /showcase/$id
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>actual URL: </span> /showcase/{params.id}
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>hook: </span> useParams&lt;{`{ id: string }`}
          &gt;()
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>loader: </span> none (sync extraction)
        </div>
      </div>
    </div>
  );
}
