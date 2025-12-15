// src/components/WithdrawalTimeline.tsx
import { getWithdrawalTimeline, getSymptomsForDay, getDifficultyColor, getDifficultyLabel } from "../utils/symptoms";
import { useState } from "react";

interface WithdrawalTimelineProps {
  frequency: "light" | "moderate" | "heavy" | "chronic";
  yearsOfUse?: number;
  currentDay: number;
}

export default function WithdrawalTimeline({ frequency, yearsOfUse, currentDay }: WithdrawalTimelineProps) {
  const timeline = getWithdrawalTimeline(frequency, yearsOfUse);
  const currentDayInfo = getSymptomsForDay(currentDay, timeline);
  const [expandedDay, setExpandedDay] = useState<number | null>(currentDay);

  return (
    <div style={{
      background: "white",
      borderRadius: 12,
      padding: 24,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      marginTop: 20
    }}>
      <h3 style={{ margin: "0 0 8px 0", color: "#667eea", fontSize: "1.3rem" }}>
        🗓️ What to Expect - Your Withdrawal Timeline
      </h3>
      <p style={{ margin: "0 0 16px 0", fontSize: "0.9rem", color: "#666", lineHeight: 1.5 }}>
        Based on your usage pattern (<strong>{frequency}</strong>, {yearsOfUse || 1} years), here's what to expect each day.
      </p>

      {/* Current Day Highlight */}
      {currentDayInfo && (
        <div style={{
          background: `linear-gradient(135deg, ${getDifficultyColor(currentDayInfo.difficulty)}20, ${getDifficultyColor(currentDayInfo.difficulty)}10)`,
          border: `3px solid ${getDifficultyColor(currentDayInfo.difficulty)}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 24
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
              background: getDifficultyColor(currentDayInfo.difficulty),
              color: "white",
              padding: "8px 16px",
              borderRadius: 20,
              fontWeight: 700,
              fontSize: "1rem"
            }}>
              📍 You are here - Day {currentDay}
            </div>
            <div style={{
              background: getDifficultyColor(currentDayInfo.difficulty),
              color: "white",
              padding: "4px 12px",
              borderRadius: 12,
              fontSize: "0.85rem",
              fontWeight: 600
            }}>
              {getDifficultyLabel(currentDayInfo.difficulty)}
            </div>
          </div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "#333" }}>
            {currentDayInfo.phase}
          </h4>
          <p style={{ margin: "0 0 12px 0", fontSize: "0.95rem", lineHeight: 1.5, color: "#555" }}>
            {currentDayInfo.description}
          </p>
          {currentDayInfo.tips.length > 0 && (
            <div>
              <strong style={{ fontSize: "0.9rem", color: "#333" }}>💡 Tips for today:</strong>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                {currentDayInfo.tips.map((tip, idx) => (
                  <li key={idx} style={{ fontSize: "0.85rem", marginBottom: 4, color: "#555" }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Full Timeline */}
      <h4 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", color: "#333" }}>
        📈 Full Timeline
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {timeline.map((day) => {
          const isExpanded = expandedDay === day.day;
          const isCurrent = day.day === currentDay;
          const isPast = day.day < currentDay;
          
          return (
            <div
              key={day.day}
              style={{
                border: `2px solid ${isCurrent ? getDifficultyColor(day.difficulty) : "#e0e0e0"}`,
                borderRadius: 8,
                overflow: "hidden",
                opacity: isPast ? 0.6 : 1,
                transition: "all 0.2s ease"
              }}
            >
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: isPast 
                    ? "#f5f5f5" 
                    : isCurrent 
                    ? `${getDifficultyColor(day.difficulty)}15`
                    : "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    minWidth: 60,
                    padding: "6px 12px",
                    background: getDifficultyColor(day.difficulty),
                    color: "white",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textAlign: "center"
                  }}>
                    Day {day.day}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#333", marginBottom: 2 }}>
                      {day.phase} {isCurrent && "← You are here"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>
                      {getDifficultyLabel(day.difficulty)} difficulty
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: "1.2rem", color: "#999" }}>
                  {isExpanded ? "−" : "+"}
                </span>
              </button>
              
              {isExpanded && (
                <div style={{
                  padding: "16px 16px 16px 88px",
                  background: "#f9f9f9",
                  borderTop: "1px solid #e0e0e0"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", lineHeight: 1.5, color: "#555" }}>
                    {day.description}
                  </p>
                  {day.tips.length > 0 && (
                    <div>
                      <strong style={{ fontSize: "0.85rem", color: "#333" }}>💡 Tips:</strong>
                      <ul style={{ margin: "6px 0 0 0", paddingLeft: 20 }}>
                        {day.tips.map((tip, idx) => (
                          <li key={idx} style={{ fontSize: "0.8rem", marginBottom: 4, color: "#555" }}>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 20,
        padding: 16,
        background: "#fff3cd",
        borderRadius: 8,
        border: "2px solid #ffecb5"
      }}>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#856404", lineHeight: 1.5 }}>
          <strong>⚠️ Remember:</strong> Everyone's experience is different. This timeline is a general guide. 
          If symptoms are severe or concerning, please consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}
