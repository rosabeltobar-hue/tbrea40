import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUser } from "../services/user";
import { computeDayNumber } from "../utils/dates";

interface NutritionRecommendation {
  phase: string;
  dayRange: string;
  foods: {
    recommended: string[];
    avoid: string[];
    moodBoosters: string[];
    stressRelievers: string[];
  };
  supplements: string[];
  hydration: string;
  tips: string[];
}

const nutritionData: NutritionRecommendation[] = [
  {
    phase: "Acute Withdrawal (Days 1-3)",
    dayRange: "1-3",
    foods: {
      recommended: [
        "🥑 Avocados - High in B vitamins to reduce anxiety",
        "🍌 Bananas - Rich in potassium, helps regulate mood",
        "🥦 Broccoli - Vitamin C to combat oxidative stress",
        "🍊 Oranges - Vitamin C boosts immune system",
        "🥜 Almonds - Magnesium reduces tension and irritability",
        "🍠 Sweet potatoes - Complex carbs stabilize blood sugar",
        "🐟 Salmon - Omega-3s reduce inflammation",
        "🥚 Eggs - Complete protein supports neurotransmitters"
      ],
      avoid: [
        "❌ Caffeine (>100mg/day) - Increases anxiety",
        "❌ Alcohol - Worsens withdrawal symptoms",
        "❌ Processed sugar - Causes mood swings",
        "❌ Fried foods - Slows detoxification",
        "❌ High sodium foods - Increases dehydration"
      ],
      moodBoosters: [
        "🍫 Dark chocolate (70%+) - Increases serotonin",
        "🫐 Blueberries - Antioxidants support brain health",
        "🥬 Spinach - Folate helps produce dopamine",
        "🍵 Green tea - L-theanine promotes calm alertness"
      ],
      stressRelievers: [
        "🫖 Chamomile tea - GABA receptor activation",
        "🥛 Warm milk - Tryptophan for relaxation",
        "🍯 Honey - Natural sugar without crash",
        "🌰 Cashews - Zinc reduces anxiety"
      ]
    },
    supplements: [
      "Magnesium glycinate (400mg) - Calms nervous system",
      "Vitamin B-complex - Supports stress response",
      "Omega-3 (1000mg EPA/DHA) - Reduces inflammation",
      "Vitamin C (1000mg) - Antioxidant support"
    ],
    hydration: "3-4 liters water daily + electrolytes (coconut water, Pedialyte)",
    tips: [
      "Eat small meals every 3-4 hours to stabilize blood sugar",
      "Avoid skipping breakfast - it sets your mood for the day",
      "Sip warm ginger tea for nausea",
      "Keep healthy snacks nearby for sudden hunger"
    ]
  },
  {
    phase: "Early Recovery (Days 4-10)",
    dayRange: "4-10",
    foods: {
      recommended: [
        "🥗 Leafy greens (kale, spinach) - Dopamine production",
        "🍓 Berries - Antioxidants for brain repair",
        "🥜 Walnuts - Omega-3 ALA for cognitive function",
        "🍗 Chicken breast - Lean protein for neurotransmitters",
        "🥄 Greek yogurt - Probiotics for gut-brain axis",
        "🌾 Quinoa - Complete protein + magnesium",
        "🥕 Carrots - Beta-carotene for cellular repair",
        "🍄 Mushrooms - Vitamin D for mood regulation"
      ],
      avoid: [
        "❌ Energy drinks - Artificial stimulants",
        "❌ White bread/pasta - Blood sugar spikes",
        "❌ Fast food - Inflammatory oils",
        "❌ Excessive dairy - May increase congestion",
        "❌ Artificial sweeteners - Disrupt gut bacteria"
      ],
      moodBoosters: [
        "🥑 Avocado toast - Healthy fats + B vitamins",
        "🍌 Banana smoothie - Tryptophan + potassium",
        "🫘 Chickpeas - B6 for serotonin synthesis",
        "🌻 Sunflower seeds - Vitamin E for brain health"
      ],
      stressRelievers: [
        "🍵 Ashwagandha tea - Adaptogen for cortisol",
        "🫖 Lavender tea - Calming aromatherapy",
        "🥥 Coconut water - Natural electrolytes",
        "🍒 Tart cherry juice - Natural melatonin"
      ]
    },
    supplements: [
      "L-theanine (200mg) - Calm focus without drowsiness",
      "Magnesium + Zinc - Mood and immune support",
      "Probiotics (10+ billion CFU) - Gut health",
      "Vitamin D3 (2000 IU) - Mood regulation"
    ],
    hydration: "2.5-3 liters water + herbal teas (peppermint, ginger)",
    tips: [
      "Meal prep on days you feel good",
      "Add one colorful vegetable to each meal",
      "Snack on nuts instead of chips",
      "Try intermittent fasting (12-hour window) if comfortable"
    ]
  },
  {
    phase: "Stabilization (Days 11-20)",
    dayRange: "11-20",
    foods: {
      recommended: [
        "🐟 Fatty fish (sardines, mackerel) - DHA for brain plasticity",
        "🫘 Lentils - Folate for emotional stability",
        "🥦 Broccoli sprouts - Sulforaphane detox support",
        "🌰 Brazil nuts - Selenium for thyroid function",
        "🍠 Sweet potato - Complex carbs + fiber",
        "🥬 Swiss chard - Magnesium + iron",
        "🍅 Tomatoes - Lycopene antioxidant",
        "🫑 Bell peppers - Vitamin C + bioflavonoids"
      ],
      avoid: [
        "❌ Heavy cream/butter - Slows digestion",
        "❌ Soda - Empty calories, sugar crash",
        "❌ Processed meats - Nitrates affect mood",
        "❌ Late-night eating - Disrupts sleep",
        "❌ Excessive coffee (>2 cups) - Sleep interference"
      ],
      moodBoosters: [
        "🍫 Cacao nibs - Raw chocolate benefits",
        "🥭 Mango - Vitamin B6 for serotonin",
        "🫒 Olives - Healthy fats for brain",
        "🌶️ Mild peppers - Endorphin release"
      ],
      stressRelievers: [
        "🍵 Holy basil tea - Adaptogenic herb",
        "🫖 Passionflower tea - GABA boost",
        "🥤 Matcha - L-theanine + gentle caffeine",
        "🍋 Lemon balm tea - Anxiety reduction"
      ]
    },
    supplements: [
      "5-HTP (100mg) - Serotonin precursor",
      "N-Acetyl Cysteine (600mg) - Glutamate regulation",
      "Omega-3 (2000mg) - Continued brain support",
      "Multivitamin - Fill nutritional gaps"
    ],
    hydration: "2-3 liters water + 1-2 herbal teas",
    tips: [
      "Focus on variety - eat the rainbow",
      "Cook with turmeric (curcumin) for inflammation",
      "Try fermented foods (kimchi, sauerkraut) for gut health",
      "Practice mindful eating - no screens during meals"
    ]
  },
  {
    phase: "Deep Healing (Days 21-40)",
    dayRange: "21-40",
    foods: {
      recommended: [
        "🥗 Mixed greens - Diverse phytonutrients",
        "🫐 Mixed berries - Anthocyanins for memory",
        "🌰 Mixed nuts - Healthy fats + minerals",
        "🐟 Wild fish - Low mercury, high omega-3",
        "🥚 Pasture-raised eggs - Complete nutrition",
        "🫘 Legumes - Fiber + plant protein",
        "🥑 Avocado - Monounsaturated fats",
        "🌾 Whole grains - B vitamins + fiber"
      ],
      avoid: [
        "❌ Trans fats - Inflammatory",
        "❌ High-fructose corn syrup - Metabolic issues",
        "❌ MSG - May affect neurotransmitters",
        "❌ Artificial colors - Behavioral effects",
        "❌ Excessive salt - Blood pressure concerns"
      ],
      moodBoosters: [
        "🍓 Strawberries - Anthocyanins for cognition",
        "🥜 Peanut butter (natural) - Protein + healthy fats",
        "🍇 Grapes - Resveratrol for brain health",
        "🥥 Coconut - MCT oils for energy"
      ],
      stressRelievers: [
        "🫖 Rooibos tea - Caffeine-free antioxidants",
        "🍵 Valerian root tea - Sleep support",
        "🌸 Hibiscus tea - Blood pressure regulation",
        "🍯 Manuka honey - Antibacterial properties"
      ]
    },
    supplements: [
      "Lion's Mane mushroom - Nerve growth factor",
      "Rhodiola rosea - Adaptogen for resilience",
      "Coenzyme Q10 - Cellular energy",
      "Curcumin with black pepper - Anti-inflammatory"
    ],
    hydration: "2-3 liters water + bone broth for minerals",
    tips: [
      "Establish consistent meal times",
      "Consider Mediterranean diet principles",
      "Experiment with intermittent fasting if appropriate",
      "Focus on whole, unprocessed foods 80% of the time"
    ]
  }
];

export default function NutritionLibrary() {
  const { user, profile } = useUser();
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [activeTab, setActiveTab] = useState<'recommended' | 'avoid' | 'mood' | 'stress'>('recommended');

  useEffect(() => {
    if (profile?.startDate) {
      const day = computeDayNumber(profile.startDate);
      setCurrentDay(day);
      
      // Auto-select phase based on current day
      if (day <= 3) setSelectedPhase(0);
      else if (day <= 10) setSelectedPhase(1);
      else if (day <= 20) setSelectedPhase(2);
      else setSelectedPhase(3);
    }
  }, [profile]);

  const currentPhase = nutritionData[selectedPhase];

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 1000, 
      margin: "0 auto",
      background: "linear-gradient(135deg, rgba(46, 204, 113, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)",
      minHeight: "100vh"
    }}>
      <Link to="/" style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        background: "var(--gradient-cool)",
        color: "white",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: 600,
        marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}>
        ← Back to Main Menu
      </Link>
      
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{
          fontSize: "2.5rem",
          background: "var(--gradient-forest)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 10
        }}>
          🥗 Nutrition Support Center
        </h1>
        {user && profile?.startDate && (
          <p style={{ 
            fontSize: "1.1rem", 
            color: "var(--joy-teal)",
            fontWeight: 600 
          }}>
            You're on Day {currentDay} of your T-Break journey
          </p>
        )}
        <p style={{ color: "var(--gray-medium)", fontSize: "0.95rem" }}>
          Data-driven nutrition recommendations for optimal recovery
        </p>
      </div>

      {/* Phase Selector */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 12,
        marginBottom: 30
      }}>
        {nutritionData.map((phase, index) => (
          <button
            key={index}
            onClick={() => setSelectedPhase(index)}
            style={{
              padding: "16px 12px",
              background: selectedPhase === index 
                ? "var(--gradient-forest)" 
                : "white",
              color: selectedPhase === index ? "white" : "var(--gray-dark)",
              border: selectedPhase === index ? "none" : "2px solid var(--gray-light)",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: selectedPhase === index 
                ? "0 4px 12px rgba(46, 204, 113, 0.3)" 
                : "0 2px 4px rgba(0,0,0,0.05)",
              transform: selectedPhase === index ? "scale(1.05)" : "scale(1)"
            }}
          >
            <div style={{ marginBottom: 4 }}>{phase.phase}</div>
            <div style={{ 
              fontSize: "0.75rem", 
              opacity: 0.9 
            }}>
              Days {phase.dayRange}
            </div>
          </button>
        ))}
      </div>

      {/* Phase Details */}
      <div style={{
        background: "white",
        padding: 30,
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        marginBottom: 20
      }}>
        <h2 style={{
          color: "var(--joy-green)",
          marginTop: 0,
          marginBottom: 20,
          fontSize: "1.8rem"
        }}>
          {currentPhase.phase}
        </h2>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          borderBottom: "2px solid var(--gray-light)",
          flexWrap: "wrap"
        }}>
          {[
            { key: 'recommended', label: '✅ Recommended', icon: '🥗' },
            { key: 'avoid', label: '❌ Avoid', icon: '🚫' },
            { key: 'mood', label: '😊 Mood Boosters', icon: '🌟' },
            { key: 'stress', label: '😌 Stress Relief', icon: '🧘' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: "12px 20px",
                background: activeTab === tab.key ? "var(--gradient-forest)" : "transparent",
                color: activeTab === tab.key ? "white" : "var(--gray-dark)",
                border: "none",
                borderRadius: "8px 8px 0 0",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: 300 }}>
          {activeTab === 'recommended' && (
            <div>
              <h3 style={{ color: "var(--joy-green)", marginBottom: 16 }}>Foods to Emphasize</h3>
              <ul style={{ lineHeight: 2, fontSize: "1rem" }}>
                {currentPhase.foods.recommended.map((food, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{food}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'avoid' && (
            <div>
              <h3 style={{ color: "var(--joy-orange)", marginBottom: 16 }}>Foods to Limit or Avoid</h3>
              <ul style={{ lineHeight: 2, fontSize: "1rem" }}>
                {currentPhase.foods.avoid.map((food, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{food}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'mood' && (
            <div>
              <h3 style={{ color: "var(--joy-purple)", marginBottom: 16 }}>Mood-Enhancing Foods</h3>
              <ul style={{ lineHeight: 2, fontSize: "1rem" }}>
                {currentPhase.foods.moodBoosters.map((food, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{food}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'stress' && (
            <div>
              <h3 style={{ color: "var(--joy-teal)", marginBottom: 16 }}>Stress-Reducing Options</h3>
              <ul style={{ lineHeight: 2, fontSize: "1rem" }}>
                {currentPhase.foods.stressRelievers.map((food, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{food}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Supplements */}
      <div style={{
        background: "var(--joy-purple-light)",
        padding: 25,
        borderRadius: 12,
        marginBottom: 20
      }}>
        <h3 style={{ marginTop: 0, color: "var(--joy-purple)" }}>💊 Suggested Supplements</h3>
        <ul style={{ lineHeight: 2, marginBottom: 8 }}>
          {currentPhase.supplements.map((sup, i) => (
            <li key={i}>{sup}</li>
          ))}
        </ul>
        <p style={{ 
          fontSize: "0.85rem", 
          color: "var(--gray-dark)", 
          marginBottom: 0,
          fontStyle: "italic" 
        }}>
          ⚠️ Consult healthcare provider before starting supplements
        </p>
      </div>

      {/* Hydration */}
      <div style={{
        background: "var(--joy-teal-light)",
        padding: 25,
        borderRadius: 12,
        marginBottom: 20
      }}>
        <h3 style={{ marginTop: 0, color: "var(--joy-teal)" }}>💧 Hydration Goals</h3>
        <p style={{ fontSize: "1.05rem", marginBottom: 0 }}>{currentPhase.hydration}</p>
      </div>

      {/* Tips */}
      <div style={{
        background: "var(--joy-orange-light)",
        padding: 25,
        borderRadius: 12
      }}>
        <h3 style={{ marginTop: 0, color: "var(--joy-orange)" }}>💡 Practical Tips</h3>
        <ul style={{ lineHeight: 2, marginBottom: 0 }}>
          {currentPhase.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
