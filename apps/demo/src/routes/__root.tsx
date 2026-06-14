import { Link, Outlet } from "michi";
import { Footer } from "../components/footer";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/navigate", label: "Navigate" },
  { to: "/user/atharv", label: "Atharv" },
  { to: "/user/maithili", label: "Maithili" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/analytics", label: "Analytics" },
  { to: "/settings/profile", label: "Profile" },
  { to: "/settings/billing", label: "Billing" },
  { to: "/files/public/uploads/report.pdf", label: "Files" },
];

export default function RootLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#1a1a1a",
        background: "#faf8f5",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: "1.25rem",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #e8e4df",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "-0.5px",
            marginRight: "0.5rem",
            textDecoration: "none",
            color: "black",
          }}
        >
          道 Michi
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <main style={{ flex: 1, padding: "2rem 1.5rem" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
