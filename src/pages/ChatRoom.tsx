// src/pages/ChatRoom.tsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { sendChatMessage, subscribeToChatMessages } from "../services/chat";
import { ChatMessage } from "../types";
import Avatar from "../components/Avatar";

export default function ChatRoom() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsub = subscribeToChatMessages(setMessages);
    return () => unsub();
  }, []);

  const handleSend = async () => {
    if (!user || !text.trim()) return;

    await sendChatMessage(
      user.uid,
      "hero", // later: real avatar
      text.trim(),
      5, // example streak
      false,
      [],
      0 // example coins
    );
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
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
              alignItems: "center",
              marginBottom: 8
            }}
          >
            <Avatar
              avatarType={m.avatarType}
              relapse={m.relapse}
              streakDays={m.streakDays}
              medals={m.medals || []}
              coins={m.coins || 0}
            />
            <div style={{ marginLeft: 8 }}>
              <div style={{ fontSize: 12, color: "#666" }}>
                Streak: {m.streakDays} days
              </div>
              <div>{m.message}</div>
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
