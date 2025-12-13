// src/services/notifications.ts

import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { getUser, createUser } from "./user";
import type { NotificationPreferences } from "../types";

/**
 * Notifications service handles FCM setup and user preferences.
 * All notifications are optional — users can disable them entirely.
 */

/**
 * Request notification permissions from the user.
 * Returns true if user granted permission, false otherwise.
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const result = await FirebaseMessaging.requestPermissions();
    console.log("Notification permission result:", result);
    return result.receive === "granted" || result.receive === "denied";
  } catch (error) {
    console.error("Failed to request notification permissions:", error);
    return false;
  }
};

/**
 * Get the device FCM token for sending notifications.
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const result = await FirebaseMessaging.getToken();
    if (result?.token) {
      console.log("FCM token:", result.token);
      return result.token;
    }
  } catch (error) {
    console.error("Failed to get FCM token:", error);
  }
  return null;
};

/**
 * Setup Firebase Cloud Messaging listeners.
 * Respects user notification preferences before displaying.
 */
export const setupNotificationListeners = (userId: string) => {
  // Listen for foreground notifications (when app is open)
  FirebaseMessaging.addListener("notificationReceived", async (event) => {
    console.log("Foreground notification received:", event);

    // Show notification or handle in-app display
    const title = event.notification?.title || "T-Break";
    const body = event.notification?.body || "You have a new message";
    
    // For now, check preferences based on title keywords
    let shouldNotify = true;
    if (title.toLowerCase().includes("mention") || title.toLowerCase().includes("chat")) {
      shouldNotify = await shouldShowNotification(userId, "chat_mention");
    } else if (title.toLowerCase().includes("check-in")) {
      shouldNotify = await shouldShowNotification(userId, "daily_checkin");
    } else if (title.toLowerCase().includes("quote") || title.toLowerCase().includes("inspiration")) {
      shouldNotify = await shouldShowNotification(userId, "quote_of_day");
    } else if (title.toLowerCase().includes("promotional") || title.toLowerCase().includes("update")) {
      shouldNotify = await shouldShowNotification(userId, "promotional");
    }

    if (!shouldNotify) {
      console.log("Notification disabled by user preferences");
      return;
    }

    displayNotificationBanner(title, body);
  });

  // Listen for token refresh
  FirebaseMessaging.addListener("tokenReceived", (event) => {
    console.log("FCM token refreshed:", event.token);
    // Update token in user document if needed
    storeFCMTokenForUser(userId, event.token);
  });
};

/**
 * Check if a notification should be shown based on user preferences.
 */
const shouldShowNotification = async (
  userId: string,
  notificationType?: string
): Promise<boolean> => {
  try {
    const userDoc = await getUser(userId);
    const prefs = (userDoc as any)?.notifications as NotificationPreferences | undefined;

    if (!prefs) {
      // Default: show notifications if preferences not set
      return true;
    }

    // Check notification type against user preferences
    switch (notificationType) {
      case "chat_mention":
        return prefs.chatMention !== false;
      case "daily_checkin":
        return prefs.dailyCheckin !== false;
      case "quote_of_day":
        return prefs.quoteOfDay !== false;
      case "promotional":
        return prefs.promotional === true; // off by default
      default:
        return true;
    }
  } catch (error) {
    console.error("Error checking notification preferences:", error);
    return true; // Show by default if error
  }
};

/**
 * Display a notification banner (in-app toast or similar).
 * Can be customized with your UI framework.
 */
const displayNotificationBanner = (title: string, body: string) => {
  // Option 1: Use browser's notification API (if on web)
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }

  // Option 2: Show in-app toast (implement based on your UI)
  // Example: dispatch to a global toast/alert state
  console.log(`[${title}] ${body}`);

  // You could also emit a custom event:
  window.dispatchEvent(
    new CustomEvent("app-notification", {
      detail: { title, body },
    })
  );
};

/**
 * Store FCM token in user document for server-side notification delivery.
 */
const storeFCMTokenForUser = async (userId: string, token: string) => {
  try {
    await createUser(userId, { fcmToken: token });
    console.log("FCM token stored for user:", userId);
  } catch (error) {
    console.error("Failed to store FCM token:", error);
  }
};

/**
 * Update user notification preferences.
 */
export const updateNotificationPreferences = async (
  userId: string,
  prefs: NotificationPreferences
): Promise<boolean> => {
  try {
    await createUser(userId, { notifications: prefs });
    console.log("Notification preferences updated:", prefs);
    return true;
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    return false;
  }
};

/**
 * Get current user notification preferences.
 */
export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences | null> => {
  try {
    const userDoc = await getUser(userId);
    return (userDoc as any)?.notifications || null;
  } catch (error) {
    console.error("Failed to get notification preferences:", error);
    return null;
  }
};

/**
 * Completely disable all notifications for a user.
 */
export const disableAllNotifications = async (userId: string): Promise<boolean> => {
  const allDisabled: NotificationPreferences = {
    chatMention: false,
    dailyCheckin: false,
    quoteOfDay: false,
    promotional: false,
  };
  return updateNotificationPreferences(userId, allDisabled);
};

/**
 * Enable recommended notifications (all except promotional).
 */
export const enableRecommendedNotifications = async (
  userId: string
): Promise<boolean> => {
  const recommended: NotificationPreferences = {
    chatMention: true,
    dailyCheckin: true,
    quoteOfDay: true,
    promotional: false, // off by default
  };
  return updateNotificationPreferences(userId, recommended);
};
