export default function ProfilePage() {
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
        Profile
      </h2>
      <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
        Edit your profile settings here. This page is nested: root layout →{" "}
        <code>/settings</code> sidebar → this content.
      </p>
    </div>
  );
}
