// src/services/firestore.ts
// Small Firestore helper functions. These are minimal wrappers meant
// to be replaced/extended as real backend shapes are known.
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../types";

export const createUserDoc = async (id: string, data: Partial<User>) => {
  const ref = doc(db, "users", id);
  await setDoc(ref, data, { merge: true });
};

export const getUserDoc = async (id: string) => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as User) : null;
};
