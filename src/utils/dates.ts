// src/utils/dates.ts
// Small date helpers used to compute T-break day numbers.

/**
 * Compute day number in a break given a start date.
 * - If `startDateIso` is missing or invalid, returns 1 as a sensible default.
 * - Day 1 corresponds to the start date itself.
 *
 * @param startDateIso ISO string for break start (e.g. 2025-12-07T00:00:00.000Z)
 * @param at optional Date to compute the day for (defaults to today)
 */
export const computeDayNumber = (
  startDateIso?: string,
  at: Date = new Date()
): number => {
  if (!startDateIso) return 1;
  const start = new Date(startDateIso);
  if (isNaN(start.getTime())) return 1;

  // Normalize times to UTC midnight to avoid timezone off-by-one
  const utcStart = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const utcAt = Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate());
  const diffDays = Math.floor((utcAt - utcStart) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
};
