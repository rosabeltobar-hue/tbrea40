import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { initiateDonation } from "../services/donations";

export default function Donations() {
  const { user, profile } = useUser();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if running on mobile
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
  }, []);

  const donationTiers = [
    {
      id: "donation_coffee",
      name: "Buy me a coffee ☕",
      amount: 5,
      description: "Support development with a small gift",
      stripePrice: "price_coffee_5",
      revenuecat: "com.tbreak.donation.coffee"
    },
    {
      id: "donation_meal",
      name: "Buy me a meal 🍽️",
      amount: 15,
      description: "Help keep the lights on",
      stripePrice: "price_meal_15",
      revenuecat: "com.tbreak.donation.meal"
    },
    {
      id: "donation_month",
      name: "Monthly supporter 💪",
      amount: 25,
      description: "Recurring monthly support",
      stripePrice: "price_month_25",
      revenuecat: "com.tbreak.donation.month"
    },
    {
      id: "donation_hero",
      name: "Be a hero 🦸",
      amount: 50,
      description: "Major contributor to the mission",
      stripePrice: "price_hero_50",
      revenuecat: "com.tbreak.donation.hero"
    }
  ];

  const handleDonate = async (tier: (typeof donationTiers)[0] | null) => {
    if (!user) {
      setMessage("Please sign in to make a donation.");
      return;
    }

    const amount = tier ? tier.amount : parseFloat(customAmount);
    if (!amount || amount <= 0) {
      setMessage("Please select a tier or enter a valid amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Route to appropriate payment method based on platform
      if (isMobile && tier?.revenuecat) {
        // Use RevenueCat for mobile in-app purchases
        await handleRevenueCatDonation(tier);
      } else {
        // Use Stripe for web donations
        await handleStripeDonation(tier || { ...donationTiers[0], amount, id: "custom" });
      }
    } catch (err) {
      console.error("Donation error:", err);
      setMessage(`Error processing donation: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRevenueCatDonation = async (tier: (typeof donationTiers)[0]) => {
    // Call Cloud Function to initiate RevenueCat donation
    const result = await initiateDonation({
      type: "revenuecat",
      userId: user!.uid,
      productId: tier.revenuecat,
      amount: tier.amount,
      tierName: tier.name
    });

    if (result.success) {
      setMessage(`Thank you! Your donation of $${tier.amount} is being processed. 🙏`);
      setSelectedTier(null);
    } else {
      setMessage("RevenueCat donation failed. Please try again.");
    }
  };

  const handleStripeDonation = async (tier: (typeof donationTiers)[0]) => {
    // Call Cloud Function to create Stripe checkout session
    const result = await initiateDonation({
      type: "stripe",
      userId: user!.uid,
      amount: tier.amount,
      tierName: tier.name,
      stripePrice: tier.stripePrice
    });

    if (result.sessionUrl) {
      // Redirect to Stripe Checkout
      window.location.href = result.sessionUrl;
    } else {
      setMessage("Failed to initiate donation. Please try again.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Support Us 💚</h1>

      <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          <strong>Why donate?</strong> This app is built with care to help you succeed on your T-break. 
          Donations help us:
        </p>
        <ul style={{ marginTop: 8, marginBottom: 0 }}>
          <li>Keep servers running 24/7</li>
          <li>Develop new features (meditation guides, community challenges, etc.)</li>
          <li>Improve the app based on your feedback</li>
          <li>Stay ad-free and completely private</li>
        </ul>
      </div>

      <h2>Choose Your Support Level</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {donationTiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => {
              setSelectedTier(tier.id);
              setCustomAmount("");
              handleDonate(tier);
            }}
            disabled={loading}
            style={{
              padding: 16,
              border: selectedTier === tier.id ? "2px solid #2e7d32" : "1px solid #ddd",
              borderRadius: 8,
              background: selectedTier === tier.id ? "#e8f5e9" : "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              textAlign: "center",
              transition: "all 0.2s",
              opacity: loading ? 0.6 : 1
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              {tier.name}
            </div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
              {tier.description}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#2e7d32" }}>
              ${tier.amount}
            </div>
          </button>
        ))}
      </div>

      <h2>Custom Amount</h2>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>$</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedTier(null);
            }}
            placeholder="Enter custom amount"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 16,
              opacity: loading ? 0.6 : 1
            }}
          />
          <button
            onClick={() => handleDonate(null)}
            disabled={loading}
            style={{
              padding: "10px 16px",
              background: loading ? "#ccc" : "#2e7d32",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600
            }}
          >
            {loading ? "Processing..." : "Donate"}
          </button>
        </div>
      </div>

      {message && (
        <div
          style={{
            background: message.includes("Error") ? "#ffebee" : "#e8f5e9",
            color: message.includes("Error") ? "#c62828" : "#2e7d32",
            padding: 12,
            borderRadius: 4,
            marginBottom: 24,
            textAlign: "center",
            fontSize: 14
          }}
        >
          {message}
        </div>
      )}

      <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 8, marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>About Donations</h3>
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: "#555" }}>
          <li>
            <strong>Privacy First:</strong> We never share your donation info with third parties.
          </li>
          <li>
            <strong>Transparent:</strong> 100% of donations go toward app development and operations.
          </li>
          <li>
            <strong>Secure:</strong> Payments processed by {isMobile ? "RevenueCat" : "Stripe"}, industry-leading providers.
          </li>
          <li>
            <strong>100% Optional:</strong> The app works fully without donations. This is purely optional support.
          </li>
        </ul>
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "#fff3e0", borderRadius: 8, textAlign: "center" }}>
        <p style={{ margin: 0, color: "#e65100" }}>
          <strong>Thank you for believing in this mission! 🙏</strong>
        </p>
        <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "#666" }}>
          Every donation brings us closer to building the best T-break companion app.
        </p>
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: "#999", textAlign: "center" }}>
        <p style={{ margin: 0 }}>
          Questions? Email us at support@tbreak.app or visit our community chat.
        </p>
      </div>
    </div>
  );
}
