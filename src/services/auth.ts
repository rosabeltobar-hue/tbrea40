// src/services/auth.ts
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth";

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

// listenToAuthChanges registers an observer and calls `setUser` whenever
// the Firebase auth state changes. Returns the unsubscribe function.
export const listenToAuthChanges = (
  setUser: (user: FirebaseUser | null) => void
) => {
  const unsub = onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
  return unsub;
};
