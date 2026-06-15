import { Link } from "michi";

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
];

export default function IndexPage() {
  return (
    <div style={{ maxWidth: "640px" }}>
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 800,
          letterSpacing: "-2px",
          lineHeight: 1.1,
          margin: "0 0 0.75rem",
        }}
      >
        What actually happens
        <br />
        when you click a link
        <br />
        in React?
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "#666",
          lineHeight: 1.6,
          margin: "0 0 2rem",
        }}
      >
        Michi is a client-side router built from first principles - the raw
        History API, regex pattern matching, and React's useSyncExternalStore.
        No library abstractions. Every line has a reason.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 1.25rem",
              border: "1px solid #e8e4df",
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.15s",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  marginBottom: "2px",
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: "13px", color: "#888" }}>{f.desc}</div>
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#aaa",
                fontFamily: "monospace",
                whiteSpace: "nowrap",
              }}
            >
              {f.tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
