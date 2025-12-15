// src/components/ChatPolicyModal.tsx
import { useState } from "react";

interface ChatPolicyModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function ChatPolicyModal({ onAccept, onDecline }: ChatPolicyModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    // Enable button at 80% scroll or if content is already fully visible
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
      background: "rgba(0,0,0,0.7)",
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
        maxWidth: 600,
        width: "100%",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        animation: "slideInUp 0.3s ease-out"
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 24px 20px",
          borderBottom: "2px solid #f0f0f0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px 16px 0 0",
          color: "white"
        }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
            💬 Community Chat Guidelines
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem", opacity: 0.95 }}>
            Please read and accept our community rules
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
            lineHeight: 1.6,
            color: "var(--gray-dark)"
          }}
        >
          <h3 style={{ color: "#667eea", marginTop: 0 }}>🤝 Our Community Values</h3>
          <p>
            T-Break Community Chat is a safe, supportive space for people on their cannabis break journey. 
            By using this chat, you agree to:
          </p>

          <h4 style={{ color: "#667eea", marginTop: 20 }}>✅ Do:</h4>
          <ul style={{ paddingLeft: 20 }}>
            <li><strong>Be respectful and supportive</strong> - We're all in this together</li>
            <li><strong>Share your experiences</strong> - Your story can help others</li>
            <li><strong>Encourage others</strong> - Celebrate wins, big or small</li>
            <li><strong>Keep it positive</strong> - Focus on recovery and growth</li>
            <li><strong>Respect privacy</strong> - What's shared here stays here</li>
          </ul>

          <h4 style={{ color: "#ff4d4d", marginTop: 20 }}>❌ Don't:</h4>
          <ul style={{ paddingLeft: 20 }}>
            <li><strong>No harassment or bullying</strong> - Zero tolerance policy</li>
            <li><strong>No promoting substance use</strong> - This is a recovery space</li>
            <li><strong>No spam or advertising</strong> - Keep it relevant</li>
            <li><strong>No personal attacks</strong> - Debate ideas, not people</li>
            <li><strong>No sharing personal contact info</strong> - Stay safe online</li>
          </ul>

          <h4 style={{ color: "#667eea", marginTop: 20 }}>🔒 Privacy & Safety</h4>
          <ul style={{ paddingLeft: 20 }}>
            <li>Your chat identity is <strong>anonymous</strong> and separate from your account</li>
            <li>Messages are visible to all community members</li>
            <li>We reserve the right to remove inappropriate content</li>
            <li>Serious violations may result in loss of chat access</li>
          </ul>

          <div style={{
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            padding: 16,
            borderRadius: 12,
            marginTop: 24,
            borderLeft: "4px solid #667eea"
          }}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              <strong>Remember:</strong> This chat is for mutual support. If you're experiencing a crisis, 
              please reach out to a professional helpline or healthcare provider.
            </p>
          </div>

          <div style={{
            textAlign: "center",
            marginTop: 20,
            color: hasScrolled ? "#4CAF50" : "var(--gray-medium)",
            fontSize: "0.85rem",
            fontWeight: hasScrolled ? 600 : 400,
            fontStyle: hasScrolled ? "normal" : "italic"
          }}>
            {hasScrolled ? "✅ Ready to accept!" : "📜 Scroll down to continue"}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: 20,
          borderTop: "2px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          gap: 12
        }}>
          <button
            onClick={onDecline}
            style={{
              padding: "14px 24px",
              background: "white",
              color: "#666",
              border: "2px solid #e0e0e0",
              borderRadius: 25,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#999";
              e.currentTarget.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e0e0e0";
              e.currentTarget.style.color = "#666";
            }}
          >
            ← Go Back
          </button>
          <button
            onClick={onAccept}
            disabled={!hasScrolled}
            style={{
              padding: "14px 32px",
              background: hasScrolled 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "#ccc",
              color: "white",
              border: "none",
              borderRadius: 25,
              fontSize: "1rem",
              fontWeight: 700,
              cursor: hasScrolled ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              boxShadow: hasScrolled ? "0 4px 15px rgba(102, 126, 234, 0.4)" : "none"
            }}
            onMouseEnter={(e) => {
              if (hasScrolled) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = hasScrolled ? "0 4px 15px rgba(102, 126, 234, 0.4)" : "none";
            }}
          >
            ✨ I Accept - Let's Chat!
          </button>
        </div>
      </div>
    </div>
  );
}
