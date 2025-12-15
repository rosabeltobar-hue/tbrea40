import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signIn, resetPassword } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      const from = (location.state as any)?.from?.pathname ?? "/profile";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    setResetting(true);
    setError(null);
    setResetSuccess(false);
    
    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
      setResetEmail("");
    } catch (err: any) {
      setError(err?.message ?? "Failed to send reset email");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, rgba(142, 68, 173, 0.1) 0%, rgba(26, 188, 156, 0.1) 100%)",
      padding: 20
    }}>
      <div style={{
        background: "white",
        padding: 40,
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-xl)",
        maxWidth: 450,
        width: "100%"
      }}>
        <h1 style={{
          fontSize: "2rem",
          background: "var(--gradient-ocean)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginTop: 0,
          marginBottom: 10,
          textAlign: "center"
        }}>
          {showForgotPassword ? "🔑 Reset Password" : "🔐 Sign In"}
        </h1>
        
        <p style={{
          textAlign: "center",
          color: "var(--gray-dark)",
          marginBottom: 30
        }}>
          {showForgotPassword 
            ? "Enter your email to receive a password reset link" 
            : "Welcome back to T-Break!"}
        </p>

        {!showForgotPassword ? (
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block",
                fontWeight: 600,
                color: "var(--joy-purple)",
                marginBottom: 8
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  border: "2px solid var(--joy-teal)",
                  borderRadius: 8,
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block",
                fontWeight: 600,
                color: "var(--joy-purple)",
                marginBottom: 8
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  border: "2px solid var(--joy-teal)",
                  borderRadius: 8,
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(true);
                setError(null);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--joy-teal)",
                cursor: "pointer",
                fontSize: "0.9rem",
                padding: 0,
                marginBottom: 20,
                textDecoration: "underline"
              }}
            >
              Forgot your password?
            </button>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: 14,
                background: "var(--gradient-sunset)",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: "1.1rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "var(--shadow-md)",
                marginBottom: 15
              }}
            >
              ✨ Sign In
            </button>

            {error && (
              <div style={{
                background: "#ffebee",
                color: "#c62828",
                padding: 12,
                borderRadius: 8,
                fontSize: "0.9rem",
                marginBottom: 15
              }}>
                {error}
              </div>
            )}

            <div style={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "var(--gray-dark)"
            }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--joy-purple)",
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "underline"
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block",
                fontWeight: 600,
                color: "var(--joy-purple)",
                marginBottom: 8
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: 12,
                  border: "2px solid var(--joy-teal)",
                  borderRadius: 8,
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {resetSuccess && (
              <div style={{
                background: "#e8f5e9",
                color: "#2e7d32",
                padding: 12,
                borderRadius: 8,
                fontSize: "0.9rem",
                marginBottom: 15
              }}>
                ✓ Password reset email sent! Check your inbox.
              </div>
            )}

            {error && (
              <div style={{
                background: "#ffebee",
                color: "#c62828",
                padding: 12,
                borderRadius: 8,
                fontSize: "0.9rem",
                marginBottom: 15
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={resetting}
              style={{
                width: "100%",
                padding: 14,
                background: resetting ? "var(--gray-medium)" : "var(--gradient-sunset)",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: "1.1rem",
                fontWeight: 700,
                cursor: resetting ? "not-allowed" : "pointer",
                boxShadow: "var(--shadow-md)",
                marginBottom: 15
              }}
            >
              {resetting ? "Sending..." : "📧 Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError(null);
                setResetSuccess(false);
                setResetEmail("");
              }}
              style={{
                width: "100%",
                padding: 12,
                background: "white",
                color: "var(--gray-dark)",
                border: "2px solid var(--gray-light)",
                borderRadius: 8,
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
