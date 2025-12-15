// src/pages/ChatRoom.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { sendChatMessage, subscribeToChatMessages } from "../services/chat";
import { ChatMessage } from "../types";
import Avatar from "../components/Avatar";
import { useOfflineContext } from "../context/OfflineContext";
import ChatProfileSetup from "../components/ChatProfileSetup";
import ChatPolicyModal from "../components/ChatPolicyModal";
import { getUser, createUser } from "../services/user";
import { avatarOptions } from "../utils/avatars";

// Get border color based on streak days
const getStreakColor = (streakDays: number): string => {
  if (streakDays >= 90) return "#B9F2FF"; // Diamond (90+ days)
  if (streakDays >= 30) return "#FFD700"; // Gold (30+ days)
  if (streakDays >= 14) return "#C0C0C0"; // Silver (14+ days)
  if (streakDays >= 7) return "#CD7F32"; // Bronze (7+ days)
  return "#4CAF50"; // Green (starting)
};

// Get tier name for display
const getStreakTier = (streakDays: number): string => {
  if (streakDays >= 90) return "💎 Diamond";
  if (streakDays >= 30) return "🥇 Gold";
  if (streakDays >= 14) return "🥈 Silver";
  if (streakDays >= 7) return "🥉 Bronze";
  return "🌱 Starting";
};

export default function ChatRoom() {
  const { user } = useUser();
  const { isOnline } = useOfflineContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [chatProfile, setChatProfile] = useState<{ displayName: string; avatar: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToChatMessages(setMessages);
    return () => unsub();
  }, []);

  // Check if user has chat profile set up
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    (async () => {
      try {
        const userData = await getUser(user.uid);
        
        // Check if user has accepted chat policy first
        if (!userData?.chatPolicyAccepted) {
          setShowPolicyModal(true);
          setLoading(false);
          return;
        }
        
        if (userData?.chatDisplayName && userData?.chatAvatar) {
          setChatProfile({
            displayName: userData.chatDisplayName,
            avatar: userData.chatAvatar
          });
        } else {
          setShowProfileSetup(true);
        }
      } catch (err) {
        console.error("Error loading chat profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Update word count when text changes
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [text]);

  const handleProfileComplete = async (displayName: string, avatar: string, customAvatarUrl?: string) => {
    if (!user) return;
    
    try {
      await createUser(user.uid, {
        chatDisplayName: displayName,
        chatAvatar: avatar,
        chatAvatarCustom: customAvatarUrl
      });
      setChatProfile({ displayName, avatar });
      setShowProfileSetup(false);
    } catch (err) {
      console.error("Error saving chat profile:", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleAcceptPolicy = async () => {
    if (!user) return;
    try {
      await createUser(user.uid, { chatPolicyAccepted: true });
      setShowPolicyModal(false);
      
      // Now check if they need to set up profile
      const userData = await getUser(user.uid);
      if (userData?.chatDisplayName && userData?.chatAvatar) {
        setChatProfile({ displayName: userData.chatDisplayName, avatar: userData.chatAvatar });
      } else {
        setShowProfileSetup(true);
      }
    } catch (error) {
      console.error("Error accepting policy:", error);
      alert("Failed to save policy acceptance. Please try again.");
    }
  };

  const handleSend = async () => {
    if (!user || !text.trim() || !chatProfile) return;    
    // Check word limit
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length > 30) {
      alert("⚠️ Message too long! Please keep it under 30 words to maintain chat flow.");
      return;
    }
    setSending(true);
    try {
      const userData = await getUser(user.uid);
      
      // Use saved chat profile from state, not from userData
      await sendChatMessage(
        user.uid,
        chatProfile.displayName, // Use state value consistently
        chatProfile.avatar, // Use state value consistently  
        userData?.avatarType || "hero",
        text.trim(),
        userData?.streakDays || 0,
        false,
        userData?.avatarMedals || [],
        0,
        userData?.chatAvatarCustom // Pass custom avatar URL
      );
      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Chat Policy Modal (First Time Only) */}
      {showPolicyModal && user && (
        <ChatPolicyModal 
          onAccept={handleAcceptPolicy}
          onDecline={() => navigate("/dashboard")}
        />
      )}

      {/* Chat Profile Setup Modal */}
      {showProfileSetup && user && (
        <ChatProfileSetup
          onComplete={handleProfileComplete}
          onCancel={() => setShowProfileSetup(false)}
        />
      )}

      <div style={{ 
        flex: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: 1200,
        width: "100%",
        margin: "0 auto",
        padding: 20
      }}>
        {/* Header */}
        <div style={{ 
          background: "rgba(255,255,255,0.95)",
          borderRadius: "12px 12px 0 0",
          padding: "15px 20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: "slideInDown 0.6s ease-out"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div style={{ 
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#4CAF50",
              boxShadow: "0 0 10px #4CAF50",
              animation: "pulse 2s infinite"
            }} />
            <div>
              <h1 style={{
                fontSize: "1.5rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0
              }}>
                💬 T-Break Community
              </h1>
              <p style={{ color: "var(--gray-medium)", margin: 0, fontSize: "0.85rem" }}>
                {messages.length} messages • {user ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          {chatProfile && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "8px 16px",
              borderRadius: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}>
              <span style={{ fontSize: "1.2rem" }}>
                {avatarOptions.find(a => a.id === chatProfile.avatar)?.display}
              </span>
              <span style={{ fontWeight: 600, color: "white", fontSize: "0.9rem" }}>
                {chatProfile.displayName}
              </span>
              <button
                onClick={() => setShowProfileSetup(true)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  padding: "4px 8px",
                  borderRadius: 6
                }}
                title="Change identity"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {!user && (
          <div style={{
            background: "var(--gradient-warm)",
            color: "white",
            padding: 20,
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            marginBottom: 20,
            boxShadow: "var(--shadow-md)",
            animation: "slideInUp 0.6s ease-out"
          }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 15 }}>
              🔐 You must be logged in to send messages.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "10px 24px",
                  background: "white",
                  color: "var(--joy-orange)",
                  border: "none",
                  borderRadius: 8,
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-md)"
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                style={{
                  padding: "10px 24px",
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: 8,
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {loading && user && (
          <div style={{
            textAlign: "center",
            padding: 40,
            color: "var(--gray-medium)"
          }}>
            Loading chat profile...
          </div>
        )}

        {!isOnline && user && !loading && (
          <div style={{
            background: "var(--gradient-warm)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-lg)",
            padding: 16,
            marginBottom: 20,
            fontSize: "1rem",
            fontWeight: 600,
            textAlign: "center",
            animation: "slideInUp 0.6s ease-out",
            boxShadow: "var(--shadow-md)"
          }}>
            ⚠️ You're offline. Messages will queue and send automatically when you're back online! ✨
          </div>
        )}

        {/* IRC-Style Messages Container */}
        {!loading && (
          <div style={{
            background: "#36393f",
            border: "none",
            borderRadius: 0,
            height: 500,
            overflowY: "auto",
            padding: 16,
            marginBottom: 0,
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
            animation: "slideInUp 0.65s ease-out",
            fontFamily: "'Courier New', monospace"
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: "center",
                color: "#72767d",
                padding: "40px 20px",
                fontSize: "0.95rem"
              }}>
                <p style={{ fontSize: "2rem", margin: "0 0 10px 0" }}>💬</p>
                <p style={{ fontStyle: "italic" }}>Welcome to #t-break-community</p>
                <p style={{ fontSize: "0.85rem", marginTop: 8 }}>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((m, idx) => {
                const messageAvatar = avatarOptions.find(a => a.id === m.chatAvatar);
                const isOwnMessage = user?.uid === m.userId;
                const messageTime = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: 12,
                      padding: "8px 12px",
                      background: isOwnMessage ? "rgba(114, 137, 218, 0.1)" : "transparent",
                      borderRadius: 4,
                      transition: "background 0.15s ease",
                      borderLeft: isOwnMessage ? "3px solid #7289da" : "3px solid transparent"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isOwnMessage ? "rgba(114, 137, 218, 0.15)" : "rgba(255,255,255,0.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = isOwnMessage ? "rgba(114, 137, 218, 0.1)" : "transparent"}
                  >
                    <div style={{ 
                      flexShrink: 0, 
                      marginRight: 12,
                    }}>
                      {m.chatAvatarCustom ? (
                        <img
                          src={m.chatAvatarCustom}
                          alt="avatar"
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `2px solid ${getStreakColor(m.streakDays)}`
                          }}
                        />
                      ) : (
                        <div style={{ 
                          fontSize: "2rem",
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          border: `2px solid ${getStreakColor(m.streakDays)}`,
                          background: "#40444b"
                        }}>
                          {messageAvatar?.display || "😊"}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                        <span style={{
                          fontSize: "0.95rem",
                          color: getStreakColor(m.streakDays),
                          fontWeight: 700
                        }}>
                          {m.chatDisplayName}
                        </span>
                        <span style={{
                          fontSize: "0.7rem",
                          color: "#72767d"
                        }}>
                          {messageTime}
                        </span>
                        {m.streakDays >= 7 && (
                          <span style={{
                            fontSize: "0.7rem",
                            background: getStreakColor(m.streakDays),
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: 8,
                            fontWeight: 600
                          }}>
                            {getStreakTier(m.streakDays)}
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.4,
                        color: "#dcddde",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap"
                      }}>
                        {m.message}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* IRC-Style Input Area */}
        {user && chatProfile && !loading && (
          <div style={{
            background: "#40444b",
            padding: "16px 20px",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", gap: 12, animation: "slideInUp 0.7s ease-out" }}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Message #t-break-community"
                disabled={sending}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: wordCount > 30 ? "2px solid #ff4444" : "none",
                  borderRadius: 8,
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                  background: "#2c2f33",
                  color: "#dcddde",
                  outline: "none"
                }}
              />
              <button
                onClick={handleSend}
                disabled={sending || !text.trim() || wordCount > 30}
                style={{
                  padding: "12px 24px",
                  background: sending || !text.trim() || wordCount > 30 ? "#4f545c" : "#7289da",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: sending || !text.trim() || wordCount > 30 ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  if (!sending && text.trim() && wordCount <= 30) {
                    e.currentTarget.style.background = "#5b6eae";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!sending && text.trim() && wordCount <= 30) {
                    e.currentTarget.style.background = "#7289da";
                  }
                }}
              >
                {sending ? "⏳" : "Send"}
              </button>
            </div>
            <div style={{
              marginTop: 8,
              fontSize: "0.75rem",
              color: wordCount > 30 ? "#ff4444" : "#72767d",
              textAlign: "right",
              fontWeight: wordCount > 30 ? 600 : 400
            }}>
              {wordCount > 30 ? "⚠️ " : ""}{wordCount}/30 words {wordCount > 30 && "- Too long!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
