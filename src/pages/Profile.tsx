import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getUser, createUser } from "../services/user";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const doc = await getUser(user.uid);
        if (!mounted) return;
        if (doc?.startDate) {
          // convert ISO to yyyy-mm-dd for input[type=date]
          const d = new Date(doc.startDate);
          const isoDate = d.toISOString().slice(0, 10);
          setStartDate(isoDate);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      setMessage("Please sign in to update your profile.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const iso = startDate ? new Date(startDate).toISOString() : null;
      await createUser(user.uid, { startDate: iso || undefined });
      setMessage("Saved! Redirecting to dashboard...");
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save start date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>My Profile</h1>
      <p>Edit settings, avatar, and subscription</p>

      <div style={{ marginTop: 16 }}>
        <strong>Signed in as:</strong>{" "}
        {user ? user.email : "Not signed in"}
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          T-break start date:{" "}
          <input
            type="date"
            value={startDate ?? ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Start Date"}
        </button>
        {message && <span style={{ marginLeft: 12, color: message.includes("Failed") ? "red" : "var(--joy-green)" }}>{message}</span>}
      </div>

      <div style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid var(--gray-light)" }}>
        <Link to="/" style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "var(--gradient-ocean)",
          color: "white",
          textDecoration: "none",
          borderRadius: 8,
          fontWeight: 600,
          transition: "transform 0.2s",
        }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
