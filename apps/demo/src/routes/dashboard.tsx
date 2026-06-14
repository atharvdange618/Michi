import { Outlet, Link } from "michi";

const links = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/analytics", label: "Analytics" },
];

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <aside
        style={{
          minWidth: "160px",
          paddingTop: "0.25rem",
        }}
      >
        <h3
          style={{
            margin: "0 0 0.75rem",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "#aaa",
          }}
        >
          Dashboard
        </h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                fontSize: "14px",
                color: "#555",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </div>
    </div>
  );
}
