// src/utils/symptoms.ts

export const COMMON_SYMPTOMS = [
  { id: "insomnia", label: "Trouble Sleeping", category: "sleep" },
  { id: "nightSweats", label: "Night Sweats", category: "sleep" },
  { id: "vivid_dreams", label: "Vivid Dreams", category: "sleep" },
  { id: "irritability", label: "Irritability", category: "mood" },
  { id: "anxiety", label: "Anxiety", category: "mood" },
  { id: "depression", label: "Low Mood", category: "mood" },
  { id: "anger", label: "Anger/Rage", category: "mood" },
  { id: "brain_fog", label: "Brain Fog", category: "cognitive" },
  { id: "concentration", label: "Difficulty Concentrating", category: "cognitive" },
  { id: "memory", label: "Memory Issues", category: "cognitive" },
  { id: "headache", label: "Headaches", category: "physical" },
  { id: "nausea", label: "Nausea", category: "physical" },
  { id: "appetite_loss", label: "Loss of Appetite", category: "physical" },
  { id: "stomach_pain", label: "Stomach Pain", category: "physical" },
  { id: "chills", label: "Chills", category: "physical" },
  { id: "tremors", label: "Tremors/Shaking", category: "physical" },
  { id: "fatigue", label: "Extreme Fatigue", category: "physical" },
  { id: "cravings", label: "Strong Cravings", category: "cravings" },
  { id: "boredom", label: "Boredom", category: "mood" },
  { id: "restlessness", label: "Restlessness", category: "physical" }
];

interface DayTimeline {
  day: number;
  phase: string;
  difficulty: "mild" | "moderate" | "hard" | "very-hard" | "peak";
  commonSymptoms: string[];
  description: string;
  tips: string[];
}

// Timeline based on usage frequency and duration
export const getWithdrawalTimeline = (
  frequency: "light" | "moderate" | "heavy" | "chronic",
  yearsOfUse?: number
): DayTimeline[] => {
  const duration = yearsOfUse || 1;
  const isLongTerm = duration >= 5;
  const isHeavy = frequency === "heavy" || frequency === "chronic";

  const baseTimeline: DayTimeline[] = [
    {
      day: 1,
      phase: "Initial Phase",
      difficulty: "mild",
      commonSymptoms: ["cravings", "restlessness", "boredom"],
      description: "First day is often deceptively easy. THC is still in your system. You might feel motivated and excited.",
      tips: [
        "Stay busy with activities",
        "Drink plenty of water",
        "Get rid of any cannabis/paraphernalia",
        "Tell a friend about your goal"
      ]
    },
    {
      day: 2,
      phase: "Withdrawal Begins",
      difficulty: isHeavy ? "hard" : "moderate",
      commonSymptoms: ["insomnia", "irritability", "cravings", "appetite_loss", "restlessness"],
      description: "Reality sets in. Withdrawal symptoms start appearing. Sleep may be difficult. Cravings intensify.",
      tips: [
        "Expect sleep difficulties - this is normal",
        "Light exercise can help",
        "Avoid alcohol and caffeine late in the day",
        "Practice deep breathing for cravings"
      ]
    },
    {
      day: 3,
      phase: "Peak Withdrawal",
      difficulty: isHeavy ? "very-hard" : "hard",
      commonSymptoms: ["insomnia", "nightSweats", "irritability", "anger", "anxiety", "headache", "nausea", "cravings"],
      description: isHeavy 
        ? "⚠️ HARDEST DAY for heavy users. Peak withdrawal symptoms. Night sweats, insomnia, and intense irritability are common."
        : "Peak withdrawal begins. Sleep is difficult, mood swings increase. This is a critical day - push through!",
      tips: [
        "🚨 This is the hardest day - you can do this!",
        "Take a hot shower/bath for sweats",
        "Eat small, frequent meals if nauseous",
        "Reach out for support if needed",
        "Remember: this will pass"
      ]
    },
    {
      day: 4,
      phase: "Peak Withdrawal",
      difficulty: "very-hard",
      commonSymptoms: ["insomnia", "vivid_dreams", "anxiety", "depression", "brain_fog", "fatigue", "cravings"],
      description: "⚠️ SECOND HARDEST DAY. Extreme fatigue and emotional vulnerability. Dreams become incredibly vivid and intense.",
      tips: [
        "Vivid dreams are normal - your brain is recovering",
        "Allow yourself to rest if exhausted",
        "Be gentle with yourself emotionally",
        "Journal your feelings",
        "This too shall pass"
      ]
    },
    {
      day: 5,
      phase: "Acute Withdrawal",
      difficulty: "hard",
      commonSymptoms: ["insomnia", "vivid_dreams", "irritability", "anxiety", "brain_fog", "concentration", "cravings"],
      description: "Symptoms remain intense but slightly more manageable. Cognitive fog is prominent. Sleep remains disrupted.",
      tips: [
        "Do simple tasks - don't overload your brain",
        "Short walks in nature can help",
        "Melatonin may help with sleep (consult doctor)",
        "Connect with supportive people"
      ]
    },
    {
      day: 6,
      phase: "Acute Withdrawal",
      difficulty: "hard",
      commonSymptoms: ["insomnia", "vivid_dreams", "mood_swings", "fatigue", "cravings"],
      description: "Symptoms continue but you're past the peak. Small improvements may be noticed. Energy is still low.",
      tips: [
        "Notice any small improvements",
        "Celebrate making it through the worst",
        "Maintain healthy eating habits",
        "Light exercise if energy allows"
      ]
    },
    {
      day: 7,
      phase: "Week 1 Complete",
      difficulty: "moderate",
      commonSymptoms: ["insomnia", "vivid_dreams", "anxiety", "brain_fog", "cravings"],
      description: "🎉 You've completed the hardest week! Acute symptoms start to lessen. Sleep may still be difficult but improving.",
      tips: [
        "Congratulations on one week!",
        "Reflect on your progress",
        "Plan activities for week 2",
        "Reward yourself (non-substance)"
      ]
    },
    {
      day: 10,
      phase: "Early Recovery",
      difficulty: "moderate",
      commonSymptoms: ["vivid_dreams", "mood_swings", "brain_fog", "cravings"],
      description: "Symptoms are milder. Dreams remain vivid but less disruptive. Mental clarity starts returning slowly.",
      tips: [
        "Mental fog is lifting gradually",
        "Resume normal routines",
        "Consider new hobbies",
        "Support others in their journey"
      ]
    },
    {
      day: 14,
      phase: "Two Weeks",
      difficulty: "mild",
      commonSymptoms: ["vivid_dreams", "occasional_anxiety", "mild_cravings"],
      description: "🎉 Two weeks! Major milestone. Most acute symptoms have subsided. Mood stabilizes. Energy returns.",
      tips: [
        "Major accomplishment - celebrate it!",
        "Sleep should be much better",
        "Mental clarity improving",
        "Physical health improving"
      ]
    },
    {
      day: 21,
      phase: "Three Weeks",
      difficulty: "mild",
      commonSymptoms: ["occasional_cravings", "emotional_sensitivity"],
      description: "Feeling significantly better. Dreams normalizing. Cravings are situational rather than constant.",
      tips: [
        "Identify your trigger situations",
        "Practice coping strategies",
        "Notice improved sleep quality",
        "Enjoy increased energy"
      ]
    },
    {
      day: 30,
      phase: "One Month",
      difficulty: "mild",
      commonSymptoms: ["occasional_cravings"],
      description: "🎉 ONE MONTH! You've made it! Most symptoms resolved. Mood is stable. Sleep is normal. Mental clarity restored.",
      tips: [
        "Huge achievement - be proud!",
        "Reflect on all improvements",
        "Continue healthy habits",
        "Stay connected to support"
      ]
    }
  ];

  // Add extra days for chronic/long-term users
  if (isLongTerm && isHeavy) {
    baseTimeline.splice(3, 0, {
      day: 3.5,
      phase: "Extended Peak",
      difficulty: "peak",
      commonSymptoms: ["all_symptoms"],
      description: "⚠️⚠️ ABSOLUTE PEAK for chronic long-term users. All withdrawal symptoms at maximum intensity. This is the storm before the calm.",
      tips: [
        "🚨 You're at the absolute peak - it gets better from here",
        "Stay safe - reach out if you need help",
        "This is temporary - your brain is healing",
        "One hour at a time if needed"
      ]
    });
  }

  return baseTimeline.filter(t => typeof t.day === 'number');
};

export const getSymptomsForDay = (day: number, timeline: DayTimeline[]): DayTimeline | null => {
  // Find closest day in timeline
  let closest = timeline[0];
  let minDiff = Math.abs(timeline[0].day - day);
  
  for (const t of timeline) {
    const diff = Math.abs(t.day - day);
    if (diff < minDiff) {
      minDiff = diff;
      closest = t;
    }
  }
  
  return closest;
};

export const getDifficultyColor = (difficulty: DayTimeline["difficulty"]): string => {
  switch (difficulty) {
    case "mild": return "#4CAF50";
    case "moderate": return "#FF9800";
    case "hard": return "#FF5722";
    case "very-hard": return "#E91E63";
    case "peak": return "#9C27B0";
    default: return "#4CAF50";
  }
};

export const getDifficultyLabel = (difficulty: DayTimeline["difficulty"]): string => {
  switch (difficulty) {
    case "mild": return "Mild";
    case "moderate": return "Moderate";
    case "hard": return "Hard";
    case "very-hard": return "Very Hard";
    case "peak": return "PEAK 🔥";
    default: return "Mild";
  }
};
