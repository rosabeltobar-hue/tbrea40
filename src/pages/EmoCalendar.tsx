import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { DailyEntry } from "../types";
import { getDailyEntry } from "../services/dailyEntries";
import CalendarHeatMap from "../components/CalendarHeatMap";

export default function EmoCalendar() {
  const { user } = useUser();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [selected, setSelected] = useState<DailyEntry | null>(null);

  useEffect(() => {
    if (!user) return;
    // For now we get individual days (later we retrieve all from Firebase)
    const load = async () => {
      const arr: DailyEntry[] = [];
      for (let d = 1; d <= 40; d++) {
        const e = await getDailyEntry(user.uid, d);
        if (e) arr.push(e);
      }
      setEntries(arr);
    };
    load();
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
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
      
      <h1>Emotion Calendar</h1>
      <p>Click any day to view notes.</p>

      <CalendarHeatMap
        entries={entries}
        onSelectDay={(entry) => setSelected(entry)}
      />

      {selected && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8
          }}
        >
          <h3>Day {selected.dayNumber}</h3>
          <p>Mood: {selected.morningMood}</p>
          <p>Used: {selected.usedToday ? "Yes" : "No"}</p>
          <p>{selected.journal || "No journal entry"}</p>
        </div>
      )}
    </div>
  );
}
