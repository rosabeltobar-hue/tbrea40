// src/pages/ChatRoom.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { sendChatMessage, subscribeToChatMessages } from "../services/chat";
import { getUser } from "../services/user";
import { ChatMessage } from "../types";
import Avatar from "../components/Avatar";

export default function ChatRoom() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    // Load user profile to get display name
    getUser(user.uid).then(setUserProfile);
  }, [user]);

  useEffect(() => {
    const unsub = subscribeToChatMessages(setMessages);
    return () => unsub();
  }, []);

  const handleSend = async () => {
    if (!user || !text.trim()) return;

    // Get display name from profile or use email or default
    const displayName = userProfile?.displayName || user.email?.split('@')[0] || "Anonymous";

    await sendChatMessage(
      user.uid,
      displayName,
      "hero", // later: real avatar
      text.trim(),
      userProfile?.streakDays || 0,
      false,
      userProfile?.avatarMedals || [],
      userProfile?.totalCoins || 0
    );
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
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
      
      <h1>Community Chat</h1>

      {!user && <p>You must be logged in to send messages.</p>}

      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          marginTop: 10,
          padding: 10
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 16,
              padding: 12,
              background: "#f9f9f9",
              borderRadius: 8
            }}
          >
            <Avatar
              avatarType={m.avatarType}
              relapse={m.relapse}
              streakDays={m.streakDays}
              medals={m.medals || []}
              coins={m.coins || 0}
            />
            <div style={{ marginLeft: 12, flex: 1 }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 8,
                marginBottom: 4 
              }}>
                <span style={{ 
                  fontWeight: 600, 
                  color: "var(--joy-purple)",
                  fontSize: "14px"
                }}>
                  {m.userName}
                </span>
                <span style={{ 
                  fontSize: 11, 
                  color: "#999",
                  background: "#e0e0e0",
                  padding: "2px 6px",
                  borderRadius: 4
                }}>
                  {m.streakDays} day streak
                </span>
              </div>
              <div style={{ 
                color: "#333",
                lineHeight: 1.5
              }}>
                {m.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a supportive message..."
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      )}
    </div>
  );
}
