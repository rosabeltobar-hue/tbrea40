import React from "react";
import { DailyEntry } from "../types";

interface Props {
  entries: DailyEntry[];
  onSelectDay: (dayEntry: DailyEntry | null) => void;
}

export default function CalendarHeatMap({ entries, onSelectDay }: Props) {
  const days = Array.from({ length: 40 }, (_, i) => i + 1);

  const getColor = (mood?: string, relapse?: boolean) => {
    if (relapse) return "#ff4d4d"; // Red
    if (!mood) return "#ccc";       // Gray no data
    if (mood === "😞") return "#4db8ff"; // Blue
    if (mood === "😐") return "#f4d03f"; // Yellow
    if (mood === "🙂") return "#82e0aa"; // Green
    if (mood === "😎") return "#f7c600"; // Gold
    return "#ccc";
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 40px)",
        gap: "6px",
        padding: "20px"
      }}
    >
      {days.map((day) => {
        const entry = entries.find((e) => e.dayNumber === day);
        return (
          <div
            key={day}
            onClick={() => onSelectDay(entry || null)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: getColor(
                entry?.morningMood,
                entry?.usedToday
              ),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              userSelect: "none",
              fontSize: 13,
              color: "#000"
            }}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}
