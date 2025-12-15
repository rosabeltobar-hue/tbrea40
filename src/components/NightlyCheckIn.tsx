import { useState, useEffect } from "react";

interface NightlyCheckInProps {
  onClose: () => void;
  onSubmit: (mood: string, notes: string) => void;
}

export function NightlyCheckIn({ onClose, onSubmit }: NightlyCheckInProps) {
  const [mood, setMood] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const moods = [
    { emoji: "😊", label: "Great", color: "var(--joy-green)" },
    { emoji: "🙂", label: "Good", color: "var(--joy-teal)" },
    { emoji: "😐", label: "Okay", color: "var(--joy-yellow)" },
    { emoji: "😔", label: "Struggling", color: "var(--joy-orange)" },
    { emoji: "😞", label: "Difficult", color: "var(--joy-red)" },
  ];

  const handleSubmit = () => {
    if (mood) {
      onSubmit(mood, notes);
      onClose();
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: 20,
      animation: "fadeIn 0.3s ease-out"
    }}>
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: 30,
        maxWidth: 500,
        width: "100%",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        animation: "slideInUp 0.4s ease-out"
      }}>
        <h2 style={{
          background: "var(--gradient-sunset)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 10,
          textAlign: "center"
        }}>
          🌙 Evening Check-In
        </h2>
        <p style={{ textAlign: "center", color: "var(--gray-medium)", marginBottom: 25 }}>
          How was your day today?
        </p>

        <div style={{ marginBottom: 25 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 12 }}>
            Rate your day:
          </label>
          <div style={{ display: "flex", gap: 10, justifyContent: "space-around" }}>
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                style={{
                  padding: "15px 10px",
                  border: mood === m.label ? `3px solid ${m.color}` : "2px solid var(--gray-light)",
                  borderRadius: 12,
                  background: mood === m.label ? `${m.color}20` : "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5
                }}
              >
                <span style={{ fontSize: "2rem" }}>{m.emoji}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 25 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Any thoughts? (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you handle cravings? What helped? What was challenging?"
            rows={4}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid var(--gray-light)",
              fontSize: "1rem",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 20px",
              borderRadius: 8,
              border: "2px solid var(--gray-light)",
              background: "white",
              color: "var(--gray-dark)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Skip Tonight
          </button>
          <button
            onClick={handleSubmit}
            disabled={!mood}
            style={{
              flex: 2,
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              background: mood ? "var(--gradient-sunset)" : "var(--gray-light)",
              color: "white",
              fontWeight: 600,
              cursor: mood ? "pointer" : "not-allowed",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => mood && (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => mood && (e.currentTarget.style.transform = "scale(1)")}
          >
            Submit Check-In
          </button>
        </div>
      </div>
    </div>
  );
}
