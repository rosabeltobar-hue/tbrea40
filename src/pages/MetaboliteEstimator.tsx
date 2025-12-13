import { useState } from "react";
import { estimateMetabolites, UsageFrequency } from "../utils/metabolites";

export default function MetaboliteEstimator() {
  const [frequency, setFrequency] = useState<UsageFrequency>("heavy");
  const [days, setDays] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleEstimate = () => {
    const r = estimateMetabolites({ frequency, daysSinceLastUse: days });
    setResult(r);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Metabolite Clearance Estimator</h1>
      <p style={{ fontSize: 12 }}>
        This is an approximate educational tool, not medical or legal advice.
      </p>

      <div style={{ marginTop: 10 }}>
        <label>Usage frequency:</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as UsageFrequency)}
          style={{ marginLeft: 8 }}
        >
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="heavy">Heavy</option>
          <option value="chronic">Chronic</option>
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Days since last use:</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{ marginLeft: 8, width: 80 }}
        />
      </div>

      <button style={{ marginTop: 15 }} onClick={handleEstimate}>
        Estimate
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <p>
            Estimated cleared: <b>{result.estimatedPercentCleared}%</b>
          </p>
          <p>
            Estimated days to pass a urine test:
            {" "}
            <b>{result.minDaysToClear}–{result.maxDaysToClear} days</b>
          </p>
          <p style={{ color: "#777", marginTop: 10 }}>
            ⚠ Not medical or legal advice. Educational only.
          </p>
        </div>
      )}
    </div>
  );
}
