// src/components/SymptomTracker.tsx
import { useState, useEffect } from "react";
import { COMMON_SYMPTOMS } from "../utils/symptoms";
import { saveSymptomReport, getAggregatedSymptomsForDay } from "../services/symptoms";
import { AggregatedSymptoms } from "../types";

interface SymptomTrackerProps {
  userId: string;
  currentDay: number;
  onSave: () => void;
}

export default function SymptomTracker({ userId, currentDay, onSave }: SymptomTrackerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [aggregated, setAggregated] = useState<AggregatedSymptoms | null>(null);
  const [showCommunityData, setShowCommunityData] = useState(false);

  useEffect(() => {
    if (showCommunityData) {
      loadAggregatedData();
    }
  }, [showCommunityData, currentDay]);

  const loadAggregatedData = async () => {
    const data = await getAggregatedSymptomsForDay(currentDay);
    setAggregated(data);
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSave = async () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom");
      return;
    }

    setSaving(true);
    try {
      await saveSymptomReport(userId, currentDay, selectedSymptoms, severity, notes);
      alert("✅ Symptoms logged! Your data helps others understand what to expect.");
      setSelectedSymptoms([]);
      setNotes("");
      onSave();
    } catch (error) {
      alert("Failed to save symptoms. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const groupedSymptoms = COMMON_SYMPTOMS.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = [];
    }
    acc[symptom.category].push(symptom);
    return acc;
  }, {} as Record<string, typeof COMMON_SYMPTOMS>);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      sleep: "💤 Sleep",
      mood: "😔 Mood & Mental",
      cognitive: "🧠 Cognitive",
      physical: "🤒 Physical",
      cravings: "🎯 Cravings"
    };
    return labels[category] || category;
  };

  return (
    <div style={{
      background: "white",
      borderRadius: 12,
      padding: 24,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      marginTop: 20
    }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#667eea", fontSize: "1.3rem" }}>
          📊 Track Your Symptoms - Day {currentDay}
        </h3>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#666", lineHeight: 1.5 }}>
          Help yourself and others by logging what you're experiencing. <strong>Your data is anonymized</strong> and helps the community understand what to expect.
        </p>
      </div>

      {/* Severity Selection */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
          Overall Severity Today:
        </label>
        <div style={{ display: "flex", gap: 12 }}>
          {(["mild", "moderate", "severe"] as const).map(level => (
            <button
              key={level}
              onClick={() => setSeverity(level)}
              style={{
                flex: 1,
                padding: "10px 16px",
                background: severity === level ? "#667eea" : "#f0f0f0",
                color: severity === level ? "white" : "#666",
                border: "none",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "capitalize"
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Symptom Checkboxes by Category */}
      {Object.entries(groupedSymptoms).map(([category, symptoms]) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#333" }}>
            {getCategoryLabel(category)}
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
            {symptoms.map(symptom => (
              <label
                key={symptom.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: selectedSymptoms.includes(symptom.id) ? "#e8eaf6" : "#f9f9f9",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: selectedSymptoms.includes(symptom.id) ? "2px solid #667eea" : "2px solid transparent",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom.id)}
                  onChange={() => toggleSymptom(symptom.id)}
                  style={{ marginRight: 8, cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.85rem", fontWeight: selectedSymptoms.includes(symptom.id) ? 600 : 400 }}>
                  {symptom.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Notes */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
          Additional Notes (Optional):
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional details about how you're feeling..."
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "2px solid #e0e0e0",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            minHeight: 80,
            resize: "vertical"
          }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || selectedSymptoms.length === 0}
        style={{
          padding: "14px 32px",
          background: saving || selectedSymptoms.length === 0 ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: "1rem",
          fontWeight: 700,
          cursor: saving || selectedSymptoms.length === 0 ? "not-allowed" : "pointer",
          width: "100%",
          marginBottom: 12
        }}
      >
        {saving ? "⏳ Saving..." : `💾 Log Symptoms for Day ${currentDay}`}
      </button>

      {/* Community Data Toggle */}
      <button
        onClick={() => setShowCommunityData(!showCommunityData)}
        style={{
          padding: "10px 20px",
          background: "white",
          color: "#667eea",
          border: "2px solid #667eea",
          borderRadius: 8,
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: "pointer",
          width: "100%"
        }}
      >
        {showCommunityData ? "Hide" : "Show"} What Others Report on Day {currentDay}
      </button>

      {/* Aggregated Community Data */}
      {showCommunityData && aggregated && (
        <div style={{
          marginTop: 16,
          padding: 16,
          background: "#f5f5f5",
          borderRadius: 8,
          border: "2px solid #e0e0e0"
        }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#333", fontSize: "1rem" }}>
            📈 Community Reports for Day {currentDay}
          </h4>
          {aggregated.totalReports === 0 ? (
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#666", fontStyle: "italic" }}>
              No community data yet for this day. Be the first to contribute!
            </p>
          ) : (
            <>
              <p style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: "#666" }}>
                Based on <strong>{aggregated.totalReports}</strong> anonymous reports:
              </p>
              <div style={{ display: "grid", gap: 6 }}>
                {Object.entries(aggregated.symptomCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([symptomId, count]) => {
                    const symptom = COMMON_SYMPTOMS.find(s => s.id === symptomId);
                    const percentage = Math.round((count / aggregated.totalReports) * 100);
                    return (
                      <div key={symptomId} style={{ fontSize: "0.85rem", color: "#333" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span>{symptom?.label || symptomId}</span>
                          <span style={{ fontWeight: 600 }}>{percentage}%</span>
                        </div>
                        <div style={{
                          height: 6,
                          background: "#e0e0e0",
                          borderRadius: 3,
                          overflow: "hidden"
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: "100%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            transition: "width 0.3s ease"
                          }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
