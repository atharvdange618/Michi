export default function AnalyticsPage() {
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
        Analytics
      </h2>
      <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
        View your analytics data here. This page is 3 levels deep: root layout →{" "}
        <code>_auth</code> → dashboard sidebar → this content.
      </p>
    </div>
  );
}
