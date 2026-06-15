import { useParams } from "michi";

export default function ParamsShowcasePage() {
  const params = useParams<{ id: string }>();

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 800,
          letterSpacing: "-1px",
          margin: "0 0 0.5rem",
        }}
      >
        useParams
      </h1>
      <p style={{ fontSize: "15px", color: "#666", margin: "0 0 1.5rem" }}>
        This page uses <code>useParams()</code> to read dynamic segments
        directly from the URL - no loader needed. The hook merges params from
        all matched routes in the tree.
      </p>

      <div
        style={{
          border: "1px solid #e8e4df",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            padding: "1.25rem",
            background: "#f3f0eb",
            borderBottom: "1px solid #e8e4df",
          }}
        >
          <div
            style={{ fontSize: "13px", color: "#888", marginBottom: "0.25rem" }}
          >
            extracted params
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            {params.id}
          </div>
        </div>

        <div style={{ padding: "1.25rem" }}>
          <div
            style={{ fontSize: "13px", color: "#888", marginBottom: "0.5rem" }}
          >
            raw object
          </div>
          <pre
            style={{
              fontFamily: "monospace",
              fontSize: "13px",
              lineHeight: 1.8,
              margin: 0,
              whiteSpace: "pre-wrap",
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
          fontFamily: "monospace",
          fontSize: "13px",
          padding: "1rem",
          background: "#f3f0eb",
          borderRadius: "6px",
          lineHeight: 1.8,
        }}
      >
        <div>
          <span style={{ color: "#888" }}>route pattern:</span> /showcase/$id
        </div>
        <div>
          <span style={{ color: "#888" }}>actual URL: </span> /showcase/
          {params.id}
        </div>
        <div>
          <span style={{ color: "#888" }}>hook: </span> useParams&lt;
          {`{ id: string }`}&gt;()
        </div>
        <div>
          <span style={{ color: "#888" }}>loader: </span> none (sync extraction)
        </div>
      </div>
    </div>
  );
}
