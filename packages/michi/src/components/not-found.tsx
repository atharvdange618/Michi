import { useEffect, useState } from "react";
import { useRouter } from "../react";

// NOTE: NotFound uses useRouter() to navigate home on button click.
// This means it MUST be rendered inside a <RouterProvider>.
// It is always safe to use as the default Outlet fallback or as the
// top-level 404 in RouterProvider, since both are within the provider tree.
// Do not render <NotFound /> outside a RouterProvider.

const BROKEN_PATHS = [
  "this/page",
  "the/way",
  "anywhere",
  "something",
  "hope",
  "a/destination",
];

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "system-ui, -apple-system, sans-serif",
  color: "#1a1a1a",
  background: "#faf8f5",
  userSelect: "none",
};

const headingBaseStyle: React.CSSProperties = {
  fontSize: "144px",
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: "-4px",
  background: "linear-gradient(135deg, #ff4d4d, #ff8c00, #ffcc00)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  transition: "transform 0.05s",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "32px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: 600,
  border: "1px solid #e8e4df",
  borderRadius: "8px",
  background: "#f3f0eb",
  color: "#1a1a1a",
  cursor: "pointer",
  transition: "background 0.15s, border-color 0.15s",
};

export function NotFound() {
  const router = useRouter();
  const [glitch, setGlitch] = useState(false);
  const [pathIdx, setPathIdx] = useState(0);
  const path = BROKEN_PATHS[pathIdx];

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => {
        setPathIdx((i) => (i + 1) % BROKEN_PATHS.length);
        setGlitch(false);
      }, 150);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...headingBaseStyle,
          transform: glitch ? "skewX(-4deg) translateX(4px)" : "none",
          filter: glitch ? "hue-rotate(90deg)" : "none",
        }}
      >
        404
      </div>

      <p
        style={{
          fontSize: "18px",
          color: "#888",
          marginTop: "16px",
          fontFamily: "monospace",
        }}
      >
        could not find{" "}
        <span
          style={{
            color: "#ff4d4d",
            textDecoration: glitch ? "line-through" : "none",
          }}
        >
          /{path}
        </span>
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#aaa",
          marginTop: "8px",
        }}
      >
        this route doesn't exist... yet?
      </p>

      <button
        type="button"
        onClick={() => router.navigate("/")}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ebe7e0";
          e.currentTarget.style.borderColor = "#d5d0c8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#f3f0eb";
          e.currentTarget.style.borderColor = "#e8e4df";
        }}
      >
        go home
      </button>
    </div>
  );
}
