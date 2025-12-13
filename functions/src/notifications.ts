// functions/src/notifications.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();
const messaging = admin.messaging();

interface SendNotificationRequest {
  userId: string;
  title: string;
  body: string;
  type?: "chat_mention" | "daily_checkin" | "quote_of_day" | "promotional";
  data?: Record<string, string>;
}

/**
 * Send a notification to a user if they have enabled that notification type.
 */
export const sendNotification = async (
  req: functions.https.Request,
  res: functions.Response
) => {
  try {
    const { userId, title, body, type, data } = req.body as SendNotificationRequest;

    if (!userId || !title || !body) {
      res.status(400).json({ error: "Missing required fields: userId, title, body" });
      return;
    }

    // Get user document to check:
    // 1. FCM token (required to send)
    // 2. Notification preferences (should we send?)
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userData = userDoc.data();
    const fcmToken = userData?.fcmToken;
    const preferences = userData?.notifications || {};

    // Check if user disabled this notification type
    if (type) {
      const shouldSend = checkNotificationPreference(type, preferences);
      if (!shouldSend) {
        console.log(`Notification disabled for user ${userId}, type: ${type}`);
        res.json({ success: true, sent: false, reason: "User disabled this notification type" });
        return;
      }
    }

    if (!fcmToken) {
      res.status(400).json({ error: "User has no FCM token (notifications not enabled)" });
      return;
    }

    // Send notification via Firebase Cloud Messaging
    const message: admin.messaging.Message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: data || {},
      webpush: {
        fcmOptions: {
          link: "https://your-app.com", // Change to your app URL
        },
      },
    };

    const messageId = await messaging.send(message);
    console.log(`Notification sent to user ${userId}:`, messageId);

    res.json({ success: true, sent: true, messageId });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

/**
 * Check if user has enabled a specific notification type.
 */
function checkNotificationPreference(
  type: string,
  preferences: Record<string, any>
): boolean {
  switch (type) {
    case "chat_mention":
      return preferences.chatMention !== false;
    case "daily_checkin":
      return preferences.dailyCheckin !== false;
    case "quote_of_day":
      return preferences.quoteOfDay !== false;
    case "promotional":
      return preferences.promotional === true; // off by default
    default:
      return true;
  }
}

/**
 * Scheduled function: send daily check-in reminder at 9 AM user time.
 * (Note: Firestore doesn't have timezone support; consider storing user timezone)
 */
export const dailyCheckinReminder = functions.pubsub
  .schedule("every day 09:00")
  .timeZone("America/New_York") // Change to your target timezone
  .onRun(async (context) => {
    try {
      // Get all users with notifications enabled
      const usersSnapshot = await db
        .collection("users")
        .where("notifications.dailyCheckin", "==", true)
        .get();

      let sent = 0;
      for (const userDoc of usersSnapshot.docs) {
        const fcmToken = userDoc.data().fcmToken;
        if (!fcmToken) continue;

        try {
          const message: admin.messaging.Message = {
            token: fcmToken,
            notification: {
              title: "Daily Check-In",
              body: "How are you feeling today? Time for your check-in.",
            },
            data: {
              type: "daily_checkin",
              action: "open_checkin",
            },
          };

          await messaging.send(message);
          sent++;
        } catch (err) {
          console.error(`Failed to send to user ${userDoc.id}:`, err);
        }
      }

      console.log(`Daily check-in reminders sent to ${sent} users`);
      return null;
    } catch (error) {
      console.error("Error in dailyCheckinReminder:", error);
      throw error;
    }
  });

/**
 * Scheduled function: send motivational quote at 6 PM user time.
 */
export const dailyQuoteReminder = functions.pubsub
  .schedule("every day 18:00")
  .timeZone("America/New_York")
  .onRun(async (context) => {
    try {
      // Get all users with quote notifications enabled
      const usersSnapshot = await db
        .collection("users")
        .where("notifications.quoteOfDay", "==", true)
        .get();

      const quotes = [
        "Progress, not perfection. You're doing great.",
        "Every day sober is a day stronger.",
        "Your future self will thank you.",
        "You've got this. One day at a time.",
        "Strength is built by small consistent choices.",
      ];

      let sent = 0;
      for (const userDoc of usersSnapshot.docs) {
        const fcmToken = userDoc.data().fcmToken;
        if (!fcmToken) continue;

        try {
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
          const message: admin.messaging.Message = {
            token: fcmToken,
            notification: {
              title: "Daily Inspiration",
              body: randomQuote,
            },
            data: {
              type: "quote_of_day",
            },
          };

          await messaging.send(message);
          sent++;
        } catch (err) {
          console.error(`Failed to send to user ${userDoc.id}:`, err);
        }
      }

      console.log(`Daily quote reminders sent to ${sent} users`);
      return null;
    } catch (error) {
      console.error("Error in dailyQuoteReminder:", error);
      throw error;
    }
  });
