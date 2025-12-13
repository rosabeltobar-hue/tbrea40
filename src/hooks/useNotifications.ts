// src/hooks/useNotifications.ts

import { useEffect } from "react";
import { setupNotificationListeners, getFCMToken } from "../services/notifications";

/**
 * Hook to initialize Firebase Cloud Messaging for the user.
 * Call this once per user session (e.g., in App.tsx after auth).
 */
export const useNotifications = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return;

    // Setup listeners for incoming notifications
    setupNotificationListeners(userId);

    // Get and store FCM token
    (async () => {
      try {
        const token = await getFCMToken();
        if (token) {
          console.log("FCM token obtained:", token);
          // Token is stored in user doc by getFCMToken
        }
      } catch (error) {
        console.error("Failed to get FCM token:", error);
      }
    })();
  }, [userId]);
};
