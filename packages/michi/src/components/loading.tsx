import { useEffect, useState } from "react";

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

export function Loading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          width: "32px",
          height: "32px",
          border: "3px solid #e8e4df",
          borderTopColor: "#1a1a1a",
          borderRadius: "50%",
          animation: "michi-spin 0.6s linear infinite",
        }}
      />
      <p
        style={{
          fontSize: "14px",
          color: "#888",
          marginTop: "16px",
          fontFamily: "monospace",
        }}
      >
        loading{dots}
      </p>
      <style>{`
        @keyframes michi-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
