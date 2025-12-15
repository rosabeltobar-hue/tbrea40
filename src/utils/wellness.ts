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

// Comprehensive nutrition and wellness resources
export const wellnessCategories = [
  {
    id: "food",
    title: "Food & Nutrition",
    icon: "🥗",
    color: "#4CAF50",
    lightColor: "#E8F5E9",
    resources: [
      {
        name: "Leafy Greens (Spinach, Kale)",
        benefits: "Detoxification, liver support",
        helps: ["cleanse", "energy"],
        description: "Rich in chlorophyll which helps eliminate toxins and supports liver function"
      },
      {
        name: "Cruciferous Vegetables (Broccoli, Cauliflower)",
        benefits: "Speeds up metabolism, cleanse",
        helps: ["cleanse", "metabolism"],
        description: "Contain compounds that activate detox enzymes and speed THC elimination"
      },
      {
        name: "Citrus Fruits (Lemon, Grapefruit)",
        benefits: "Liver detox, vitamin C boost",
        helps: ["cleanse", "immunity"],
        description: "High in vitamin C and enzymes that support liver detoxification pathways"
      },
      {
        name: "Fatty Fish (Salmon, Mackerel)",
        benefits: "Brain healing, mood regulation",
        helps: ["mood", "brain"],
        description: "Omega-3 fatty acids restore brain chemistry and reduce inflammation"
      },
      {
        name: "Berries (Blueberries, Strawberries)",
        benefits: "Antioxidants, brain protection",
        helps: ["brain", "cleanse"],
        description: "High antioxidant content protects brain cells and aids detoxification"
      },
      {
        name: "Whole Grains (Brown Rice, Quinoa)",
        benefits: "Stable energy, mood balance",
        helps: ["mood", "energy"],
        description: "Complex carbs regulate blood sugar and serotonin production"
      },
      {
        name: "Nuts & Seeds (Walnuts, Chia)",
        benefits: "Omega-3s, anxiety relief",
        helps: ["anxiety", "brain"],
        description: "Essential fatty acids support nervous system and reduce anxiety"
      },
      {
        name: "Avocados",
        benefits: "Brain health, stress reduction",
        helps: ["brain", "anxiety"],
        description: "Healthy fats and B vitamins support neurotransmitter production"
      },
      {
        name: "Green Tea",
        benefits: "Metabolism boost, cleanse",
        helps: ["cleanse", "energy"],
        description: "Catechins accelerate fat metabolism and THC elimination"
      },
      {
        name: "Garlic & Onions",
        benefits: "Detox support, immunity",
        helps: ["cleanse", "immunity"],
        description: "Sulfur compounds enhance liver detoxification and immune function"
      }
    ]
  },
  {
    id: "herbs",
    title: "Herbs & Supplements",
    icon: "🌿",
    color: "#8BC34A",
    lightColor: "#F1F8E9",
    resources: [
      {
        name: "Milk Thistle",
        benefits: "Liver protection & regeneration",
        helps: ["cleanse", "liver"],
        description: "Silymarin protects liver cells and enhances detoxification capacity"
      },
      {
        name: "Ashwagandha",
        benefits: "Stress relief, anxiety reduction",
        helps: ["anxiety", "sleep"],
        description: "Adaptogen that reduces cortisol and calms nervous system"
      },
      {
        name: "Valerian Root",
        benefits: "Sleep improvement, relaxation",
        helps: ["sleep", "anxiety"],
        description: "Natural sedative that improves sleep quality without grogginess"
      },
      {
        name: "Passionflower",
        benefits: "Anxiety relief, calm mind",
        helps: ["anxiety", "mood"],
        description: "Increases GABA levels to reduce anxiety and promote relaxation"
      },
      {
        name: "St. John's Wort",
        benefits: "Mood enhancement, depression relief",
        helps: ["mood", "depression"],
        description: "Natural antidepressant that boosts serotonin and dopamine"
      },
      {
        name: "L-Theanine",
        benefits: "Calm focus, anxiety reduction",
        helps: ["anxiety", "focus"],
        description: "Amino acid from tea that promotes relaxation without drowsiness"
      },
      {
        name: "5-HTP",
        benefits: "Mood balance, sleep support",
        helps: ["mood", "sleep"],
        description: "Serotonin precursor that helps regulate mood and sleep cycles"
      },
      {
        name: "Rhodiola Rosea",
        benefits: "Energy, stress resilience",
        helps: ["energy", "anxiety"],
        description: "Adaptogen that combats fatigue and improves stress response"
      },
      {
        name: "Ginkgo Biloba",
        benefits: "Brain fog, memory support",
        helps: ["brain", "focus"],
        description: "Improves blood flow to brain, enhances cognitive function"
      },
      {
        name: "Chamomile",
        benefits: "Sleep, digestive calm",
        helps: ["sleep", "anxiety"],
        description: "Gentle sedative and anti-anxiety herb, promotes restful sleep"
      }
    ]
  },
  {
    id: "vitamins",
    title: "Vitamins & Minerals",
    icon: "💊",
    color: "#FF9800",
    lightColor: "#FFF3E0",
    resources: [
      {
        name: "Vitamin C (1000-2000mg)",
        benefits: "Immune boost, detox support",
        helps: ["cleanse", "immunity"],
        description: "Powerful antioxidant that supports liver detoxification"
      },
      {
        name: "B-Complex Vitamins",
        benefits: "Energy, mood, brain function",
        helps: ["energy", "mood", "brain"],
        description: "Essential for neurotransmitter production and energy metabolism"
      },
      {
        name: "Vitamin D3 (2000-4000 IU)",
        benefits: "Mood regulation, immunity",
        helps: ["mood", "immunity"],
        description: "Deficiency linked to depression; crucial for mental health"
      },
      {
        name: "Magnesium (400-500mg)",
        benefits: "Sleep, anxiety, muscle relaxation",
        helps: ["sleep", "anxiety", "relaxation"],
        description: "Natural relaxant that improves sleep and reduces anxiety"
      },
      {
        name: "Zinc (15-30mg)",
        benefits: "Immune function, brain health",
        helps: ["immunity", "brain"],
        description: "Supports neurotransmitter function and immune response"
      },
      {
        name: "Omega-3 Fish Oil (1000-2000mg)",
        benefits: "Brain healing, inflammation",
        helps: ["brain", "mood"],
        description: "EPA/DHA restore brain cell membranes and reduce inflammation"
      },
      {
        name: "N-Acetyl Cysteine (NAC)",
        benefits: "Glutathione production, detox",
        helps: ["cleanse", "liver"],
        description: "Precursor to glutathione, the body's master detoxifier"
      },
      {
        name: "Probiotics",
        benefits: "Gut health, mood (gut-brain axis)",
        helps: ["mood", "digestion"],
        description: "90% of serotonin is made in the gut; healthy gut = better mood"
      },
      {
        name: "Melatonin (3-10mg)",
        benefits: "Sleep regulation",
        helps: ["sleep"],
        description: "Natural sleep hormone; helps reset disrupted sleep cycles"
      },
      {
        name: "CoQ10",
        benefits: "Energy production, brain support",
        helps: ["energy", "brain"],
        description: "Cellular energy booster that combats fatigue"
      }
    ]
  },
  {
    id: "sport",
    title: "Physical Exercise",
    icon: "💪",
    color: "#F44336",
    lightColor: "#FFEBEE",
    resources: [
      {
        name: "Cardio Exercise (Running, Cycling)",
        benefits: "Speeds THC elimination through sweat",
        helps: ["cleanse", "mood"],
        description: "30-45 min sessions increase metabolism and fat burning where THC is stored",
        frequency: "4-5 times per week"
      },
      {
        name: "Hot Yoga / Bikram",
        benefits: "Deep sweating, detoxification",
        helps: ["cleanse", "flexibility"],
        description: "Combines exercise with heat to maximize toxin elimination through sweat",
        frequency: "3-4 times per week"
      },
      {
        name: "Sauna Sessions",
        benefits: "Toxin release through sweating",
        helps: ["cleanse", "relaxation"],
        description: "15-20 min sessions help eliminate fat-soluble compounds like THC",
        frequency: "Daily if possible"
      },
      {
        name: "Swimming",
        benefits: "Full-body cardio, low impact",
        helps: ["cleanse", "anxiety"],
        description: "Gentle on joints while providing excellent cardiovascular workout",
        frequency: "3-5 times per week"
      },
      {
        name: "Strength Training",
        benefits: "Builds muscle, boosts metabolism",
        helps: ["energy", "mood"],
        description: "Increases lean muscle mass which raises basal metabolic rate",
        frequency: "3 times per week"
      },
      {
        name: "HIIT (High-Intensity Interval)",
        benefits: "Maximum fat burn, fast cleanse",
        helps: ["cleanse", "energy"],
        description: "Short bursts maximize fat oxidation and THC elimination",
        frequency: "2-3 times per week"
      },
      {
        name: "Walking in Nature",
        benefits: "Gentle movement, mental clarity",
        helps: ["mood", "anxiety"],
        description: "Low-impact exercise combined with nature therapy for mental health",
        frequency: "Daily, 30+ minutes"
      },
      {
        name: "Boxing / Martial Arts",
        benefits: "Stress release, discipline",
        helps: ["anxiety", "mood"],
        description: "Physical outlet for emotions while building mental strength",
        frequency: "2-4 times per week"
      }
    ]
  },
  {
    id: "activities",
    title: "Wellness Activities",
    icon: "🧘‍♀️",
    color: "#9C27B0",
    lightColor: "#F3E5F5",
    resources: [
      {
        name: "Meditation (10-20 min)",
        benefits: "Anxiety relief, mental clarity",
        helps: ["anxiety", "focus"],
        description: "Mindfulness practice that rewires brain patterns and reduces cravings",
        frequency: "Daily"
      },
      {
        name: "Breathwork (Box Breathing)",
        benefits: "Immediate anxiety relief",
        helps: ["anxiety", "sleep"],
        description: "4-4-4-4 breathing pattern activates parasympathetic nervous system",
        frequency: "As needed, 5-10 min"
      },
      {
        name: "Journaling",
        benefits: "Emotional processing, clarity",
        helps: ["mood", "insight"],
        description: "Writing thoughts and feelings helps process withdrawal emotions",
        frequency: "Daily, before bed"
      },
      {
        name: "Cold Exposure (Showers)",
        benefits: "Mood boost, mental resilience",
        helps: ["mood", "energy"],
        description: "30-90 sec cold water increases dopamine and norepinephrine",
        frequency: "Daily, morning"
      },
      {
        name: "Massage Therapy",
        benefits: "Muscle tension, relaxation",
        helps: ["anxiety", "sleep"],
        description: "Releases physical tension and promotes parasympathetic state",
        frequency: "Weekly or bi-weekly"
      },
      {
        name: "Acupuncture",
        benefits: "Withdrawal symptom relief",
        helps: ["anxiety", "sleep", "cravings"],
        description: "Stimulates endorphin release and balances energy systems",
        frequency: "1-2 times per week"
      },
      {
        name: "Art / Music Therapy",
        benefits: "Emotional expression, joy",
        helps: ["mood", "creativity"],
        description: "Creative outlets provide healthy dopamine stimulation",
        frequency: "As desired"
      },
      {
        name: "Social Connection",
        benefits: "Support, accountability",
        helps: ["mood", "motivation"],
        description: "Spending time with supportive people boosts oxytocin and motivation",
        frequency: "Multiple times per week"
      },
      {
        name: "Nature Immersion (Forest Bathing)",
        benefits: "Stress reduction, grounding",
        helps: ["anxiety", "mood"],
        description: "Spending time in nature lowers cortisol and improves mental health",
        frequency: "Weekly, 2+ hours"
      },
      {
        name: "Sleep Hygiene Routine",
        benefits: "Restorative sleep",
        helps: ["sleep", "recovery"],
        description: "Consistent bedtime, dark room, cool temp, no screens 1hr before bed",
        frequency: "Daily"
      }
    ]
  }
];

// Helper to get resources by symptom
export const getResourcesBySymptom = (symptom: string) => {
  const allResources: any[] = [];
  wellnessCategories.forEach(category => {
    category.resources.forEach(resource => {
      if (resource.helps.includes(symptom)) {
        allResources.push({
          ...resource,
          category: category.title,
          categoryIcon: category.icon
        });
      }
    });
  });
  return allResources;
};

// Keep existing nutrition tips for backwards compatibility
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
