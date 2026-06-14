import { useParams } from "michi";

export default function FilePage() {
  const { "*": filePath } = useParams<{ "*": string }>();

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
        File Viewer
      </h1>
      <p style={{ fontSize: "15px", color: "#666", margin: "0 0 1.5rem" }}>
        This route uses a <code>*</code> wildcard - it matches any path under{" "}
        <code>/files/</code>, no matter how deep.
      </p>
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
          <span style={{ color: "#888" }}>route pattern:</span> /files/*
        </div>
        <div>
          <span style={{ color: "#888" }}>actual URL: </span> /files/{filePath}
        </div>
        <div>
          <span style={{ color: "#888" }}>extracted: </span> {"{ "}"*":{" "}
          {filePath}"{" }"}
        </div>
      </div>
    </div>
  );
}
