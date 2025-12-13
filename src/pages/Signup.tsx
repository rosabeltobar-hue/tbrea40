import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signUp } from "../services/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signUp(email, password);
      const from = (location.state as any)?.from?.pathname ?? "/profile";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Sign up failed");
    }
  };

  return (
    <div>
      <h1>Create Account</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Sign Up</button>
        </div>
        {error && (
          <div style={{ color: "red", marginTop: 12 }}>{error}</div>
        )}
      </form>
    </div>
  );
}
