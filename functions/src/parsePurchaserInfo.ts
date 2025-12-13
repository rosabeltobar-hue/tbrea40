import type { Subscription, SubscriptionEntitlement } from '../../src/types';

/**
 * Map RevenueCat purchaser info (subscriber object) to our canonical Subscription shape.
 * This is a pure function and easy to unit test.
 */
export function mapRevenueCatSubscriber(subscriber: any): Subscription {
  const entitlements: Record<string, SubscriptionEntitlement> = {};
  const productIds = new Set<string>();

  const rawEnt = subscriber?.entitlements || subscriber?.entitlements || {};
  for (const [key, val] of Object.entries(rawEnt || {})) {
    // val usually contains: "grace_period_expires_date", "expires_date", "product_identifier", "purchase_date"
    const v: any = val;
    const expiresAt = v.expires_date ? Date.parse(v.expires_date) : undefined;
    const startsAt = v.purchase_date ? Date.parse(v.purchase_date) : undefined;
    const productIdentifier = v.product_identifier || v.productId || undefined;
    if (productIdentifier) productIds.add(productIdentifier);
    const isActive = Boolean(v.expires_date ? Date.parse(v.expires_date) > Date.now() : v.is_active ?? true);
    entitlements[key] = {
      identifier: key,
      expiresAt,
      startsAt,
      productIdentifier,
      isActive,
    };
  }

  // Also extract product ids from subscriber.subscriptions if present
  const subs = subscriber?.subscriptions || {};
  for (const [prodId, s] of Object.entries(subs || {})) {
    productIds.add(prodId);
  }

  const subscription: Subscription = {
    provider: 'revenuecat',
    productIds: Array.from(productIds),
    entitlements,
    raw: subscriber,
    lastUpdatedAt: Date.now(),
  };

  return subscription;
}
