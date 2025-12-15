// src/services/chat.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  limit
} from "firebase/firestore";
import { ChatMessage } from "../types";
import { queueOfflineChange, checkNetworkStatus } from "./offline";

const COLLECTION = "chatMessages";
const MAX_MESSAGES = 300;

// Clean up old messages if over limit
export const cleanupOldMessages = async () => {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.size > MAX_MESSAGES) {
      const messagesToDelete = snapshot.size - MAX_MESSAGES;
      const oldestMessages = snapshot.docs.slice(-messagesToDelete);
      
      console.log(`Cleaning up ${messagesToDelete} old messages...`);
      
      const deletePromises = oldestMessages.map(messageDoc => 
        deleteDoc(doc(db, COLLECTION, messageDoc.id))
      );
      
      await Promise.all(deletePromises);
      console.log(`✅ Cleaned up ${messagesToDelete} old messages`);
    }
  } catch (error) {
    console.error("Error cleaning up old messages:", error);
  }
};

export const sendChatMessage = async (
  userId: string,
  chatDisplayName: string,
  chatAvatar: string,
  avatarType: string,
  text: string,
  streakDays: number,
  relapse: boolean,
  medals: string[],
  coins: number = 0,
  chatAvatarCustom?: string
) => {
  const data: Omit<ChatMessage, "id" | "createdAt"> & { createdAt: any } = {
    userId,
    chatDisplayName,
    chatAvatar,
    chatAvatarCustom,
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
    
    // Cleanup old messages if over limit (fire and forget)
    cleanupOldMessages().catch(err => 
      console.warn("Cleanup failed:", err)
    );
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
        chatAvatarCustom: data.chatAvatarCustom,
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
