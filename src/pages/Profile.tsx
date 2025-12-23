import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getUser, createUser } from "../services/user";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [yearsOfUse, setYearsOfUse] = useState<number | null>(null);
  const [usageType, setUsageType] = useState<string>("smoke");
  const [frequency, setFrequency] = useState<string>("moderate");
  const [wantsNotifications, setWantsNotifications] = useState<boolean>(true);
  const [recommendedDays, setRecommendedDays] = useState<number>(40);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const doc = await getUser(user.uid);
        if (!mounted) return;
        if (doc?.displayName) setDisplayName(doc.displayName);
        if (doc?.startDate) {
          const d = new Date(doc.startDate);
          const isoDate = d.toISOString().slice(0, 10);
          setStartDate(isoDate);
        }
        if (doc?.age) setAge(doc.age);
        if (doc?.weight) setWeight(doc.weight);
        if (doc?.yearsOfUse) setYearsOfUse(doc.yearsOfUse);
        if (doc?.usageType) setUsageType(doc.usageType);
        if (doc?.frequency) setFrequency(doc.frequency);
        if (doc?.notifications?.enabled !== undefined) setWantsNotifications(doc.notifications.enabled);
        if (doc?.recommendedBreakDays) setRecommendedDays(doc.recommendedBreakDays);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Calculate recommended break duration based on usage pattern
  useEffect(() => {
    let days = 40; // Default
    
    if (frequency === "light") days = 21;
    else if (frequency === "moderate") days = 30;
    else if (frequency === "heavy") days = 40;
    else if (frequency === "chronic") days = 60;
    
    // Add extra days for long-term users
    if (yearsOfUse && yearsOfUse > 5) days += 10;
    if (yearsOfUse && yearsOfUse > 10) days += 10;
    
    // Edibles take longer to clear
    if (usageType === "edible") days += 7;
    
    setRecommendedDays(days);
  }, [frequency, yearsOfUse, usageType]);

  const handleSave = async () => {
    if (!user) {
      setMessage("Please sign in to update your profile.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const iso = startDate ? new Date(startDate).toISOString() : undefined;
      
      // Get existing user data to preserve required fields
      const existingUser = await getUser(user.uid);
      
      await createUser(user.uid, { 
        // Preserve required fields with defaults if they don't exist
        id: user.uid,
        email: user.email || undefined,
        displayName: displayName || undefined,
        createdAt: existingUser?.createdAt || Date.now(),
        plan: existingUser?.plan || "free",
        usageType: usageType as any,
        frequency: frequency as any,
        durationMonths: existingUser?.durationMonths || 0,
        goal: existingUser?.goal || "40day",
        currentDay: existingUser?.currentDay || 0,
        relapseCount: existingUser?.relapseCount || 0,
        streakDays: existingUser?.streakDays || 0,
        totalCoins: existingUser?.totalCoins || 0,
        avatarType: existingUser?.avatarType || "default",
        avatarBorderColor: existingUser?.avatarBorderColor || "#4CAF50",
        avatarMedals: existingUser?.avatarMedals || [],
        
        // Optional profile fields
        startDate: iso,
        age: age || undefined,
        weight: weight || undefined,
        yearsOfUse: yearsOfUse || undefined,
        recommendedBreakDays: recommendedDays,
        notifications: {
          enabled: wantsNotifications,
          dailyReminder: wantsNotifications,
          milestones: wantsNotifications,
          encouragement: wantsNotifications,
        }
      });
      setMessage("Saved! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Profile save error:", err);
      setMessage("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 700, 
      margin: "0 auto",
      background: "linear-gradient(135deg, rgba(26, 188, 156, 0.03) 0%, rgba(142, 68, 173, 0.03) 100%)",
      minHeight: "100vh"
    }}>
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
      
      <h1 style={{
        background: "var(--gradient-ocean)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: 10
      }}>My Profile</h1>
      <p style={{ color: "var(--gray-medium)", marginBottom: 30 }}>
        Help us personalize your T-break journey
      </p>

      <div style={{ 
        background: "white", 
        padding: 30, 
        borderRadius: 12, 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
      }}>
        <div style={{ marginBottom: 20 }}>
          <strong>Signed in as:</strong>{" "}
          <span style={{ color: "var(--joy-teal)" }}>{user ? user.email : "Not signed in"}</span>
        </div>

        {/* Display Name for Chat */}
        <div style={{ 
          marginBottom: 30, 
          paddingBottom: 20, 
          borderBottom: "1px solid var(--gray-light)" 
        }}>
          <h3 style={{ color: "var(--joy-purple)", marginBottom: 15 }}>👤 Chat Display Name</h3>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
              Display Name (shown in community chat)
            </label>
            <input
              type="text"
              placeholder="Enter your chat name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{ 
                width: "100%", 
                padding: 10, 
                borderRadius: 6, 
                border: "2px solid var(--joy-teal)",
                fontSize: "1rem"
              }}
            />
            <p style={{ 
              fontSize: "0.85rem", 
              color: "var(--gray-medium)", 
              marginTop: 5,
              marginBottom: 0 
            }}>
              This name will be visible to other users in the chat room
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div style={{ 
          marginBottom: 30, 
          paddingBottom: 20, 
          borderBottom: "1px solid var(--gray-light)" 
        }}>
          <h3 style={{ color: "var(--joy-purple)", marginBottom: 15 }}>📋 Personal Information</h3>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
              Age (years)
            </label>
            <input
              type="number"
              placeholder="25"
              value={age ?? ""}
              onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : null)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--gray-light)" }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
              Weight (kg)
            </label>
            <input
              type="number"
              placeholder="70"
              value={weight ?? ""}
              onChange={(e) => setWeight(e.target.value ? parseInt(e.target.value) : null)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--gray-light)" }}
            />
            <small style={{ color: "var(--gray-medium)" }}>
              Used for metabolite calculations
            </small>
          </div>
        </div>

        {/* Cannabis Usage History */}
        <div style={{ 
          marginBottom: 30, 
          paddingBottom: 20, 
          borderBottom: "1px solid var(--gray-light)" 
        }}>
          <h3 style={{ color: "var(--joy-orange)", marginBottom: 15 }}>🌿 Cannabis Usage History</h3>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
              Years of use
            </label>
            <input
              type="number"
              placeholder="5"
              value={yearsOfUse ?? ""}
              onChange={(e) => setYearsOfUse(e.target.value ? parseInt(e.target.value) : null)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--gray-light)" }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
              Primary consumption method
            </label>
            <select
              value={usageType}
              onChange={(e) => setUsageType(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--gray-light)" }}
            >
              <option value="smoke">🚬 Smoke (joints, bongs)</option>
              <option value="vape">💨 Vape</option>
              <option value="edible">🍪 Edibles</option>
              <option value="dab">💎 Dabs/Concentrates</option>
              <option value="other">🌟 Other</option>
            </select>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
              Usage frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--gray-light)" }}
            >
              <option value="light">💚 Light (1-2 times/week)</option>
              <option value="moderate">💛 Moderate (3-4 times/week)</option>
              <option value="heavy">🧡 Heavy (daily, 1-2 times/day)</option>
              <option value="chronic">❤️ Chronic (multiple times daily)</option>
            </select>
          </div>

          <div style={{ 
            padding: 15, 
            background: "var(--joy-purple-light)", 
            borderRadius: 8,
            border: "2px solid var(--joy-purple)"
          }}>
            <strong style={{ color: "var(--joy-purple)" }}>
              📊 Recommended break duration: {recommendedDays} days
            </strong>
            <p style={{ marginTop: 8, fontSize: "0.9rem", color: "var(--gray-dark)" }}>
              Based on your usage pattern, we recommend a {recommendedDays}-day break for optimal THC clearance.
            </p>
          </div>
        </div>

        {/* T-Break Start Date */}
        <div style={{ 
          marginBottom: 30, 
          paddingBottom: 20, 
          borderBottom: "1px solid var(--gray-light)" 
        }}>
          <h3 style={{ color: "var(--joy-teal)", marginBottom: 15 }}>📅 T-Break Timeline</h3>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
              Start date
            </label>
            <input
              type="date"
              value={startDate ?? ""}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--gray-light)" }}
            />
          </div>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ color: "var(--joy-green)", marginBottom: 15 }}>🔔 Notifications</h3>
          
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={wantsNotifications}
              onChange={(e) => setWantsNotifications(e.target.checked)}
              style={{ marginRight: 10, width: 20, height: 20 }}
            />
            <span>Enable daily reminders and milestone notifications</span>
          </label>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: 30 }}>
          <button 
            onClick={handleSave} 
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: loading ? "var(--gray-medium)" : "var(--gradient-sunset)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: "1.1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Saving..." : "💾 Save Profile"}
          </button>
          {message && (
            <div style={{ 
              marginTop: 15, 
              padding: 12,
              borderRadius: 8,
              background: message.includes("Failed") ? "#ffebee" : "#e8f5e9",
              color: message.includes("Failed") ? "#c62828" : "#2e7d32",
              fontWeight: 600,
              textAlign: "center"
            }}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: "center" }}>
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
