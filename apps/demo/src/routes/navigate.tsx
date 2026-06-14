import { useRouter } from "michi";

export default function NavigatePage() {
  const router = useRouter();

  const routes = [
    { label: "Go Home", path: "/" },
    { label: "Go to About", path: "/about" },
    { label: "Go to /user/michi", path: "/user/michi" },
    { label: "Go to /files/a/b/c", path: "/files/a/b/c" },
    { label: "Go to /settings/profile", path: "/settings/profile" },
  ];

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
        Programmatic Navigation
      </h1>
      <p style={{ fontSize: "15px", color: "#666", margin: "0 0 1.5rem" }}>
        This page uses <code>useRouter()</code> to navigate via button clicks -
        no <code>&lt;Link&gt;</code> needed.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {routes.map((r) => (
          <button
            key={r.path}
            onClick={() => router.navigate(r.path)}
            style={{
              padding: "0.75rem 1rem",
              border: "1px solid #e8e4df",
              borderRadius: "6px",
              background: "#f3f0eb",
              fontSize: "14px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{r.label}</span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#aaa",
              }}
            >
              {r.path}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
