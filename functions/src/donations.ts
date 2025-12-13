// functions/src/donations.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

const db = admin.firestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16"
});

interface DonationRequest {
  type: "stripe" | "revenuecat";
  userId: string;
  amount: number;
  tierName: string;
  productId?: string;
  stripePrice?: string;
}

/**
 * Create a Stripe Checkout session for donations
 */
export const initiateStripeCheckout = async (
  req: functions.https.Request,
  res: functions.Response
) => {
  try {
    const { userId, amount, tierName, stripePrice } = req.body as DonationRequest;

    if (!userId || !amount || !stripePrice) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Get user email from Firestore or Firebase Auth
    const userDoc = await db.collection("users").doc(userId).get();
    let userEmail = userDoc.data()?.email;
    
    // Fallback to Firebase Auth if email not in Firestore
    if (!userEmail) {
      try {
        const authUser = await admin.auth().getUser(userId);
        userEmail = authUser.email;
      } catch (err) {
        console.error("Could not get user email:", err);
      }
    }

    if (!userEmail) {
      res.status(400).json({ error: "User email not found" });
      return;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePrice,
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/donations?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/donations?canceled=true`,
      metadata: {
        userId,
        tierName,
        type: "donation"
      }
    });

    res.json({
      success: true,
      sessionUrl: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

/**
 * Record a donation in Firestore
 */
export const recordDonation = async (
  req: functions.https.Request,
  res: functions.Response
) => {
  try {
    const { userId, amount, type, transactionId, timestamp } = req.body;

    if (!userId || !amount || !type) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Create donation record
    const donationRef = db.collection("donations").doc();
    await donationRef.set({
      userId,
      amount,
      type,
      transactionId,
      timestamp: timestamp ? new Date(timestamp) : admin.firestore.FieldValue.serverTimestamp(),
      status: "completed",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user stats
    await db.collection("users").doc(userId).update({
      totalDonated: admin.firestore.FieldValue.increment(amount),
      donationCount: admin.firestore.FieldValue.increment(1),
      lastDonationDate: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      donationId: donationRef.id
    });
  } catch (error) {
    console.error("Error recording donation:", error);
    res.status(500).json({ error: "Failed to record donation" });
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleStripeWebhook = async (
  req: functions.https.Request,
  res: functions.Response
) => {
  const sig = req.headers["stripe-signature"];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (metadata?.userId && metadata?.type === "donation") {
        // Record the donation
        await recordDonation(
          {
            body: {
              userId: metadata.userId,
              amount: (session.amount_total || 0) / 100, // Convert from cents
              type: "stripe",
              transactionId: session.id,
              timestamp: new Date().toISOString()
            }
          } as functions.https.Request,
          res
        );
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: "Webhook processing failed" });
  }
};
