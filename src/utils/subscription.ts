// src/utils/subscription.ts
import type { Subscription, SubscriptionEntitlement } from "../types";

/**
 * Check if a subscription is active (at least one entitlement is active).
 */
export function isSubscriptionActive(subscription: Subscription | undefined | null): boolean {
  if (!subscription) return false;
  return Object.values(subscription.entitlements || {}).some((ent) => ent.isActive);
}

/**
 * Get all active entitlements from a subscription.
 */
export function getActiveEntitlements(
  subscription: Subscription | undefined | null
): SubscriptionEntitlement[] {
  if (!subscription) return [];
  return Object.values(subscription.entitlements || {}).filter((ent) => ent.isActive);
}

/**
 * Check if a user has a specific entitlement.
 */
export function hasEntitlement(
  subscription: Subscription | undefined | null,
  entitlementId: string
): boolean {
  if (!subscription) return false;
  const ent = subscription.entitlements?.[entitlementId];
  return ent ? ent.isActive : false;
}

/**
 * Get the earliest expiration date among active entitlements.
 */
export function getEarliestExpiration(
  subscription: Subscription | undefined | null
): number | null {
  const active = getActiveEntitlements(subscription);
  if (active.length === 0) return null;
  return Math.min(...active.map((e) => e.expiresAt || Infinity));
}

/**
 * Check if subscription will expire soon (within days).
 */
export function expiringWithinDays(
  subscription: Subscription | undefined | null,
  days: number
): boolean {
  const expiration = getEarliestExpiration(subscription);
  if (!expiration) return false;
  const nowPlus = Date.now() + days * 24 * 60 * 60 * 1000;
  return expiration <= nowPlus;
}
