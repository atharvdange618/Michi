import { useParams } from "michi";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();

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
        Hello, {id}
      </h1>
      <p style={{ fontSize: "15px", color: "#666", margin: "0 0 1.5rem" }}>
        This route uses a <code>$id</code> dynamic segment. The{" "}
        <code>useParams()</code> hook extracted{" "}
        <code style={{ fontWeight: 600 }}>{id}</code> from the URL.
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
          <span style={{ color: "#888" }}>route pattern:</span> /user/$id
        </div>
        <div>
          <span style={{ color: "#888" }}>actual URL: </span> /user/{id}
        </div>
        <div>
          <span style={{ color: "#888" }}>extracted: </span>{" "}
          {"{ "}"id": {id}"{" }"}
        </div>
      </div>
    </div>
  );
}
