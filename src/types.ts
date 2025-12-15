// ================= USERS ==================
export interface User {
  id: string;
  email?: string;
  createdAt: number;

  // Subscription info
  plan: "free" | "0.99" | "3" | "10";
  planExpiresAt?: number;

  // User demographics
  age?: number;
  weight?: number; // in kg
  yearsOfUse?: number;

  // Usage data
  usageType: "smoke" | "dab" | "vape" | "edible" | "other";
  frequency: "light" | "moderate" | "heavy" | "chronic";
  durationMonths: number;
  goal: "40day" | "quit";
  // Optional T-break start date in ISO format (e.g. "2025-12-07T00:00:00.000Z")
  startDate?: string;
  recommendedBreakDays?: number; // Calculated based on usage pattern

  // Gamification
  currentDay: number;
  relapseCount: number;
  streakDays: number;
  totalCoins: number;

  // Avatar display
  avatarType: string;
  avatarBorderColor: string;
  avatarMedals: string[];
  // Optional notification preferences stored on the user document
  notifications?: NotificationPreferences;
  // FCM token for sending push notifications to this device
  fcmToken?: string;
}


// ================= DAILY ENTRIES ==================

export interface DailyEntry {
  id: string;
  userId: string;
  dayNumber: number;
  date: string;

  morningMood?: string;
  noonMood?: string;
  nightMood?: string;

  usedToday?: boolean;
  cravingLevel?: number;
  // Number of days since the user last used (optional, used in UI forms)
  daysSinceLastUse?: number;
  /**
   * Estimated percent of metabolites cleared from the body (0-100).
   * - Unit: percent
   * - Range: 0 to 100
   * - Precision: one decimal place is acceptable (e.g. 72.5)
   */
  metaboliteClearPercent?: number;

  symptoms?: {
    anxiety: boolean;
    irritability: boolean;
    insomnia: boolean;
    headache: boolean;
    appetite: boolean;
    sweating: boolean;
  };

  journal?: string;
}

// ================= NOTIFICATIONS ==================
export interface NotificationPreferences {
  enabled?: boolean;
  dailyReminder?: boolean;
  milestones?: boolean;
  encouragement?: boolean;
  chatMention?: boolean;
  dailyCheckin?: boolean;
  quoteOfDay?: boolean;
  promotional?: boolean;
}


// ================= CHAT ==================

export interface ChatMessage {
  id: string;
  userId: string;
  avatarType: string;
  message: string;
  createdAt: number;
  streakDays: number;
  relapse: boolean;
  medals: string[];
  coins: number;
}

export interface EvaResponse {
  id: string;
  messageId: string;
  evaMessage: string;
  createdAt: number;
}


// ================= PURCHASE ==================

export interface Purchase {
  id: string;
  userId: string;
  amount: number;
  type: "subscription" | "donation";
  createdAt: number;
}

// ================= SUBSCRIPTIONS (RevenueCat friendly) ==================

export interface SubscriptionEntitlement {
  identifier: string;
  expiresAt?: number; // epoch ms
  startsAt?: number; // epoch ms
  productIdentifier?: string;
  isActive: boolean;
}

export interface Subscription {
  provider: "revenuecat" | "apple" | "google" | "manual";
  productIds: string[];
  entitlements: Record<string, SubscriptionEntitlement>;
  raw?: any;
  lastUpdatedAt?: number;
}
