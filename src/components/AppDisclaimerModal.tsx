// src/components/AppDisclaimerModal.tsx
import { useState } from "react";

interface AppDisclaimerModalProps {
  onAccept: () => void;
}

export default function AppDisclaimerModal({ onAccept }: AppDisclaimerModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    if ((scrollPercentage >= 80 || element.scrollHeight <= element.clientHeight) && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: 20,
      animation: "fadeIn 0.3s ease-out"
    }}>
      <div style={{
        background: "white",
        borderRadius: 16,
        maxWidth: 650,
        width: "100%",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        animation: "slideInUp 0.3s ease-out"
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 24px 20px",
          borderBottom: "2px solid #f0f0f0",
          background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
          borderRadius: "16px 16px 0 0",
          color: "white"
        }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            ⚠️ Important Disclaimer
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem", opacity: 0.95 }}>
            Please read carefully before using T-Break
          </p>
        </div>

        {/* Content */}
        <div 
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "var(--gray-dark)"
          }}
        >
          <div style={{
            background: "#fff3cd",
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            borderLeft: "4px solid #ff9800"
          }}>
            <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: "#856404" }}>
              T-Break is a self-tracking and support tool. It is NOT a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>

          <h3 style={{ color: "#FF6B6B", marginTop: 0 }}>🏥 Medical Disclaimer</h3>
          
          <p>
            <strong>T-Break is designed as a personal aid and self-tracker</strong> to help you manage your cannabis tolerance break journey. However, you should be aware of the following:
          </p>

          <h4 style={{ color: "#333", marginTop: 20, fontSize: "1rem" }}>This App Does NOT:</h4>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li><strong>Provide medical advice</strong> - We are not doctors or healthcare professionals</li>
            <li><strong>Diagnose conditions</strong> - Withdrawal symptoms vary and may indicate other issues</li>
            <li><strong>Replace professional treatment</strong> - Always consult qualified healthcare providers</li>
            <li><strong>Guarantee specific outcomes</strong> - Individual results vary significantly</li>
            <li><strong>Monitor your health status</strong> - We cannot assess your medical condition</li>
          </ul>

          <h4 style={{ color: "#333", marginTop: 20, fontSize: "1rem" }}>This App DOES:</h4>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Help you <strong>track your progress</strong> through your tolerance break</li>
            <li>Provide <strong>general information</strong> about withdrawal symptoms</li>
            <li>Offer <strong>peer support</strong> through community features</li>
            <li>Suggest <strong>wellness strategies</strong> that may help during your break</li>
            <li>Give you tools to <strong>monitor your own journey</strong></li>
          </ul>

          <h4 style={{ color: "#333", marginTop: 20, fontSize: "1rem" }}>⚕️ When to Seek Professional Help:</h4>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>If you experience <strong>severe withdrawal symptoms</strong></li>
            <li>If you have thoughts of <strong>self-harm or suicide</strong></li>
            <li>If symptoms interfere with <strong>daily functioning</strong></li>
            <li>If you have <strong>pre-existing medical conditions</strong></li>
            <li>If you're taking <strong>medications</strong> that may interact</li>
            <li>If you have <strong>mental health concerns</strong></li>
          </ul>

          <div style={{
            background: "linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%)",
            padding: 16,
            borderRadius: 12,
            marginTop: 24,
            borderLeft: "4px solid #FF6B6B"
          }}>
            <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>
              🚨 <strong>Emergency Resources:</strong>
            </p>
            <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem" }}>
              • National Suicide Prevention Lifeline: <strong>988</strong><br/>
              • Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong><br/>
              • SAMHSA National Helpline: <strong>1-800-662-4357</strong>
            </p>
          </div>

          <h4 style={{ color: "#333", marginTop: 24, fontSize: "1rem" }}>📋 Your Responsibility:</h4>
          <p>
            By using T-Break, you acknowledge that:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>You are using this app <strong>at your own risk</strong></li>
            <li>You understand this is a <strong>self-help tool</strong>, not medical care</li>
            <li>You will seek professional help if needed</li>
            <li>The app developers are <strong>not liable</strong> for health outcomes</li>
            <li>Community advice is <strong>not professional guidance</strong></li>
          </ul>

          <div style={{
            background: "#e8f5e9",
            padding: 16,
            borderRadius: 12,
            marginTop: 24,
            borderLeft: "4px solid #4CAF50"
          }}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              <strong>✅ We Support You:</strong> While T-Break is not a medical service, we're here to provide tools, 
              community support, and resources to help you on your journey. Use this app as a complement to, 
              not a replacement for, professional care.
            </p>
          </div>

          <div style={{
            textAlign: "center",
            marginTop: 20,
            color: hasScrolled ? "#4CAF50" : "var(--gray-medium)",
            fontSize: "0.8rem",
            fontWeight: hasScrolled ? 600 : 400,
            fontStyle: hasScrolled ? "normal" : "italic"
          }}>
            {hasScrolled ? "✅ Ready to accept" : "📜 Scroll down to continue"}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: 20,
          borderTop: "2px solid #f0f0f0",
          display: "flex",
          justifyContent: "center"
        }}>
          <button
            onClick={onAccept}
            disabled={!hasScrolled}
            style={{
              padding: "14px 40px",
              background: hasScrolled 
                ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)" 
                : "#ccc",
              color: "white",
              border: "none",
              borderRadius: 25,
              fontSize: "1rem",
              fontWeight: 700,
              cursor: hasScrolled ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              boxShadow: hasScrolled ? "0 4px 15px rgba(76, 175, 80, 0.4)" : "none"
            }}
            onMouseEnter={(e) => {
              if (hasScrolled) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = hasScrolled ? "0 4px 15px rgba(76, 175, 80, 0.4)" : "none";
            }}
          >
            ✅ I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
