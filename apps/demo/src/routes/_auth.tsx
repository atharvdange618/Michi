import { Outlet } from "michi";

export default function AuthLayout() {
  return (
    <div
      style={{
        border: "2px dashed #4ade80",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      <p
        style={{
          margin: "0 0 0.75rem",
          fontSize: "12px",
          fontFamily: "monospace",
          color: "#4ade80",
        }}
      >
        _auth layout - pathless, adds no URL segment
      </p>
      <Outlet />
    </div>
  );
}
