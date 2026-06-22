import { type LoaderContext, useLoaderData } from "michi";
import { type User, fetchUser } from "../../mocks/api";
import { useSEO } from "../../components/use-seo";

export async function loader({ params }: LoaderContext<{ id: string }>) {
  return fetchUser(params.id);
}

export default function UserPage() {
  const user = useLoaderData<User>();
  useSEO({
    title: `User: ${user.name}`,
    description: `User profile for ${user.name} (${user.email}) - demo of loader + useLoaderData() for data fetching in a client-side router.`,
    path: `/user/${user.id}`,
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
        User Profile
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-muted)",
          margin: "0 0 2rem",
          maxWidth: "50ch",
        }}
      >
        This page uses a <code>loader</code> + <code>useLoaderData()</code> to fetch user data
        before rendering. The loader runs during navigation, and the component receives the resolved
        data.
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
            fetched via loader
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {user.name}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "var(--ink-muted)",
              marginTop: "2px",
            }}
          >
            {user.email}
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
            loader output
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
  id: "${user.id}",
  name: "${user.name}",
  email: "${user.email}"
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
          <span style={{ color: "var(--ink-faint)" }}>route pattern:</span> /user/$id
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>actual URL: </span> /user/
          {user.id}
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>loader: </span> fetchUser(params.id) &rarr;
          User object
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>hook: </span> useLoaderData&lt;User&gt;()
        </div>
      </div>
    </div>
  );
}
