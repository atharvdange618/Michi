import { Link } from "michi";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e8e4df",
        padding: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "14px",
        color: "#888",
      }}
    >
      <span>
        Built by{" "}
        <Link to="/about" style={{ color: "#333" }}>
          Atharv Dange
        </Link>
      </span>
      <span style={{ color: "#ccc" }}>·</span>
      <a
        href="https://github.com/atharvdange618/Michi"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#888" }}
      >
        <FaGithub size={16} />
      </a>
      <a
        href="https://x.com/atharvdangedev"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#888" }}
      >
        <FaXTwitter size={16} />
      </a>
    </footer>
  );
}
