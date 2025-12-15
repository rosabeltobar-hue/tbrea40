// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";
import { getUser } from "../services/user";
import { getDailyQuote, calculateMetaboliteClearance, relaxationTechniques, wellnessCategories } from "../utils/wellness";
import { getWithdrawalTimeline, getSymptomsForDay, getDifficultyColor, getDifficultyLabel } from "../utils/symptoms";
import { NightlyCheckIn } from "../components/NightlyCheckIn";
import SymptomTracker from "../components/SymptomTracker";
import WithdrawalTimeline from "../components/WithdrawalTimeline";
import AppDisclaimerModal from "../components/AppDisclaimerModal";
import { createUser } from "../services/user";

export default function Dashboard() {
  const { user } = useUser();
  const [showNightlyCheckIn, setShowNightlyCheckIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [daysClean, setDaysClean] = useState(0);
  const [dailyQuote, setDailyQuote] = useState("");
  const [metaboliteData, setMetaboliteData] = useState<any>(null);
  const [selectedWellnessCategory, setSelectedWellnessCategory] = useState<string | null>(null);
  const [showSymptomTracker, setShowSymptomTracker] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Load user data
    (async () => {
      const doc = await getUser(user.uid);
      setUserData(doc);
      
      // Check if user has accepted disclaimer
      if (!doc?.disclaimerAccepted) {
        setShowDisclaimerModal(true);
      }
      
      // Calculate days clean
      if (doc?.startDate) {
        const start = new Date(doc.startDate);
        const now = new Date();
        const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        setDaysClean(Math.max(0, days));
        
        // Calculate metabolite clearance
        if (doc.frequency && doc.yearsOfUse && doc.weight && doc.usageType) {
          const clearance = calculateMetaboliteClearance(
            doc.frequency,
            doc.yearsOfUse,
            doc.weight,
            doc.usageType,
            days
          );
          setMetaboliteData(clearance);
        }
      }
      
      // Set daily quote
      setDailyQuote(getDailyQuote(daysClean || 1));
    })();
    
    // Check if we should show nightly check-in (after 8 PM)
    const checkNightlyCheckIn = () => {
      const now = new Date();
      const hour = now.getHours();
      const lastCheckIn = localStorage.getItem(`lastNightlyCheckIn_${user.uid}`);
      const today = now.toDateString();
      
      // Show between 8 PM and midnight if not already done today
      if (hour >= 20 && lastCheckIn !== today) {
        setShowNightlyCheckIn(true);
      }
    };
    
    checkNightlyCheckIn();
    const interval = setInterval(checkNightlyCheckIn, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user]);

  const handleAcceptDisclaimer = async () => {
    if (!user) return;
    try {
      await createUser(user.uid, { disclaimerAccepted: true });
      setShowDisclaimerModal(false);
    } catch (error) {
      console.error("Error accepting disclaimer:", error);
      alert("Failed to save. Please try again.");
    }
  };

  const handleNightlyCheckInSubmit = async (mood: string, notes: string) => {
    if (!user) return;
    
    // Save to user document
    await createUser(user.uid, {
      lastNightlyCheckIn: new Date().toISOString(),
      lastNightlyMood: mood,
      lastNightlyNotes: notes,
    });
    
    // Mark as done for today
    localStorage.setItem(`lastNightlyCheckIn_${user.uid}`, new Date().toDateString());
    setShowNightlyCheckIn(false);
  };

  const navItems = [
    { path: "/checkin", label: "Daily Check-in", icon: "📝", color: "var(--gradient-warm)" },
    { path: "/calendar", label: "Emotion Calendar", icon: "📅", color: "var(--gradient-ocean)" },
    { path: "/chat", label: "Community Chat", icon: "💬", color: "var(--gradient-cool)" },
    { path: "/nutrition", label: "Nutrition Center", icon: "🥗", color: "var(--gradient-forest)" },
    { path: "/estimator", label: "Metabolite Estimator", icon: "⚗️", color: "var(--gradient-sunset)" },
    { path: "/profile", label: "My Profile", icon: "👤", color: "var(--gradient-ocean)" },
    { path: "/donations", label: "💚 Support Us (Donations)", icon: "🎁", color: "var(--gradient-warm)", isSpecial: true },
  ];

  return (
    <div style={{ 
      padding: 20, 
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(26, 188, 156, 0.05) 0%, rgba(142, 68, 173, 0.05) 100%)"
    }}>
      {/* App Disclaimer Modal (First Time Only) */}
      {showDisclaimerModal && user && (
        <AppDisclaimerModal onAccept={handleAcceptDisclaimer} />
      )}

      {/* Nightly Check-in Modal */}
      {showNightlyCheckIn && user && (
        <NightlyCheckIn
          onSubmit={handleNightlyCheckInSubmit}
          onClose={() => setShowNightlyCheckIn(false)}
        />
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40, animation: "slideInDown 0.6s ease-out" }}>
          <h1 style={{ 
            fontSize: "3.5rem",
            background: "var(--gradient-sunset)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 10,
            animation: "bounce 3s ease-in-out infinite"
          }}>
            🎉 T-Break40 🎉
          </h1>
          {user ? (
            <div>
              <p style={{ fontSize: "1.3rem", color: "var(--joy-teal)", fontWeight: 600 }}>
                ✨ Welcome, {user.email}! ✨
              </p>
              <p style={{ color: "var(--gray-medium)", marginTop: 8 }}>
                You're on an amazing journey to transform your life
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "1.2rem", color: "var(--joy-purple)", fontWeight: 600 }}>
                Start your 40-day break journey!
              </p>
              <nav style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
                <Link to="/login" style={{
                  padding: "12px 24px",
                  background: "var(--gradient-cool)",
                  color: "white",
                  borderRadius: "var(--radius-lg)",
                  fontWeight: 600,
                }}>Login</Link>
                <Link to="/signup" style={{
                  padding: "12px 24px",
                  background: "var(--gradient-warm)",
                  color: "white",
                  borderRadius: "var(--radius-lg)",
                  fontWeight: 600,
                }}>Signup</Link>
              </nav>
            </div>
          )}
        </div>

        {/* Main Call to Action */}
        {user && (
          <>
            {/* Daily Quote */}
            <div style={{
              background: "var(--gradient-sunset)",
              backgroundSize: "200% 200%",
              padding: 25,
              borderRadius: "var(--radius-lg)",
              color: "white",
              textAlign: "center",
              marginBottom: 20,
              boxShadow: "var(--shadow-lg)",
              animation: "slideInUp 0.6s ease-out",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>💭</div>
              <p style={{ 
                fontSize: "1.1rem", 
                fontStyle: "italic", 
                margin: 0,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.98)"
              }}>
                "{dailyQuote}"
              </p>
            </div>

            {/* Metabolite Tracker */}
            {metaboliteData && (
              <div style={{
                background: "white",
                padding: 25,
                borderRadius: "var(--radius-lg)",
                marginBottom: 20,
                boxShadow: "var(--shadow-md)",
                animation: "slideInUp 0.7s ease-out",
              }}>
                <h3 style={{ 
                  background: "var(--gradient-cool)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginTop: 0,
                  marginBottom: 15
                }}>
                  🧪 Metabolite Clearance Tracker
                </h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 15, marginBottom: 20 }}>
                  <div style={{ textAlign: "center", padding: 15, background: "var(--joy-teal-light)", borderRadius: 8 }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--joy-teal)" }}>
                      {daysClean}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--gray-dark)" }}>Days Clean</div>
                  </div>
                  
                  <div style={{ textAlign: "center", padding: 15, background: "var(--joy-orange-light)", borderRadius: 8 }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--joy-orange)" }}>
                      {metaboliteData.estimatedDaysToFullClear - daysClean}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--gray-dark)" }}>Days Remaining</div>
                  </div>
                  
                  <div style={{ textAlign: "center", padding: 15, background: "var(--joy-green-light)", borderRadius: 8 }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--joy-green)" }}>
                      {metaboliteData.currentClearancePercent}%
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--gray-dark)" }}>Cleared</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{ 
                  width: "100%", 
                  height: 20, 
                  background: "var(--gray-light)", 
                  borderRadius: 10,
                  overflow: "hidden",
                  marginBottom: 10
                }}>
                  <div style={{
                    width: `${metaboliteData.currentClearancePercent}%`,
                    height: "100%",
                    background: "var(--gradient-forest)",
                    transition: "width 1s ease-out"
                  }} />
                </div>
                
                <p style={{ 
                  textAlign: "center", 
                  color: "var(--joy-green)", 
                  fontWeight: 600,
                  margin: 0
                }}>
                  {metaboliteData.status}
                </p>
              </div>
            )}

            {/* Relaxation Techniques */}
            <div style={{
              background: "white",
              padding: 25,
              borderRadius: "var(--radius-lg)",
              marginBottom: 20,
              boxShadow: "var(--shadow-md)",
              animation: "slideInUp 0.8s ease-out",
            }}>
              <h3 style={{ 
                background: "var(--gradient-ocean)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginTop: 0,
                marginBottom: 15
              }}>
                🧘 Quick Relaxation Techniques
              </h3>
              
              <div style={{ display: "grid", gap: 12 }}>
                {relaxationTechniques.slice(0, 4).map((technique) => (
                  <div key={technique.title} style={{
                    padding: 15,
                    background: "var(--gray-lightest)",
                    borderRadius: 8,
                    borderLeft: "4px solid var(--joy-teal)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: "1.5rem" }}>{technique.icon}</span>
                      <strong style={{ color: "var(--joy-teal)" }}>{technique.title}</strong>
                      <span style={{ 
                        marginLeft: "auto", 
                        fontSize: "0.85rem", 
                        color: "var(--gray-medium)",
                        background: "white",
                        padding: "4px 8px",
                        borderRadius: 4
                      }}>
                        {technique.duration}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--gray-dark)" }}>
                      {technique.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Tips */}
            <div style={{
              background: "white",
              padding: 25,
              borderRadius: "var(--radius-lg)",
              marginBottom: 20,
              boxShadow: "var(--shadow-md)",
              animation: "slideInUp 0.9s ease-out",
            }}>
              <h3 style={{ 
                background: "var(--gradient-forest)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginTop: 0,
                marginBottom: 15
              }}>
                🌟 Wellness Resources & Support
              </h3>
              
              <p style={{ color: "var(--gray-dark)", marginBottom: 20 }}>
                Click a category to explore resources that help with detox, anxiety, sleep, and more!
              </p>

              {/* Category Cards Grid */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
                gap: 15,
                marginBottom: 20
              }}>
                {wellnessCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedWellnessCategory(
                      selectedWellnessCategory === category.id ? null : category.id
                    )}
                    style={{
                      padding: 20,
                      background: selectedWellnessCategory === category.id 
                        ? category.lightColor 
                        : "var(--gray-lightest)",
                      borderRadius: 12,
                      textAlign: "center",
                      cursor: "pointer",
                      border: selectedWellnessCategory === category.id 
                        ? `3px solid ${category.color}` 
                        : "3px solid transparent",
                      transition: "all 0.3s ease",
                      transform: selectedWellnessCategory === category.id ? "scale(1.05)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = selectedWellnessCategory === category.id ? "scale(1.05)" : "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "3rem", marginBottom: 8 }}>
                      {category.icon}
                    </div>
                    <div style={{ 
                      fontSize: "0.9rem", 
                      fontWeight: 600,
                      color: category.color
                    }}>
                      {category.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Category Resources */}
              {selectedWellnessCategory && (
                <div style={{
                  background: wellnessCategories.find(c => c.id === selectedWellnessCategory)?.lightColor,
                  padding: 20,
                  borderRadius: 12,
                  border: `2px solid ${wellnessCategories.find(c => c.id === selectedWellnessCategory)?.color}`,
                  animation: "slideInUp 0.4s ease-out"
                }}>
                  <h4 style={{ 
                    color: wellnessCategories.find(c => c.id === selectedWellnessCategory)?.color,
                    marginTop: 0,
                    marginBottom: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>
                      {wellnessCategories.find(c => c.id === selectedWellnessCategory)?.icon}
                    </span>
                    {wellnessCategories.find(c => c.id === selectedWellnessCategory)?.title}
                  </h4>

                  <div style={{ display: "grid", gap: 12 }}>
                    {wellnessCategories
                      .find(c => c.id === selectedWellnessCategory)
                      ?.resources.map((resource, idx) => (
                        <div key={idx} style={{
                          padding: 15,
                          background: "white",
                          borderRadius: 8,
                          boxShadow: "var(--shadow-sm)"
                        }}>
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 8
                          }}>
                            <strong style={{ 
                              color: wellnessCategories.find(c => c.id === selectedWellnessCategory)?.color,
                              fontSize: "1.05rem"
                            }}>
                              {resource.name}
                            </strong>
                            {(resource as any).frequency && (
                              <span style={{
                                fontSize: "0.75rem",
                                background: wellnessCategories.find(c => c.id === selectedWellnessCategory)?.lightColor,
                                padding: "4px 8px",
                                borderRadius: 4,
                                color: wellnessCategories.find(c => c.id === selectedWellnessCategory)?.color,
                                fontWeight: 600
                              }}>
                                {(resource as any).frequency}
                              </span>
                            )}
                          </div>
                          
                          <div style={{ 
                            fontSize: "0.9rem",
                            color: "var(--joy-teal)",
                            fontWeight: 600,
                            marginBottom: 6
                          }}>
                            ✓ {resource.benefits}
                          </div>
                          
                          <p style={{ 
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "var(--gray-dark)",
                            lineHeight: 1.5
                          }}>
                            {resource.description}
                          </p>
                          
                          <div style={{ 
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginTop: 8
                          }}>
                            {resource.helps.map((symptom: string) => (
                              <span key={symptom} style={{
                                fontSize: "0.7rem",
                                background: "var(--gray-lightest)",
                                padding: "3px 8px",
                                borderRadius: 12,
                                color: "var(--gray-medium)",
                                textTransform: "uppercase",
                                fontWeight: 600
                              }}>
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => setSelectedWellnessCategory(null)}
                    style={{
                      marginTop: 15,
                      padding: "10px 20px",
                      background: wellnessCategories.find(c => c.id === selectedWellnessCategory)?.color,
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      width: "100%"
                    }}
                  >
                    ← Back to Categories
                  </button>
                </div>
              )}
            </div>

            {/* Action CTA */}
            <div style={{
              background: "var(--gradient-rainbow)",
              backgroundSize: "200% 200%",
              padding: 20,
              borderRadius: "var(--radius-lg)",
              color: "white",
              textAlign: "center",
              marginBottom: 30,
              boxShadow: "var(--shadow-lg)",
              animation: "slideInUp 1s ease-out",
            }}>
              <h2 style={{ color: "white", marginTop: 0 }}>🚀 Keep Going! 🚀</h2>
              <p style={{ color: "rgba(255,255,255,0.95)" }}>
                Log your mood, track your progress, and connect with our amazing community!
              </p>
            </div>
          </>
        )}
        {/* Withdrawal Timeline */}
        {userData && userData.frequency && daysClean > 0 && (
          <WithdrawalTimeline
            frequency={userData.frequency}
            yearsOfUse={userData.yearsOfUse}
            currentDay={daysClean}
          />
        )}

        {/* Symptom Tracker */}
        {userData && daysClean > 0 && user && (
          <SymptomTracker
            userId={user.uid}
            currentDay={daysClean}
            onSave={() => console.log("Symptoms saved")}
          />
        )}
        {/* Navigation Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                color: "inherit",
                animation: "slideInUp 0.6s ease-out forwards",
              }}
            >
              <div style={{
                background: item.color,
                backgroundSize: "200% 200%",
                padding: 20,
                borderRadius: "var(--radius-lg)",
                color: "white",
                textAlign: "center",
                boxShadow: "var(--shadow-md)",
                transition: "all var(--transition-normal)",
                cursor: "pointer",
                transform: "scale(1)",
                border: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-8px) scale(1.05)";
                el.style.boxShadow = "var(--shadow-xl)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "scale(1)";
                el.style.boxShadow = "var(--shadow-md)";
              }}
              >
                <div style={{ fontSize: "3rem", marginBottom: 12, animation: "bounce 2s ease-in-out infinite" }}>
                  {item.icon}
                </div>
                <h3 style={{ 
                  color: "white",
                  marginTop: 0,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                  {item.label}
                </h3>
                <p style={{ 
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.95rem",
                  margin: 0,
                  fontWeight: 500
                }}>
                  {item.isSpecial ? "Make a difference" : "Click to explore"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{
          textAlign: "center",
          marginTop: 40,
          padding: 20,
          background: "white",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          animation: "slideInUp 0.8s ease-out",
        }}>
          <p style={{ fontSize: "1.1rem", color: "var(--gray-dark)" }}>
            💪 Remember: Every day you stay strong, you're building a better tomorrow!
          </p>
        </div>
      </div>

      {/* Nightly Check-In Modal */}
      {showNightlyCheckIn && (
        <NightlyCheckIn 
          onClose={() => setShowNightlyCheckIn(false)}
          onSubmit={handleNightlyCheckInSubmit}
        />
      )}
    </div>
  );
}
