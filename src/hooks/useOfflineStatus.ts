// src/hooks/useOfflineStatus.ts

import { useEffect, useState } from "react";
import { setupOfflineListener, checkNetworkStatus } from "../services/offline";

/**
 * Hook to track and respond to online/offline status
 */
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(() => checkNetworkStatus());

  useEffect(() => {
    const unsubscribe = setupOfflineListener((status) => {
      setIsOnline(status);
    });

    return unsubscribe;
  }, []);

  return isOnline;
};
