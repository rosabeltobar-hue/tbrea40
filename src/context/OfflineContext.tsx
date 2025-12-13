// src/context/OfflineContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { getPendingChanges } from "../services/offline";

interface OfflineContextType {
  isOnline: boolean;
  pendingChangesCount: number;
  isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [pendingChangesCount, setPendingChangesCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger background sync when coming back online
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          // Use any to access sync property (not yet in TypeScript definitions)
          const syncManager = (registration as any).sync;
          if (syncManager) {
            syncManager.register("sync-offline-data").catch((err: any) => {
              console.log("Background sync registration failed (may be unsupported):", err);
            });
          }
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update pending changes count
  useEffect(() => {
    const updatePendingCount = async () => {
      const pending = await getPendingChanges();
      setPendingChangesCount(pending.length);
    };

    updatePendingCount();

    // Listen for sync events from service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SYNC_COMPLETE") {
          updatePendingCount();
        } else if (event.data?.type === "SYNC_START") {
          setIsSyncing(true);
        } else if (event.data?.type === "SYNC_ERROR") {
          setIsSyncing(false);
        }
      });
    }

    // Periodically check pending changes
    const interval = setInterval(updatePendingCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <OfflineContext.Provider value={{ isOnline, pendingChangesCount, isSyncing }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOfflineContext = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOfflineContext must be used within OfflineProvider");
  }
  return context;
};

