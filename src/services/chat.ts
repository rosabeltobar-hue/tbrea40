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
import { queueOfflineChange, checkNetworkStatus } from "./offline";

const COLLECTION = "chatMessages";

export const sendChatMessage = async (
  userId: string,
  chatDisplayName: string,
  chatAvatar: string,
  avatarType: string,
  text: string,
  streakDays: number,
  relapse: boolean,
  medals: string[],
  coins: number = 0
) => {
  const data: Omit<ChatMessage, "id" | "createdAt"> & { createdAt: any } = {
    userId,
    chatDisplayName,
    chatAvatar,
    avatarType,
    message: text,
    streakDays,
    relapse,
    medals,
    coins,
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, COLLECTION), data);
  } catch (error) {
    // If offline, queue the message for sending later
    if (!checkNetworkStatus()) {
      console.log("Offline: Queuing chat message for sync");
      await queueOfflineChange(
        `/chatMessages`,
        "POST",
        {
          ...data,
          createdAt: Date.now() // Use current timestamp for offline messages
        }
      );
      return { success: true, queued: true };
    }
    throw error;
  }
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
        chatDisplayName: data.chatDisplayName || "Anonymous",
        chatAvatar: data.chatAvatar || "smile",
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
