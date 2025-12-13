import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { fetchPurchaserInfo } from "./revenuecat";
import { initiateStripeCheckout, recordDonation, handleStripeWebhook } from "./donations";
import { sendNotification, dailyCheckinReminder, dailyQuoteReminder } from "./notifications";

admin.initializeApp();
const db = admin.firestore();

const app = express();

// We need raw body for signature verification. Configure a raw body parser
app.use(
  express.raw({ type: "application/json" })
);

// Simple health check
app.get("/", (_req, res) => res.send("RevenueCat webhook endpoint"));

// RevenueCat webhook receiver
app.post("/webhook", async (req, res) => {
  try {
    const webhookSecret = functions.config().revenuecat?.webhook_secret;
    if (!webhookSecret) {
      console.error("RevenueCat webhook secret not configured");
      return res.status(500).send("webhook not configured");
    }

    const signature = req.header("X-RevenueCat-Signature") || req.header("x-revenuecat-signature");
    if (!signature) return res.status(400).send("missing signature");

    const computed = crypto.createHmac("sha256", webhookSecret).update(req.body).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature))) {
      console.error("invalid signature");
      return res.status(401).send("invalid signature");
    }

    const payload = JSON.parse(req.body.toString("utf8"));
    // RevenueCat webhook object varies by event type. Look for `app_user_id` and subscriber info.
    const appUserId = payload?.subscriber?.original_app_user_id || payload?.app_user_id || payload?.subscriber?.app_user_id;
    if (!appUserId) {
      console.warn("webhook without app user id", payload);
      return res.status(400).send("no app user id");
    }

    // For simplicity, store the raw payload and basic status
    const userRef = db.collection("users").doc(appUserId);
    const now = Date.now();
    await userRef.set(
      {
        subscription: {
          provider: "revenuecat",
          raw: payload,
          lastUpdatedAt: now,
        },
      },
      { merge: true }
    );

    // Optionally fetch full purchaser info and write entitlements.
    const rcApiKey = functions.config().revenuecat?.api_key;
    if (rcApiKey) {
      try {
        const info: any = await fetchPurchaserInfo(rcApiKey, appUserId);
        // Map purchaser info to our canonical subscription shape and persist atomically
        try {
          const { mapRevenueCatSubscriber } = await import("./parsePurchaserInfo");
          const sub = mapRevenueCatSubscriber(info.subscriber || info);
          await userRef.set({ subscription: sub }, { merge: true });
        } catch (err) {
          // fallback to writing raw payload if mapping fails
          console.error("mapping purchaser info failed", err);
          await userRef.set(
            {
              subscription: {
                provider: "revenuecat",
                raw: info,
                lastUpdatedAt: Date.now(),
              },
            },
            { merge: true }
          );
        }
      } catch (err) {
        console.error("failed fetching purchaser info", err);
      }
    }

    return res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    return res.status(500).send("error");
  }
});

// Minimal endpoint to force-sync a user's purchaser info from RevenueCat
app.post("/sync/:appUserId", async (req, res) => {
  try {
    const rcApiKey = functions.config().revenuecat?.api_key;
    if (!rcApiKey) return res.status(500).send("revenuecat api key not configured");
    const { appUserId } = req.params;
    const info: any = await fetchPurchaserInfo(rcApiKey, appUserId);
    const userRef = db.collection("users").doc(appUserId);
    try {
      const { mapRevenueCatSubscriber } = await import("./parsePurchaserInfo");
      const sub = mapRevenueCatSubscriber(info.subscriber || info);
      await userRef.set({ subscription: sub }, { merge: true });
    } catch (err) {
      console.error("mapping purchaser info failed", err);
      await userRef.set(
        {
          subscription: {
            provider: "revenuecat",
            raw: info,
            lastUpdatedAt: Date.now(),
          },
        },
        { merge: true }
      );
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

exports.revenuecat = functions.https.onRequest(app);

// Donations endpoints
const donationsApp = express();
donationsApp.use(cors({ origin: true }));
donationsApp.use(express.json());

// Create Stripe checkout session
donationsApp.post("/initiate", initiateStripeCheckout);

// Record a donation
donationsApp.post("/record", recordDonation);

// Stripe webhook (requires raw body)
donationsApp.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

exports.donations = functions.https.onRequest(donationsApp);

// Notifications endpoints
const notificationsApp = express();
notificationsApp.use(cors({ origin: true }));
notificationsApp.use(express.json());

// Send a notification to a user
notificationsApp.post("/send", sendNotification);

exports.notifications = functions.https.onRequest(notificationsApp);

// Scheduled functions
exports.dailyCheckinReminder = dailyCheckinReminder;
exports.dailyQuoteReminder = dailyQuoteReminder;
