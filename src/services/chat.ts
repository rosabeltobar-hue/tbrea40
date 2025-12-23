// src/services/chat.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { ChatMessage } from "../types";

const COLLECTION = "chatMessages";

export const sendChatMessage = async (
  userId: string,
  avatarType: string,
  text: string,
  streakDays: number,
  relapse: boolean,
  medals: string[],
  coins: number
) => {
  const data: Omit<ChatMessage, "id" | "createdAt"> & { createdAt: any } = {
    userId,
    avatarType,
    message: text,
    streakDays,
    relapse,
    medals,
    coins,
    createdAt: serverTimestamp()
  };

  await addDoc(collection(db, COLLECTION), data);
};

export const subscribeToChatMessages = (
  cb: (messages: ChatMessage[]) => void
) => {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const msgs: ChatMessage[] = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        userId: data.userId,
        avatarType: data.avatarType,
        message: data.message,
        streakDays: data.streakDays,
        relapse: data.relapse,
        medals: data.medals ?? [],
        coins: data.coins ?? 0,
        createdAt: data.createdAt?.toMillis?.() ?? Date.now()
      };
    });
    cb(msgs);
  });
};
