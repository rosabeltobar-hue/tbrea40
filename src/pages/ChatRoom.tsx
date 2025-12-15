// src/pages/ChatRoom.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { sendChatMessage, subscribeToChatMessages } from "../services/chat";
import { ChatMessage } from "../types";
import Avatar from "../components/Avatar";
import { useOfflineContext } from "../context/OfflineContext";
import ChatProfileSetup from "../components/ChatProfileSetup";
import { getUser, createUser } from "../services/user";
import { avatarOptions } from "../utils/avatars";

export default function ChatRoom() {
  const { user } = useUser();
  const { isOnline } = useOfflineContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
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

  const handleSend = async () => {
    if (!user || !text.trim() || !chatProfile) return;

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

        {/* Messages Container */}
        {!loading && (
          <div style={{
            background: "white",
            border: "2px solid var(--joy-teal)",
            borderRadius: "var(--radius-lg)",
            height: 400,
            overflowY: "auto",
            padding: 16,
            marginBottom: 20,
            boxShadow: "var(--shadow-md)",
            animation: "slideInUp 0.65s ease-out"
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: "center",
                color: "var(--gray-medium)",
                padding: "40px 20px",
                fontSize: "1rem"
              }}>
                <p style={{ fontSize: "2.5rem", margin: "0 0 10px 0" }}>🌟</p>
                <p>No messages yet. Be the first to share your support!</p>
              </div>
            ) : (
              messages.map((m, idx) => {
                const messageAvatar = avatarOptions.find(a => a.id === m.chatAvatar);
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: 16,
                      padding: 12,
                      background: idx % 2 === 0 ? "linear-gradient(135deg, rgba(26, 188, 156, 0.1) 0%, rgba(142, 68, 173, 0.05) 100%)" : "white",
                      borderRadius: "var(--radius-md)",
                      animation: "slideInUp 0.3s ease-out",
                      borderLeft: "4px solid var(--joy-teal)"
                    }}
                  >
                    <div style={{ 
                      flexShrink: 0, 
                      marginRight: 12,
                      fontSize: "2.5rem"
                    }}>
                      {messageAvatar?.display || "😊"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: "0.95rem",
                        color: "var(--joy-purple)",
                        fontWeight: 700,
                        marginBottom: 4
                      }}>
                        {m.chatDisplayName}
                      </div>
                      <div style={{
                        fontSize: "0.75rem",
                        color: "var(--joy-orange)",
                        fontWeight: 600,
                        marginBottom: 6
                      }}>
                        🔥 Streak: {m.streakDays} days
                      </div>
                      <div style={{
                        fontSize: "1rem",
                        lineHeight: 1.5,
                        color: "var(--gray-dark)",
                        wordWrap: "break-word"
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

        {/* Input Area */}
        {user && chatProfile && !loading && (
          <div style={{
            display: "flex",
            gap: 12,
            animation: "slideInUp 0.7s ease-out"
          }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="💭 Write a supportive message..."
              disabled={sending}
              style={{
                flex: 1,
                padding: 14,
                border: "2px solid var(--joy-teal)",
                borderRadius: "var(--radius-lg)",
                fontSize: "1rem",
                fontFamily: "inherit",
                transition: "all var(--transition-normal)",
                background: sending ? "var(--gray-light)" : "white",
              }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !text.trim()}
              style={{
                padding: "14px 28px",
                background: sending || !text.trim() ? "var(--gray-medium)" : "var(--gradient-sunset)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-lg)",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: sending || !text.trim() ? "not-allowed" : "pointer",
                transition: "all var(--transition-normal)",
                whiteSpace: "nowrap",
                boxShadow: "var(--shadow-md)"
              }}
            >
              {sending ? "📤 Sending..." : "✨ Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
