RevenueCat Cloud Functions

Overview

This directory contains Firebase Cloud Functions for handling RevenueCat webhooks and purchaser info syncing. For the complete end-to-end setup guide (RevenueCat project, App Store Connect, Play Console), see `../REVENUECAT_SETUP.md`.

Setup

- Install deps inside `functions/`:

```bash
cd functions
npm install
```

- Set RevenueCat keys in Firebase Functions config (do not commit secrets):

```bash
firebase functions:config:set revenuecat.api_key="<REVENUECAT_API_KEY>" revenuecat.webhook_secret="<WEBHOOK_SECRET>"
```

Get these values from RevenueCat dashboard:
- **API Key**: Project Settings > API Tokens
- **Webhook Secret**: Project Settings > API Tokens (HMAC signing key)

- Deploy functions:

```bash
cd functions
npm run build
firebase deploy --only functions
```

Endpoints

- `POST /revenuecat/webhook` — RevenueCat webhook receiver (verifies HMAC and writes to `users/{appUserId}.subscription`).
- `POST /revenuecat/sync/:appUserId` — Manual sync/pull of purchaser info from RevenueCat to Firestore.

Webhook Security

The webhook handler verifies incoming requests using HMAC-SHA256:
- Expects header: `X-RevenueCat-Signature` (or similar; check RevenueCat docs for exact header name)
- Computes HMAC of raw request body using `webhook_secret`
- Only processes the request if signatures match

The signature header name may vary depending on RevenueCat API version. If verification fails:
1. Check CloudFunctions logs: `firebase functions:log --only revenuecat`
2. Confirm the webhook secret in Cloud Functions config matches RevenueCat dashboard
3. Verify the header name in RevenueCat documentation

Data Flow

1. User purchases on iOS/Android via RevenueCat SDK
2. RevenueCat verifies receipt and processes the purchase
3. RevenueCat sends webhook to `POST /webhook` (HMAC signed)
4. Cloud Function verifies signature and parses purchaser info
5. Parser (`parsePurchaserInfo.ts`) maps subscriber data to canonical `Subscription` shape
6. Cloud Function writes compact `subscription` object to Firestore: `users/{uid}.subscription`
7. `UserContext` (client) listens to Firestore user doc and exposes `profile.subscription`
8. Client gates premium features based on `profile.subscription.entitlements`

Canonical Subscription Schema

The Cloud Function writes a compact object to `users/{uid}.subscription`:

```json
{
  "provider": "revenuecat",
  "productIds": ["com.app.pro.monthly"],
  "entitlements": {
    "pro": {
      "identifier": "pro",
      "isActive": true,
      "expiresAt": 1735689600000,
      "startsAt": 1733097600000,
      "productIdentifier": "com.app.pro.monthly"
    }
  },
  "lastUpdatedAt": 1733097699123,
  "raw": { ... }
}
```

Testing

Run unit tests (parser function):

```bash
cd functions
npm test
```

For integration testing with Firebase emulator:

```bash
firebase emulators:start --only functions,firestore
```

Then manually POST a test webhook (or use RevenueCat test event):

```bash
curl -X POST http://localhost:5001/<PROJECT>/us-central1/revenuecat/webhook \
  -H "Content-Type: application/json" \
  -H "X-RevenueCat-Signature: <COMPUTED_HMAC>" \
  -d '{"subscriber": {...}}'
```

Deployment

See `../REVENUECAT_SETUP.md` for the complete deployment checklist. Quick steps:

1. Configure secrets:
   ```bash
   firebase functions:config:set revenuecat.api_key="..." revenuecat.webhook_secret="..."
   ```

2. Deploy:
   ```bash
   npm run build
   firebase deploy --only functions
   ```

3. Configure webhook in RevenueCat dashboard with the deployed URL.

4. Test webhook delivery and verify Firestore updates.

Notes

- The parser is a pure function (easy to unit test and reason about).
- Firestore is the canonical entitlement store; use `users/{uid}.subscription` as the authoritative source for client-side gating.
- For immediate UI feedback, clients can optionally use RevenueCat client SDK; the server webhooks ensure long-term consistency.
- Consider adding a reconciliation job (Cloud Task or Pub/Sub) to periodically sync all users' purchaser info if webhook delivery is unreliable.
