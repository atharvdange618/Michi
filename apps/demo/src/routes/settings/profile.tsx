import { useLoaderData, type LoaderContext } from "michi";
import { useSEO } from "../../components/use-seo";
import { fetchProfile } from "../../mocks/api";

export async function loader(_: LoaderContext) {
  return fetchProfile();
}

const calloutStyle: React.CSSProperties = {
  background: "var(--blue-soft)",
  border: "1px solid var(--blue-border)",
  borderRadius: "var(--radius)",
  padding: "1rem 1.25rem",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--blue)",
};

const codeStyle: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "12px",
  background: "rgba(55, 100, 180, 0.1)",
  padding: "1px 6px",
  borderRadius: "4px",
};

const dataBlockStyle: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "13px",
  padding: "0.75rem 1rem",
  background: "var(--bg-inset)",
  borderRadius: "var(--radius)",
  lineHeight: 1.8,
  border: "1px solid var(--border-subtle)",
  marginBottom: "1.25rem",
};

export default function ProfilePage() {
  const data = useLoaderData<Awaited<ReturnType<typeof fetchProfile>>>();
  useSEO({
    title: "Profile",
    description:
      "User profile settings page - nested child route within the settings layout using Outlet pattern.",
    path: "/settings/profile",
  });
  return (
    <div>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: "0 0 1rem",
        }}
      >
        Profile
      </h2>

      <div style={dataBlockStyle}>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>profile loader call #:</span>{" "}
          {data.callCount}
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>resolved at:</span> {data.resolvedAt}
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>name:</span> {data.name}
        </div>
      </div>

      <div style={calloutStyle}>
        <strong>Parallel loaders + caching:</strong>
        <br />
        Both <code style={codeStyle}>settings.tsx</code> (layout) and{" "}
        <code style={codeStyle}>profile.tsx</code> (this page) have loaders. When you navigated
        here, Michi ran both in parallel.
        <br />
        <br />
        <strong>Try it:</strong> Click "Billing" in the sidebar, then come back to "Profile". The
        settings layout loader call count stays the same (cached). Only the profile loader
        re-runs.
      </div>
    </div>
  );
}
