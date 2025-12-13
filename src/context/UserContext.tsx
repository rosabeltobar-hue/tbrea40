// src/context/UserContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { listenToAuthChanges } from "../services/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import type { User as AppUser, Subscription } from "../types";

interface IUserContext {
  authUser: FirebaseUser | null;
  profile: AppUser | null;
  // Backward compatibility: `user` refers to the Firebase auth user
  user: FirebaseUser | null;
}

const UserContext = createContext<IUserContext>({ authUser: null, profile: null, user: null });

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubAuth = listenToAuthChanges((u: FirebaseUser | null) => {
      setAuthUser(u);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    const ref = doc(db, "users", authUser.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setProfile(null);
        return;
      }
      setProfile(snap.data() as AppUser);
    });
    return () => unsub();
  }, [authUser]);

  const value: IUserContext = { authUser, profile, user: authUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};