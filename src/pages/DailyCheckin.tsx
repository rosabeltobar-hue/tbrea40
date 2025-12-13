// src/pages/DailyCheckin.tsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { saveDailyEntry, getDailyEntry } from "../services/dailyEntries";
import { estimateMetaboliteClearPercent } from "../services/metabolites";
import { computeDayNumber } from "../utils/dates";
import { DailyEntry } from "../types";

export default function DailyCheckin() {
  const { user, profile } = useUser();
  const [mood, setMood] = useState<string>("🙂");
  const [usedToday, setUsedToday] = useState(false);
  const [daysSinceLastUse, setDaysSinceLastUse] = useState<number>(0);
  const [frequency, setFrequency] = useState<
    "light" | "moderate" | "heavy" | "chronic"
  >("moderate");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [computedClearPercent, setComputedClearPercent] = useState<number | null>(
    null
  );

  const currentDay = profile?.startDate ? computeDayNumber(profile.startDate) : 1;

  const moods = [
    { emoji: "😔", label: "Struggling", color: "var(--gradient-sunset)" },
    { emoji: "😐", label: "Neutral", color: "var(--gradient-cool)" },
    { emoji: "🙂", label: "Good", color: "var(--gradient-forest)" },
    { emoji: "😄", label: "Excellent", color: "linear-gradient(135deg, #ff6b35 0%, #2ecc71 100%)" },
  ];

  const handleSave = async () => {
    if (!user) {
      setMessage("You need to be logged in to save.");
      return;
    }
    setSaving(true);
    setMessage("");

    const entry: DailyEntry = {
      id: `${user.uid}-${currentDay}`,
      userId: user.uid,
      dayNumber: currentDay,
      date: new Date().toISOString(),
      morningMood: mood,
      usedToday,
      metaboliteClearPercent: computedClearPercent ?? undefined
    };

    try {
      await saveDailyEntry(entry);
      setMessage("✨ Check-in saved! Great job! ✨");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving check-in.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const pct = estimateMetaboliteClearPercent(daysSinceLastUse, frequency);
    setComputedClearPercent(pct);
  }, [daysSinceLastUse, frequency]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const existing = await getDailyEntry(user.uid, currentDay);
        if (!mounted || !existing) return;
        if (typeof existing.metaboliteClearPercent === "number") {
          setComputedClearPercent(existing.metaboliteClearPercent);
        }
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const progressPercent = (currentDay / 40) * 100;

  return (
    <div style={{
      padding: 20,
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(46, 204, 113, 0.05) 100%)"
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 30, animation: "slideInDown 0.6s ease-out" }}>
          <h1 style={{
            fontSize: "2.5rem",
            background: "var(--gradient-sunset)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 10
          }}>
            📋 Daily Check-in
          </h1>
          <div style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "var(--gradient-ocean)",
            color: "white",
            borderRadius: "var(--radius-lg)",
            fontWeight: 600,
            fontSize: "1.1rem"
          }}>
            Day {currentDay} / 40
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          marginBottom: 30,
          background: "white",
          padding: 20,
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          animation: "slideInUp 0.6s ease-out"
        }}>
          <div style={{ fontSize: "0.9rem", color: "var(--gray-medium)", marginBottom: 8 }}>
            Progress: {Math.round(progressPercent)}%
          </div>
          <div style={{
            width: "100%",
            height: 12,
            background: "var(--gray-light)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "var(--gradient-sunset)",
              transition: "width 0.5s ease-out"
            }} />
          </div>
        </div>

        {/* Mood Selection */}
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: "var(--radius-lg)",
          marginBottom: 20,
          boxShadow: "var(--shadow-md)",
          animation: "slideInUp 0.65s ease-out"
        }}>
          <label style={{
            display: "block",
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: 16,
            color: "var(--joy-purple)"
          }}>
            How do you feel today? 😊
          </label>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12
          }}>
            {moods.map((moodItem) => (
              <button
                key={moodItem.emoji}
                onClick={() => setMood(moodItem.emoji)}
                className={mood === moodItem.emoji ? "active" : ""}
                style={{
                  background: mood === moodItem.emoji ? moodItem.color : "white",
                  color: mood === moodItem.emoji ? "white" : "var(--gray-dark)",
                  border: mood === moodItem.emoji ? "none" : "2px solid var(--gray-light)",
                  fontSize: "2rem",
                  padding: 16,
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  transition: "all var(--transition-normal)",
                  transform: mood === moodItem.emoji ? "scale(1.1)" : "scale(1)",
                  boxShadow: mood === moodItem.emoji ? "var(--shadow-lg)" : "var(--shadow-sm)",
                }}
              >
                {moodItem.emoji}
              </button>
            ))}
          </div>
          {mood && (
            <p style={{
              textAlign: "center",
              marginTop: 16,
              color: "var(--joy-teal)",
              fontWeight: 600,
              animation: "slideInUp 0.3s ease-out"
            }}>
              {moods.find(m => m.emoji === mood)?.label}
            </p>
          )}
        </div>

        {/* Usage Today */}
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: "var(--radius-lg)",
          marginBottom: 20,
          boxShadow: "var(--shadow-md)",
          animation: "slideInUp 0.7s ease-out"
        }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "var(--gray-dark)"
          }}>
            <input
              type="checkbox"
              checked={usedToday}
              onChange={(e) => setUsedToday(e.target.checked)}
              style={{ cursor: "pointer", width: 20, height: 20 }}
            />
            <span>{usedToday ? "❌" : "✅"} I used cannabis today</span>
          </label>
        </div>

        {/* Days Since Last Use */}
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: "var(--radius-lg)",
          marginBottom: 20,
          boxShadow: "var(--shadow-md)",
          animation: "slideInUp 0.75s ease-out"
        }}>
          <label style={{
            display: "block",
            fontWeight: 600,
            marginBottom: 12,
            color: "var(--joy-purple)"
          }}>
            Days since last use: 📅
          </label>
          <input
            type="number"
            min={0}
            value={daysSinceLastUse}
            onChange={(e) => setDaysSinceLastUse(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 12,
              border: "2px solid var(--gray-light)",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              transition: "all var(--transition-normal)"
            }}
          />
        </div>

        {/* Frequency Selection */}
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: "var(--radius-lg)",
          marginBottom: 20,
          boxShadow: "var(--shadow-md)",
          animation: "slideInUp 0.8s ease-out"
        }}>
          <label style={{
            display: "block",
            fontWeight: 600,
            marginBottom: 12,
            color: "var(--joy-purple)"
          }}>
            Usage frequency: 📊
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
            style={{
              width: "100%",
              padding: 12,
              border: "2px solid var(--joy-teal)",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              background: "white",
              cursor: "pointer",
              transition: "all var(--transition-normal)"
            }}
          >
            <option value="light">🟢 Light</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="heavy">🔴 Heavy</option>
            <option value="chronic">🔴🔴 Chronic</option>
          </select>
        </div>

        {/* Metabolite Clearance Display */}
        {computedClearPercent !== null && (
          <div style={{
            background: "var(--gradient-warm)",
            color: "white",
            padding: 20,
            borderRadius: "var(--radius-lg)",
            marginBottom: 20,
            boxShadow: "var(--shadow-lg)",
            animation: "slideInUp 0.85s ease-out"
          }}>
            <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: 8 }}>
              Estimated metabolite clearance
            </div>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: 12
            }}>
              {computedClearPercent}% 🧪
            </div>
            <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>
              Based on your usage pattern, your system should be mostly clear soon!
            </p>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div style={{
            background: message.includes("Error") ? "var(--gradient-sunset)" : "var(--gradient-forest)",
            color: "white",
            padding: 16,
            borderRadius: "var(--radius-lg)",
            marginBottom: 20,
            textAlign: "center",
            fontWeight: 600,
            animation: "slideInUp 0.4s ease-out"
          }}>
            {message}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: 18,
            fontSize: "1.1rem",
            fontWeight: 700,
            background: saving ? "var(--gray-medium)" : "var(--gradient-sunset)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-lg)",
            cursor: saving ? "not-allowed" : "pointer",
            transition: "all var(--transition-normal)",
            boxShadow: "var(--shadow-lg)",
            transform: saving ? "scale(0.98)" : "scale(1)",
            animation: "slideInUp 0.9s ease-out"
          }}
        >
          {saving ? "💾 Saving..." : "✨ Save My Check-in ✨"}
        </button>
      </div>
    </div>
  );
}
