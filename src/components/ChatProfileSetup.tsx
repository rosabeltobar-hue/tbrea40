import { useState, useEffect } from "react";
import { avatarOptions, generateAnonymousUsername, getAllCategories, getCategoryAvatars } from "../utils/avatars";

interface ChatProfileSetupProps {
  onComplete: (displayName: string, avatar: string) => void;
  onCancel: () => void;
}

export default function ChatProfileSetup({ onComplete, onCancel }: ChatProfileSetupProps) {
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Classic");
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  
  useEffect(() => {
    // Generate 3 suggested anonymous names
    setSuggestedNames([
      generateAnonymousUsername(),
      generateAnonymousUsername(),
      generateAnonymousUsername()
    ]);
  }, []);

  const handleSubmit = () => {
    if (displayName.trim() && selectedAvatar) {
      onComplete(displayName.trim(), selectedAvatar);
    }
  };

  const categories = getAllCategories();

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
      zIndex: 1000,
      padding: 20,
      animation: "fadeIn 0.3s ease-out"
    }}>
      <div style={{
        background: "white",
        borderRadius: "var(--radius-lg)",
        padding: 30,
        maxWidth: 600,
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "var(--shadow-xl)",
        animation: "slideInUp 0.4s ease-out"
      }}>
        <h2 style={{
          background: "var(--gradient-ocean)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginTop: 0,
          marginBottom: 10
        }}>
          🎭 Set Up Your Chat Identity
        </h2>
        
        <p style={{ color: "var(--gray-dark)", marginBottom: 25 }}>
          Choose an anonymous display name and avatar to protect your privacy in the community chat.
        </p>

        {/* Display Name */}
        <div style={{ marginBottom: 25 }}>
          <label style={{
            display: "block",
            fontWeight: 600,
            color: "var(--joy-purple)",
            marginBottom: 10
          }}>
            Display Name (Anonymous)
          </label>
          
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter a name or pick a suggestion below"
            maxLength={20}
            style={{
              width: "100%",
              padding: 12,
              border: "2px solid var(--joy-teal)",
              borderRadius: 8,
              fontSize: "1rem",
              boxSizing: "border-box"
            }}
          />
          
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: "0.85rem", color: "var(--gray-medium)", marginBottom: 8 }}>
              💡 Suggested anonymous names:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {suggestedNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setDisplayName(name)}
                  style={{
                    padding: "6px 12px",
                    background: displayName === name ? "var(--joy-teal)" : "var(--gray-lightest)",
                    color: displayName === name ? "white" : "var(--gray-dark)",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600
                  }}
                >
                  {name}
                </button>
              ))}
              <button
                onClick={() => {
                  setSuggestedNames([
                    generateAnonymousUsername(),
                    generateAnonymousUsername(),
                    generateAnonymousUsername()
                  ]);
                }}
                style={{
                  padding: "6px 12px",
                  background: "white",
                  color: "var(--joy-purple)",
                  border: "2px solid var(--joy-purple)",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600
                }}
              >
                🔄 More
              </button>
            </div>
          </div>
        </div>

        {/* Avatar Selection */}
        <div style={{ marginBottom: 25 }}>
          <label style={{
            display: "block",
            fontWeight: 600,
            color: "var(--joy-purple)",
            marginBottom: 10
          }}>
            Choose Your Avatar
          </label>
          
          {/* Category Tabs */}
          <div style={{ 
            display: "flex", 
            gap: 8, 
            marginBottom: 15,
            overflowX: "auto",
            paddingBottom: 8
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 16px",
                  background: selectedCategory === cat ? "var(--gradient-ocean)" : "var(--gray-lightest)",
                  color: selectedCategory === cat ? "white" : "var(--gray-dark)",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Avatar Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
            gap: 10,
            padding: 15,
            background: "var(--gray-lightest)",
            borderRadius: 8,
            maxHeight: 300,
            overflowY: "auto"
          }}>
            {getCategoryAvatars(selectedCategory).map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                title={avatar.name}
                style={{
                  padding: 10,
                  background: selectedAvatar === avatar.id ? "var(--joy-teal-light)" : "white",
                  border: selectedAvatar === avatar.id ? "3px solid var(--joy-teal)" : "2px solid transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "center",
                  fontSize: "2rem",
                  transition: "all 0.2s ease",
                  aspectRatio: "1"
                }}
              >
                {avatar.display}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {displayName && selectedAvatar && (
          <div style={{
            padding: 15,
            background: "var(--joy-teal-light)",
            borderRadius: 8,
            marginBottom: 20,
            border: "2px solid var(--joy-teal)"
          }}>
            <div style={{ fontSize: "0.85rem", color: "var(--gray-dark)", marginBottom: 8 }}>
              Preview:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: "2.5rem" }}>
                {avatarOptions.find(a => a.id === selectedAvatar)?.display}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "var(--joy-teal)", fontSize: "1.1rem" }}>
                  {displayName}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--gray-medium)" }}>
                  This is how you'll appear in chat
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 12,
              background: "white",
              color: "var(--gray-dark)",
              border: "2px solid var(--gray-light)",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!displayName.trim() || !selectedAvatar}
            style={{
              flex: 2,
              padding: 12,
              background: displayName.trim() && selectedAvatar 
                ? "var(--gradient-ocean)" 
                : "var(--gray-light)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: displayName.trim() && selectedAvatar ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: 600,
              opacity: displayName.trim() && selectedAvatar ? 1 : 0.5
            }}
          >
            ✓ Join Chat
          </button>
        </div>

        <p style={{ 
          fontSize: "0.8rem", 
          color: "var(--gray-medium)", 
          marginTop: 15,
          marginBottom: 0,
          textAlign: "center"
        }}>
          🔒 Your real identity remains private. Only your chosen name and avatar are visible.
        </p>
      </div>
    </div>
  );
}
