import { Link } from "react-router-dom";

export default function NutritionLibrary() {
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
      
      <h1>Nutrition Support</h1>
      <p>Foods, herbs, teas, vitamins</p>
    </div>
  );
}
