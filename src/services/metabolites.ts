// src/services/metabolites.ts
// Small helper utilities for estimating metabolite clearance.
// These are rough estimates and should be adapted to real pharmacokinetic
// models if accuracy is required.

/**
 * Estimate percent of metabolites cleared based on days since last use and usage frequency.
 * Formula: percentCleared = 100 * (1 - 0.5^(days / halfLifeDays))
 * halfLifeDays is a heuristic based on usage frequency.
 *
 * @param daysSinceLastUse number of days since the user last used cannabis (>= 0)
 * @param frequency one of 'light'|'moderate'|'heavy'|'chronic'
 * @returns percent cleared (0-100), rounded to 1 decimal place
 */
export function estimateMetaboliteClearPercent(
  daysSinceLastUse: number,
  frequency: "light" | "moderate" | "heavy" | "chronic" = "moderate"
): number {
  const days = Math.max(0, Number(daysSinceLastUse) || 0);

  // heuristic half-lives (in days) by frequency
  const halfLifeMap: Record<string, number> = {
    light: 1,
    moderate: 3,
    heavy: 7,
    chronic: 14
  };

  const halfLife = halfLifeMap[frequency] ?? halfLifeMap["moderate"];

  // exponential decay: remaining fraction = 0.5^(days/halfLife)
  const remaining = Math.pow(0.5, days / halfLife);
  const cleared = 100 * (1 - remaining);

  // clamp and round to 1 decimal
  const clamped = Math.max(0, Math.min(100, cleared));
  return Math.round(clamped * 10) / 10;
}
