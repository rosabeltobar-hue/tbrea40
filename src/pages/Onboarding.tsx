import { Link } from "react-router-dom";

export default function Onboarding() {
  return (
    <div style={{ padding: 20 }}>
      <Link to="/" style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        background: "var(--gradient-cool)",
        color: "white",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: 600,
        marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}>
        ← Back to Main Menu
      </Link>
      
      <h1>Onboarding</h1>
      <p>Let's customize your T-Break Plan</p>
    </div>
  );
}
