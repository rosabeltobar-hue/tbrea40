// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { user } = useUser();

  const navItems = [
    { path: "/checkin", label: "Daily Check-in", icon: "📝", color: "var(--gradient-warm)" },
    { path: "/calendar", label: "Emotion Calendar", icon: "📅", color: "var(--gradient-ocean)" },
    { path: "/chat", label: "Community Chat", icon: "💬", color: "var(--gradient-cool)" },
    { path: "/nutrition", label: "Nutrition Center", icon: "🥗", color: "var(--gradient-forest)" },
    { path: "/estimator", label: "Metabolite Estimator", icon: "⚗️", color: "var(--gradient-sunset)" },
    { path: "/profile", label: "My Profile", icon: "👤", color: "var(--gradient-ocean)" },
    { path: "/donations", label: "💚 Support Us (Donations)", icon: "🎁", color: "var(--gradient-warm)", isSpecial: true },
  ];

  return (
    <div style={{ 
      padding: 20, 
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(26, 188, 156, 0.05) 0%, rgba(142, 68, 173, 0.05) 100%)"
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40, animation: "slideInDown 0.6s ease-out" }}>
          <h1 style={{ 
            fontSize: "3.5rem",
            background: "var(--gradient-sunset)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 10,
            animation: "bounce 3s ease-in-out infinite"
          }}>
            🎉 T-Break40 🎉
          </h1>
          {user ? (
            <div>
              <p style={{ fontSize: "1.3rem", color: "var(--joy-teal)", fontWeight: 600 }}>
                ✨ Welcome, {user.email}! ✨
              </p>
              <p style={{ color: "var(--gray-medium)", marginTop: 8 }}>
                You're on an amazing journey to transform your life
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "1.2rem", color: "var(--joy-purple)", fontWeight: 600 }}>
                Start your 40-day break journey!
              </p>
              <nav style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
                <Link to="/login" style={{
                  padding: "12px 24px",
                  background: "var(--gradient-cool)",
                  color: "white",
                  borderRadius: "var(--radius-lg)",
                  fontWeight: 600,
                }}>Login</Link>
                <Link to="/signup" style={{
                  padding: "12px 24px",
                  background: "var(--gradient-warm)",
                  color: "white",
                  borderRadius: "var(--radius-lg)",
                  fontWeight: 600,
                }}>Signup</Link>
              </nav>
            </div>
          )}
        </div>

        {/* Main Call to Action */}
        {user && (
          <div style={{
            background: "var(--gradient-rainbow)",
            backgroundSize: "200% 200%",
            padding: 20,
            borderRadius: "var(--radius-lg)",
            color: "white",
            textAlign: "center",
            marginBottom: 30,
            boxShadow: "var(--shadow-lg)",
            animation: "slideInUp 0.6s ease-out",
          }}>
            <h2 style={{ color: "white", marginTop: 0 }}>🚀 Get Started Today! 🚀</h2>
            <p style={{ color: "rgba(255,255,255,0.95)" }}>
              Log your mood, track your progress, and connect with our amazing community!
            </p>
          </div>
        )}

        {/* Navigation Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                color: "inherit",
                animation: "slideInUp 0.6s ease-out forwards",
              }}
            >
              <div style={{
                background: item.color,
                backgroundSize: "200% 200%",
                padding: 20,
                borderRadius: "var(--radius-lg)",
                color: "white",
                textAlign: "center",
                boxShadow: "var(--shadow-md)",
                transition: "all var(--transition-normal)",
                cursor: "pointer",
                transform: "scale(1)",
                border: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-8px) scale(1.05)";
                el.style.boxShadow = "var(--shadow-xl)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "scale(1)";
                el.style.boxShadow = "var(--shadow-md)";
              }}
              >
                <div style={{ fontSize: "3rem", marginBottom: 12, animation: "bounce 2s ease-in-out infinite" }}>
                  {item.icon}
                </div>
                <h3 style={{ 
                  color: "white",
                  marginTop: 0,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                  {item.label}
                </h3>
                <p style={{ 
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.95rem",
                  margin: 0,
                  fontWeight: 500
                }}>
                  {item.isSpecial ? "Make a difference" : "Click to explore"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{
          textAlign: "center",
          marginTop: 40,
          padding: 20,
          background: "white",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          animation: "slideInUp 0.8s ease-out",
        }}>
          <p style={{ fontSize: "1.1rem", color: "var(--gray-dark)" }}>
            💪 Remember: Every day you stay strong, you're building a better tomorrow!
          </p>
        </div>
      </div>
    </div>
  );
}
