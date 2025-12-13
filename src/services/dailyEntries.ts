// src/services/dailyEntries.ts
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { DailyEntry } from "../types";
import { coinReward, medalReward } from "../utils/rewards";
import { updateUserRewards } from "./user";
import {
  saveDailyEntryOffline,
  getDailyEntriesOffline,
  queueOfflineChange,
  checkNetworkStatus,
} from "./offline";

const COLLECTION = "dailyEntries";

export const saveDailyEntry = async (entry: DailyEntry) => {
  try {
    const ref = doc(db, COLLECTION, entry.id);
    await setDoc(ref, entry, { merge: true });
    // award rewards for the day (coins, and optional medal)
    try {
      const coins = coinReward(entry.dayNumber);
      await updateUserRewards(entry.userId, {
        coins,
        medal: medalReward(entry.dayNumber)
      });
    } catch (err) {
      // log but don't fail the save
      console.warn("Failed to update user rewards:", err);
    }
  } catch (error) {
    // If offline, save locally and queue for sync
    if (!checkNetworkStatus()) {
      console.log("Offline: Queuing daily entry for sync");
      await saveDailyEntryOffline(entry);
      await queueOfflineChange(
        `/dailyEntries/${entry.id}`,
        "PUT",
        entry
      );
      return { success: true, queued: true };
    }
    throw error;
  }
};

export const getDailyEntry = async (
  userId: string,
  dayNumber: number
): Promise<DailyEntry | null> => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      where("dayNumber", "==", dayNumber)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as DailyEntry;
  } catch (error) {
    // If offline, try to get from local cache
    if (!checkNetworkStatus()) {
      console.log("Offline: Fetching daily entry from local cache");
      const entries = await getDailyEntriesOffline(userId);
      return entries.find((e) => e.dayNumber === dayNumber) || null;
    }
    throw error;
  }
};

export const getEntriesForMonth = async (
  userId: string,
  year: number,
  month: number
): Promise<DailyEntry[]> => {
  // month: 0-11
  const start = new Date(year, month, 1).toISOString();
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    where("date", ">=", start),
    where("date", "<=", end)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DailyEntry);
};
