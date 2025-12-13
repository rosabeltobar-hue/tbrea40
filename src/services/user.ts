// src/services/user.ts
import { User, Subscription } from "../types";
import { db } from "../firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";

export const createUser = async (id: string, data: Partial<User>) => {
  const ref = doc(db, "users", id);
  await setDoc(ref, data, { merge: true });
};

export const getUser = async (id: string) => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as User) : null;
};

export const updateUserRewards = async (
  userId: string,
  reward: { coins: number; medal: string | null }
) => {
  const ref = doc(db, "users", userId);
  const userSnap = await getDoc(ref);
  if (!userSnap.exists()) return;

  const data: any = userSnap.data();
  const medals: string[] = data.rewards?.medals ? [...data.rewards.medals] : [];
  if (reward.medal) medals.push(reward.medal);

  await updateDoc(ref, {
    rewards: {
      coins: (data.rewards?.coins || 0) + reward.coins,
      medals
    }
  });
};

// Subscription helpers
export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data: any = snap.data();
  return data.subscription ? (data.subscription as Subscription) : null;
};

export const setUserSubscription = async (userId: string, subscription: Partial<Subscription>) => {
  const ref = doc(db, "users", userId);
  await setDoc(ref, { subscription }, { merge: true });
};

