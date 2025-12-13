import { expect } from 'chai';
import { mapRevenueCatSubscriber } from '../src/parsePurchaserInfo';

describe('mapRevenueCatSubscriber', () => {
  it('maps basic subscriber entitlements', () => {
    const now = new Date();
    const later = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const subscriber = {
      entitlements: {
        pro: {
          expires_date: later.toISOString(),
          purchase_date: now.toISOString(),
          product_identifier: 'com.app.pro.monthly'
        }
      },
      subscriptions: {
        'com.app.pro.monthly': {
          expires_date: later.toISOString(),
          purchase_date: now.toISOString()
        }
      }
    };

    const mapped = mapRevenueCatSubscriber(subscriber);
    expect(mapped.provider).to.equal('revenuecat');
    expect(mapped.productIds).to.include('com.app.pro.monthly');
    expect(mapped.entitlements).to.have.property('pro');
    const ent = mapped.entitlements['pro'];
    expect(ent.productIdentifier).to.equal('com.app.pro.monthly');
    expect(ent.isActive).to.equal(true);
    expect(ent.startsAt).to.be.a('number');
    expect(ent.expiresAt).to.be.a('number');
  });
});
