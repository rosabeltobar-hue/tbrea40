export const coinReward = (dayNumber: number): number => {
  if (dayNumber === 1) return 5;
  if (dayNumber % 7 === 0) return 10;
  return 1;
};

export const medalReward = (dayNumber: number): string | null => {
  if (dayNumber === 7) return "bronze";
  if (dayNumber === 20) return "silver";
  if (dayNumber === 40) return "gold";
  return null;
};
