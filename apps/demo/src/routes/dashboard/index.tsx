export default function DashboardHome() {
  return (
    <div>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          margin: "0 0 0.5rem",
        }}
      >
        Dashboard Overview
      </h2>
      <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
        Welcome to your dashboard. This is a nested layout - the sidebar stays
        mounted while you switch between Overview and Analytics.
      </p>
    </div>
  );
}
