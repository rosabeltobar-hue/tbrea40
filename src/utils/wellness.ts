// Daily inspirational quotes for users on their T-break journey
export const dailyQuotes = [
  // Stoic Quotes
  "You have power over your mind - not outside events. Realize this, and you will find strength. - Marcus Aurelius",
  "The impediment to action advances action. What stands in the way becomes the way. - Marcus Aurelius",
  "He who fears death will never do anything worth of a man who is alive. - Seneca",
  "Wealth consists not in having great possessions, but in having few wants. - Epictetus",
  "It's not what happens to you, but how you react to it that matters. - Epictetus",
  "First say to yourself what you would be; and then do what you have to do. - Epictetus",
  "The happiness of your life depends upon the quality of your thoughts. - Marcus Aurelius",
  "Waste no more time arguing about what a good man should be. Be one. - Marcus Aurelius",
  
  // Self-Improvement & Recovery
  "Every day is a new opportunity to grow stronger and more resilient.",
  "Your brain is healing. Every hour without use is progress.",
  "Discomfort is temporary. Regret lasts forever. Stay strong.",
  "You're not giving up something - you're gaining clarity, energy, and control.",
  "The urge will pass. It always does. Ride the wave.",
  "Your future self is proud of the choice you're making today.",
  "Healing isn't linear. Bad days don't erase your progress.",
  "You're teaching your brain that you don't need it to feel good.",
  "Every craving you resist makes the next one easier.",
  "Your willpower is a muscle. Today you're making it stronger.",
  "This break is an investment in your mental clarity and emotional stability.",
  "You're proving to yourself that you're in control.",
  "Progress, not perfection. Every day counts.",
  "Your dopamine receptors are healing. Give them time.",
  "The person you'll be after this break is worth the temporary discomfort.",
  
  // Mindfulness & Present Moment
  "Be here now. This moment is all you have.",
  "Breathe. You've survived every difficult moment before this one.",
  "Your anxiety about the future robs the present of its peace.",
  "Cravings are just thoughts. Thoughts aren't commands.",
  "Notice the urge, acknowledge it, let it pass like a cloud.",
  
  // Motivation
  "40 days of discipline creates a lifetime of freedom.",
  "You didn't come this far to only come this far.",
  "Small daily improvements lead to stunning long-term results.",
  "Your commitment today determines your tomorrow.",
  "Champions are made when no one is watching.",
];

export const relaxationTechniques = [
  {
    title: "4-7-8 Breathing",
    description: "Inhale for 4 counts, hold for 7, exhale for 8. Calms the nervous system instantly.",
    duration: "2 minutes",
    icon: "🫁"
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Tense each muscle group for 5 seconds, then release. Start with toes, work up to head.",
    duration: "10 minutes",
    icon: "💪"
  },
  {
    title: "Cold Shower",
    description: "30-second cold blast releases endorphins and reduces inflammation. Great for cravings.",
    duration: "5 minutes",
    icon: "🚿"
  },
  {
    title: "Nature Walk",
    description: "Green spaces reduce cortisol by 15%. Just 20 minutes outdoors helps.",
    duration: "20 minutes",
    icon: "🌳"
  },
  {
    title: "Box Breathing (Navy SEAL technique)",
    description: "Inhale 4, hold 4, exhale 4, hold 4. Repeat. Used in high-stress situations.",
    duration: "5 minutes",
    icon: "📦"
  },
  {
    title: "Guided Meditation",
    description: "Use apps like Headspace, Calm, or Insight Timer. Focus on body scan meditations.",
    duration: "10-20 minutes",
    icon: "🧘"
  },
  {
    title: "Exercise",
    description: "Even 15 minutes boosts dopamine naturally. Try yoga, running, or bodyweight exercises.",
    duration: "15-30 minutes",
    icon: "🏃"
  },
  {
    title: "Journaling",
    description: "Write about cravings, emotions, progress. Externalizing thoughts reduces their power.",
    duration: "10 minutes",
    icon: "📝"
  }
];

export const nutritionTips = [
  {
    category: "Brain Healing",
    tips: [
      "🥑 Omega-3s (salmon, walnuts, flaxseed) repair brain cell membranes",
      "🫐 Blueberries protect neurons from oxidative stress",
      "🥦 Leafy greens (spinach, kale) boost dopamine production",
      "🍫 Dark chocolate (70%+) increases brain-derived neurotrophic factor (BDNF)"
    ]
  },
  {
    category: "Detox Support",
    tips: [
      "💧 Drink 3+ liters of water daily to flush metabolites",
      "🍋 Lemon water in morning supports liver detoxification",
      "🥬 Cruciferous vegetables (broccoli, cauliflower) boost detox enzymes",
      "🌿 Green tea contains antioxidants that aid THC elimination"
    ]
  },
  {
    category: "Mood & Energy",
    tips: [
      "🍌 Bananas contain tryptophan (serotonin precursor) for mood",
      "🥜 Nuts and seeds provide magnesium to reduce anxiety",
      "🥚 Eggs contain choline for cognitive function",
      "🍠 Sweet potatoes stabilize blood sugar and mood"
    ]
  },
  {
    category: "Sleep Quality",
    tips: [
      "🫖 Chamomile tea 1 hour before bed promotes relaxation",
      "🍒 Tart cherry juice contains natural melatonin",
      "🥛 Warm milk with honey increases tryptophan absorption",
      "🚫 Avoid caffeine after 2 PM to improve sleep onset"
    ]
  },
  {
    category: "Craving Management",
    tips: [
      "🍎 High-fiber foods keep blood sugar stable (reduces cravings)",
      "🥤 Protein smoothies satisfy hunger and support neurotransmitters",
      "🌰 Handful of almonds when cravings hit (healthy fats + protein)",
      "🧃 Avoid processed sugar (causes dopamine spikes and crashes)"
    ]
  }
];

export function getDailyQuote(dayNumber: number): string {
  // Use day number to select a consistent quote for that day
  const index = dayNumber % dailyQuotes.length;
  return dailyQuotes[index];
}

export function calculateMetaboliteClearance(
  frequency: string,
  yearsOfUse: number,
  weight: number,
  usageType: string,
  daysClean: number
): {
  daysClean: number;
  estimatedDaysToFullClear: number;
  currentClearancePercent: number;
  status: string;
} {
  // Base clearance times (days for 95% clearance)
  let baseDays = 30;
  
  if (frequency === "light") baseDays = 10;
  else if (frequency === "moderate") baseDays = 20;
  else if (frequency === "heavy") baseDays = 45;
  else if (frequency === "chronic") baseDays = 90;
  
  // Adjustments
  if (yearsOfUse > 5) baseDays += 15;
  if (yearsOfUse > 10) baseDays += 20;
  if (usageType === "edible") baseDays += 10;
  if (weight > 90) baseDays += 7; // Higher body fat stores more THC
  
  // Calculate current clearance percentage (exponential decay)
  const clearancePercent = Math.min(100, (1 - Math.exp(-daysClean / (baseDays * 0.4))) * 100);
  
  const daysRemaining = Math.max(0, baseDays - daysClean);
  
  let status = "";
  if (clearancePercent < 25) status = "Early detox - stay strong! 💪";
  else if (clearancePercent < 50) status = "Progress building! 🌱";
  else if (clearancePercent < 75) status = "More than halfway! 🚀";
  else if (clearancePercent < 95) status = "Almost there! 🎯";
  else status = "System clear! 🎉";
  
  return {
    daysClean,
    estimatedDaysToFullClear: baseDays,
    currentClearancePercent: Math.round(clearancePercent),
    status
  };
}
