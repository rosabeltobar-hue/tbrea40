// src/utils/metabolites.ts
export type UsageFrequency = "light" | "moderate" | "heavy" | "chronic";

interface EstimateInput {
  frequency: UsageFrequency;
  daysSinceLastUse: number;
}

export interface MetaboliteEstimateResult {
  estimatedPercentCleared: number;
  minDaysToClear: number;
  maxDaysToClear: number;
}

// VERY rough heuristic, not medical/legal advice
export const estimateMetabolites = ({
  frequency,
  daysSinceLastUse
}: EstimateInput): MetaboliteEstimateResult => {
  const ranges: Record<UsageFrequency, [number, number]> = {
    light: [2, 5],
    moderate: [5, 15],
    heavy: [10, 30],
    chronic: [20, 60]
  };

  const [min, max] = ranges[frequency];
  const clamped = Math.min(Math.max(daysSinceLastUse, 0), max);
  const percent = (clamped / max) * 100;

  return {
    estimatedPercentCleared: Math.round(percent),
    minDaysToClear: min,
    maxDaysToClear: max
  };
};

export const computeClearPercent = (dayNumber: number): number => {
  const maxDays = 30; // “Full clean” estimate window
  return Math.min(100, Math.round((dayNumber / maxDays) * 100));
};
