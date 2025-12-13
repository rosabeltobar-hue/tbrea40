import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getEntriesForMonth, saveDailyEntry } from "../services/dailyEntries";
import { estimateMetaboliteClearPercent } from "../services/metabolites";
import { computeDayNumber } from "../utils/dates";
import { DailyEntry } from "../types";

function buildMonth(year: number, month: number) {
  // month: 0-11
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const result: Array<Array<number | null>> = [];

  let week: Array<number | null> = [];
  // pad first week with nulls until first.getDay()
  for (let i = 0; i < first.getDay(); i++) week.push(null);

  for (let d = 1; d <= last.getDate(); d++) {
    week.push(d);
    if (week.length === 7) {
      result.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    result.push(week);
  }
  return result;
}

export default function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const { user, profile } = useUser();

  const [entriesMap, setEntriesMap] = useState<Record<number, DailyEntry>>({});

  const [modalDay, setModalDay] = useState<number | null>(null);
  const [modalEntry, setModalEntry] = useState<Partial<DailyEntry> | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  const weeks = buildMonth(year, month);

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  useEffect(() => {
    if (!user) {
      setEntriesMap({});
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const arr = await getEntriesForMonth(user.uid, year, month);
        if (!mounted) return;
        const map: Record<number, DailyEntry> = {};
        arr.forEach((e) => {
          const d = new Date(e.date).getDate();
          map[d] = e;
        });
        setEntriesMap(map);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, year, month]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Calendar</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={prev}>{"<"}</button>
        <div style={{ fontWeight: 600 }}>
          {monthNames[month]} {year}
        </div>
        <button onClick={next}>{">"}</button>
      </div>

      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "center", color: "#666" }}>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i} style={{ textAlign: "center" }}>
              {week.map((d, j) => (
                <td
                  key={j}
                  style={{
                    padding: 8,
                    border: "1px solid #f0f0f0",
                    height: 56,
                    verticalAlign: "top"
                  }}
                >
                  {d ? (
                    <div style={{ fontSize: 14 }}>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={async () => {
                          if (!user) return alert("Please sign in to edit entries.");
                          setModalDay(d);
                          // preload existing entry if present in map
                          const existing = entriesMap[d];
                          if (existing) setModalEntry(existing);
                          else
                            setModalEntry({
                              dayNumber: d,
                              date: new Date(year, month, d).toISOString(),
                              userId: user.uid,
                              morningMood: undefined,
                              usedToday: false
                            });
                        }}
                      >
                        {d}
                      </div>

                      {entriesMap[d] && (
                        <div style={{ marginTop: 6, fontSize: 12, color: "#2e7d32" }}>
                          {typeof entriesMap[d].metaboliteClearPercent === "number"
                            ? `${entriesMap[d].metaboliteClearPercent}% cleared`
                            : "Checked in"}
                        </div>
                      )}
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {modalDay !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ background: "#fff", padding: 16, width: 420, borderRadius: 8 }}>
            <h3>Check-in: {monthNames[month]} {modalDay}, {year}</h3>
            <div style={{ marginTop: 8 }}>
              <label>
                Mood:{" "}
                <input
                  value={modalEntry?.morningMood ?? ""}
                  onChange={(e) => setModalEntry({ ...(modalEntry || {}), morningMood: e.target.value })}
                />
              </label>
            </div>
            <div style={{ marginTop: 8 }}>
              <label>
                <input
                  type="checkbox"
                  checked={!!modalEntry?.usedToday}
                  onChange={(e) => {
                    setModalEntry({ ...(modalEntry || {}), usedToday: e.target.checked });
                    if (e.target.checked) {
                      // if used today, set daysSinceLastUse to 0
                      setModalEntry((m) => ({ ...(m || {}), daysSinceLastUse: 0 }));
                    }
                  }}
                />{" "}
                I used cannabis today
              </label>
            </div>

            <div style={{ marginTop: 8 }}>
              <label>
                Days since last use:{" "}
                <input
                  type="number"
                  min={0}
                  value={modalEntry?.daysSinceLastUse ?? 0}
                  onChange={(e) => setModalEntry({ ...(modalEntry || {}), daysSinceLastUse: Number(e.target.value) })}
                  style={{ width: 80 }}
                />
              </label>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => { setModalDay(null); setModalEntry(null); }}>Cancel</button>
              <button
                onClick={async () => {
                  if (!user || modalDay === null) return;
                  setModalSaving(true);
                  try {
                    const dayNumber = modalDay;
                    const computedDayNumber = computeDayNumber(profile?.startDate, new Date(year, month, dayNumber));

                    const entry: DailyEntry = {
                      id: `${user.uid}-${year}-${month}-${dayNumber}`,
                      userId: user.uid,
                      dayNumber: computedDayNumber,
                      date: new Date(year, month, dayNumber).toISOString(),
                      morningMood: modalEntry?.morningMood,
                      usedToday: modalEntry?.usedToday,
                      cravingLevel: modalEntry?.cravingLevel,
                      symptoms: modalEntry?.symptoms,
                      journal: modalEntry?.journal,
                      metaboliteClearPercent: typeof modalEntry?.daysSinceLastUse === "number"
                        ? estimateMetaboliteClearPercent(modalEntry!.daysSinceLastUse || 0, (modalEntry as any).frequency || "moderate")
                        : undefined
                    };
                    await saveDailyEntry(entry);
                    // refresh month entries
                    if (user) {
                      const arr = await getEntriesForMonth(user.uid, year, month);
                      const map: Record<number, DailyEntry> = {};
                      arr.forEach((e) => {
                        const d = new Date(e.date).getDate();
                        map[d] = e;
                      });
                      setEntriesMap(map);
                    }
                    setModalDay(null);
                    setModalEntry(null);
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setModalSaving(false);
                  }
                }}
                disabled={modalSaving}
              >
                {modalSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <p style={{ marginTop: 12, color: "#666" }}>
        This calendar is a simple read-only month view. I can wire it to
        show your daily entries, highlight completions, and allow quick
        check-ins if you want.
      </p>
    </div>
  );
}
