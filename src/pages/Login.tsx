import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signIn } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
      setError(err?.message ?? "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: "0 20px" }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", marginTop: 8, padding: 8 }}
            />
          </label>
        </div>
        <div style={{ marginTop: 16 }}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", marginTop: 8, padding: 8 }}
            />
          </label>
        </div>
        {error && (
          <div style={{ color: "red", marginTop: 12 }}>{error}</div>
        )}
        <div style={{ marginTop: 20 }}>
          <button type="submit" style={{ padding: "10px 20px" }}>
            Login
          </button>
        </div>
      </form>
      <div style={{ marginTop: 20 }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
