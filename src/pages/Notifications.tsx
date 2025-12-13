import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import {
  updateNotificationPreferences,
  getNotificationPreferences,
  disableAllNotifications,
  enableRecommendedNotifications,
  requestNotificationPermissions,
} from "../services/notifications";
import type { NotificationPreferences } from "../types";

export default function Notifications() {
  const { user } = useUser();
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    chatMention: true,
    dailyCheckin: true,
    quoteOfDay: true,
    promotional: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const saved = await getNotificationPreferences(user.uid);
        if (!mounted) return;
        if (saved) {
          setPrefs(saved);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      setMessage("Please sign in to update notifications.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const success = await updateNotificationPreferences(user.uid, prefs);
      if (success) {
        setMessage("✓ Notification preferences saved.");
      } else {
        setMessage("Failed to save preferences.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to save preferences.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnableRecommended = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await enableRecommendedNotifications(user.uid);
      setPrefs({
        chatMention: true,
        dailyCheckin: true,
        quoteOfDay: true,
        promotional: false,
      });
      setMessage("✓ Recommended notifications enabled.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to enable notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableAll = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await disableAllNotifications(user.uid);
      setPrefs({
        chatMention: false,
        dailyCheckin: false,
        quoteOfDay: false,
        promotional: false,
      });
      setMessage("✓ All notifications disabled.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to disable notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPermissions = async () => {
    setLoading(true);
    try {
      const granted = await requestNotificationPermissions();
      if (granted) {
        setMessage("✓ Notification permissions granted.");
      } else {
        setMessage("Notification permissions required to receive notifications.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to request permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>🔔 Notification Preferences</h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
        All notifications are optional. Control exactly what you want to receive.
      </p>

      {/* Quick Actions */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: 8, 
        marginBottom: 20 
      }}>
        <button
          onClick={handleEnableRecommended}
          disabled={loading}
          style={{
            padding: "10px 12px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          ✓ Recommended
        </button>
        <button
          onClick={handleDisableAll}
          disabled={loading}
          style={{
            padding: "10px 12px",
            background: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          ✗ Disable All
        </button>
      </div>

      {/* Individual Preferences */}
      <div style={{ 
        background: "#f9f9f9", 
        padding: 16, 
        borderRadius: 8, 
        marginBottom: 16 
      }}>
        <h3 style={{ marginTop: 0, fontSize: 14, color: "#333" }}>
          Individual Settings
        </h3>

        <label style={{ display: "block", marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={!!prefs.chatMention}
            onChange={(e) => setPrefs({ ...prefs, chatMention: e.target.checked })}
            disabled={loading}
          />{' '}
          <strong>Chat mentions</strong>
          <p style={{ margin: "4px 0 0 24px", fontSize: 12, color: "#666" }}>
            Notified when someone mentions you in community chat
          </p>
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={!!prefs.dailyCheckin}
            onChange={(e) => setPrefs({ ...prefs, dailyCheckin: e.target.checked })}
            disabled={loading}
          />{' '}
          <strong>Daily check-in reminder</strong>
          <p style={{ margin: "4px 0 0 24px", fontSize: 12, color: "#666" }}>
            Daily reminder to log your mood and symptoms
          </p>
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={!!prefs.quoteOfDay}
            onChange={(e) => setPrefs({ ...prefs, quoteOfDay: e.target.checked })}
            disabled={loading}
          />{' '}
          <strong>Daily motivational quotes</strong>
          <p style={{ margin: "4px 0 0 24px", fontSize: 12, color: "#666" }}>
            Receive daily inspiration messages
          </p>
        </label>

        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={!!prefs.promotional}
            onChange={(e) => setPrefs({ ...prefs, promotional: e.target.checked })}
            disabled={loading}
          />{' '}
          <strong>Promotional messages</strong>
          <p style={{ margin: "4px 0 0 24px", fontSize: 12, color: "#666" }}>
            App updates, new features, donation appeals
          </p>
        </label>
      </div>

      {/* Request Permissions & Save */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={handleRequestPermissions}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            marginBottom: 8,
            opacity: loading ? 0.6 : 1,
          }}
        >
          Enable Device Notifications
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div
          style={{
            background: message.includes("✓") ? "#e8f5e9" : "#ffebee",
            color: message.includes("✓") ? "#2e7d32" : "#c62828",
            padding: 12,
            borderRadius: 4,
            textAlign: "center",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {message}
        </div>
      )}

      {/* Info Box */}
      <div style={{ 
        background: "#e3f2fd", 
        padding: 12, 
        borderRadius: 4, 
        fontSize: 12, 
        color: "#1565c0",
        lineHeight: 1.6 
      }}>
        <strong>ℹ️ How notifications work:</strong>
        <ul style={{ margin: "8px 0 0 16px", paddingLeft: 0 }}>
          <li>Device permissions allow us to send push notifications</li>
          <li>Your preferences control which types you receive</li>
          <li>You can change settings anytime</li>
          <li>Disable all notifications if you prefer not to receive any</li>
        </ul>
      </div>
    </div>
  );
}
