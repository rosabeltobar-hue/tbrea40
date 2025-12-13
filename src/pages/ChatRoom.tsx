// src/pages/ChatRoom.tsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { sendChatMessage, subscribeToChatMessages } from "../services/chat";
import { ChatMessage } from "../types";
import Avatar from "../components/Avatar";
import { useOfflineContext } from "../context/OfflineContext";

export default function ChatRoom() {
  const { user } = useUser();
  const { isOnline } = useOfflineContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const unsub = subscribeToChatMessages(setMessages);
    return () => unsub();
  }, []);

  const handleSend = async () => {
    if (!user || !text.trim()) return;

    setSending(true);
    try {
      await sendChatMessage(
        user.uid,
        "hero", // later: real avatar
        text.trim(),
        5, // example streak
        false,
        []
      );
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      padding: 20,
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(142, 68, 173, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 30, animation: "slideInDown 0.6s ease-out" }}>
          <h1 style={{
            fontSize: "2.5rem",
            background: "var(--gradient-ocean)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 10
          }}>
            💬 Community Chat 💬
          </h1>
          <p style={{ color: "var(--joy-teal)", fontWeight: 600, fontSize: "1.05rem" }}>
            Support each other on this amazing journey!
          </p>
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
            <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
              🔐 You must be logged in to send messages.
            </p>
          </div>
        )}

        {!isOnline && (
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
            messages.map((m, idx) => (
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
                <div style={{ flexShrink: 0, marginRight: 12 }}>
                  <Avatar
                    avatarType={m.avatarType}
                    relapse={m.relapse}
                    streakDays={m.streakDays}
                    medals={m.medals}
                    coins={m.coins}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "var(--joy-purple)",
                    fontWeight: 700,
                    marginBottom: 4
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
            ))
          )}
        </div>

        {/* Input Area */}
        {user && (
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
