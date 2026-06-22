import { useRouter } from "../react";

export function RouteError({ error }: { error: unknown }) {
  const router = useRouter();
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div
      style={{
        padding: "2rem",
        border: "2px dashed #ff4d4d",
        borderRadius: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2 style={{ margin: "0 0 0.5rem", color: "#ff4d4d" }}>
        Something broke
      </h2>

      <p
        style={{
          fontFamily: "monospace",
          fontSize: "13px",
          color: "#888",
          margin: "0 0 1rem",
        }}
      >
        {message}
      </p>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #e8e4df",
            borderRadius: "6px",
            background: "#f3f0eb",
            cursor: "pointer",
          }}
        >
          retry
        </button>
        <button
          type="button"
          onClick={() => router.navigate("/")}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #e8e4df",
            borderRadius: "6px",
            background: "#f3f0eb",
            cursor: "pointer",
          }}
        >
          go home
        </button>
      </div>
    </div>
  );
}
