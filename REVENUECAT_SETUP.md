# RevenueCat Setup Runbook

Complete end-to-end checklist for integrating RevenueCat with your app, App Store Connect, and Google Play Console.

## Prerequisites

- RevenueCat account (https://revenuecat.com)
- Apple Developer account (for App Store Connect)
- Google Play Developer account
- Firebase project with Cloud Functions deployed
- Mobile app (React Native or Capacitor) with `react-native-purchases` SDK integrated

## Part 1: RevenueCat Project Setup

### 1.1 Create RevenueCat Project

1. Sign into RevenueCat dashboard.
2. Click **"Create new project"** and name it (e.g., `T-Break App`).
3. Select your app platform (iOS, Android, or both).
4. Copy your **RevenueCat API Key** (you'll need this for Cloud Functions config).

### 1.2 Configure Apps in RevenueCat

1. In your RevenueCat project, go to **Apps** and create entries for:
   - iOS App
   - Android App (if applicable)

For each app:
- Enter your **Bundle ID** (iOS) or **Package Name** (Android).
- Link to your App Store Connect / Google Play account (see steps below).

### 1.3 Set Up Webhook Signing (Security)

1. Go to **Project Settings** > **API Tokens**.
2. Copy your **Webhook Secret** (HMAC signing key for verifying webhook payloads).
3. Store both **API Key** and **Webhook Secret** securely (do not commit to repo).

## Part 2: App Store Connect Setup (iOS)

### 2.1 Create App Store App

1. Log into **App Store Connect** (https://appstoreconnect.apple.com).
2. Click **"My Apps"** and create a new app.
3. Fill in:
   - **Platform**: iOS
   - **App Name**: Your app name
   - **Bundle ID**: Unique reverse-domain name (e.g., `com.yourdomain.tbreak`)
   - **SKU**: Unique identifier (e.g., `tbreak-001`)
   - **User Access**: Select roles

### 2.2 Create In-App Purchase Products (Subscriptions)

1. Go to your app in App Store Connect.
2. Click **"In-App Purchases"** in the left sidebar.
3. Click **"+"** to create a new subscription group (e.g., `Subscriptions`).

For each subscription tier (e.g., **Pro Monthly**):
1. Click **"+"** > **"Recurring In-App Purchase"**.
2. Fill in:
   - **Reference Name**: `Pro Monthly` (internal)
   - **Product ID**: `com.yourdomain.tbreak.pro.monthly` (used by RevenueCat)
   - **Billing Period**: Monthly (7/30 days trial optional)
   - **Price Tier**: Select your price (e.g., $2.99/month)
3. Add localized descriptions if needed.
4. Click **"Save"**.

Repeat for other tiers (e.g., Pro Yearly, etc.).

### 2.3 Create Signing Key (for App Store Server Notifications)

1. Go to **Users and Access** > **Keys**.
2. Click **"+"** under **App Store Server API Keys**.
3. Generate a new key and download the `.p8` file (keep it safe).
4. Copy the **Key ID** and **Issuer ID** (you'll configure these in RevenueCat).

### 2.4 Link RevenueCat to App Store Connect

1. In RevenueCat, go to your iOS **App Settings**.
2. Scroll to **"iOS Settings"** and paste:
   - **Bundle ID**: from App Store Connect
   - **App Store Connect Credentials** or **In-App Purchase Key** (upload the `.p8` file or use the Key ID / Issuer ID).
3. Click **"Save"**.

## Part 3: Google Play Setup (Android)

### 3.1 Create Play Store App

1. Log into **Google Play Console** (https://play.google.com/console).
2. Click **"Create app"**.
3. Fill in:
   - **App name**: Your app name
   - **Default language**: English
   - **App or game**: Select "App"
   - **Free or paid**: Select "Free" (you'll monetize via in-app subscriptions)

### 3.2 Create In-App Purchase Products (Subscriptions)

1. Go to your app in Play Console.
2. In the left menu, go to **"Monetization setup"** > **"In-app products"** > **"Subscriptions"**.
3. Click **"Create subscription"**.

For each subscription tier:
1. Fill in:
   - **Product ID**: `com.yourdomain.tbreak.pro.monthly` (same naming as App Store for clarity)
   - **Default price**: Select region and price
   - **Billing period**: Monthly
   - **Free trial period**: Optional (e.g., 7 days)
2. Click **"Create"**.

Repeat for other tiers.

### 3.3 Set Up Service Account (for Server API Access)

1. Go to **Settings** > **Developer account**.
2. Scroll to **API access** and click **"Create Service Account"**.
3. Follow the link to **Google Cloud Console**, create a new service account:
   - **Service Account Name**: `revenuecat-api`
   - Grant role: **Editor** (or more restrictive: **Play Developer** if available)
4. Create a JSON key and download it.
5. Copy the **Project ID** and **Service Account Email** from the JSON.

### 3.4 Grant Service Account Access in Play Console

1. Return to Play Console **API access** page.
2. Under **Service accounts**, click the checkbox next to the service account you created.
3. Select scope: **Admin** (full access to in-app billing).
4. Click **"Grant access"**.

### 3.5 Link RevenueCat to Google Play

1. In RevenueCat, go to your Android **App Settings**.
2. Scroll to **"Android Settings"** and paste:
   - **Package name**: from Play Store App
   - **Service Account Credentials**: Upload the JSON key file or copy the key content.
3. Click **"Save"**.

## Part 4: Configure Cloud Functions

### 4.1 Set Webhook Secret and API Key

1. From your development machine or CI/CD, set Firebase Functions config:

```bash
firebase functions:config:set \
  revenuecat.api_key="YOUR_REVENUECAT_API_KEY" \
  revenuecat.webhook_secret="YOUR_WEBHOOK_SECRET"
```

2. Verify config was set:

```bash
firebase functions:config:get
```

### 4.2 Deploy Cloud Functions

1. Build and deploy:

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

Note the function URL printed (e.g., `https://us-central1-YOUR_PROJECT.cloudfunctions.net/revenuecat`).

### 4.3 Configure RevenueCat Webhook

1. In RevenueCat dashboard, go to **Project Settings** > **Webhooks**.
2. Click **"+ Add Webhook"**.
3. Configure:
   - **Webhook URL**: `https://us-central1-YOUR_PROJECT.cloudfunctions.net/revenuecat/webhook`
   - **Events**: Select all events (Subscription events, entitlement changes, etc.)
   - **Signing Method**: HMAC-SHA256 (uses Webhook Secret)
4. Click **"Save"** and test by clicking **"Send Test Event"** in RevenueCat.

Your Cloud Function should receive the webhook, verify the signature, and write `subscription` to Firestore. Check logs:

```bash
firebase functions:log --only revenuecat
```

## Part 5: Testing with Sandbox / Test Accounts

### 5.1 iOS Sandbox Testing

1. In your React Native app, use RevenueCat's `Purchases.configure()` with your iOS app API key.
2. Create a test account in App Store Connect:
   - Go to **Users and Access** > **Sandbox** > **Test Users**.
   - Click **"+"** and create a test user (e.g., `test@example.com`, password `TestPassword123`).
3. On a test device or simulator, run your app and call `Purchases.purchaseProduct('com.yourdomain.tbreak.pro.monthly')`.
4. When prompted, sign in with your test account email/password.
5. Confirm the purchase in the test alert (it completes immediately in sandbox).
6. Check Firestore: `users/{uid}.subscription` should now contain entitlements.

### 5.2 Android Sandbox Testing

1. In Play Console, go to your app **Settings** > **License Testing**.
2. Add test account email addresses (e.g., your Gmail).
3. In your React Native app, on a physical device or emulator, sign in with a test account.
4. Call `Purchases.purchaseProduct('com.yourdomain.tbreak.pro.monthly')`.
5. Confirm the purchase (Play Billing will use sandbox).
6. Check Firestore for updated subscription state.

### 5.3 Webhook Testing

1. In RevenueCat, go to **Project Settings** > **Webhooks**.
2. Click **"Send Test Event"** next to your webhook entry.
3. In Firebase logs, you should see the webhook received and processed:

```bash
firebase functions:log --only revenuecat
```

4. Check Firestore: a test user doc should be created under `users/{testUserId}` with a `subscription` field.

## Part 6: Client-Side Entitlement Gating

Once webhooks are working, your app's `UserContext` automatically syncs `profile.subscription` from Firestore. Use it to gate premium features:

```tsx
import { useUser } from '../context/UserContext';

function PremiumFeature() {
  const { profile } = useUser();
  const isPremium = Object.values(profile?.subscription?.entitlements || {})
    .some(ent => ent.isActive);

  if (!isPremium) {
    return <UpgradeButton />;
  }

  return <FeatureContent />;
}
```

## Part 7: Monitoring & Alerts (Production)

### 7.1 Cloud Function Logs

Monitor function execution and errors:

```bash
# Stream logs in real-time
firebase functions:log --tail
```

Set up alerting in **Google Cloud Console** > **Monitoring** for function errors:
1. Create an uptime check for your webhook URL.
2. Create an alert policy for Cloud Functions error rates.

### 7.2 Firestore Audit

Periodically verify that `users/{uid}.subscription` fields are being updated:

```javascript
// Firestore console query
db.collection('users')
  .where('subscription.lastUpdatedAt', '>=', Date.now() - 86400000)
  .limit(10)
```

## Part 8: Edge Cases & Troubleshooting

### Webhook Signature Verification Fails

- **Issue**: Webhook received but signature invalid.
- **Solution**: Confirm the webhook secret in RevenueCat matches the one in Cloud Functions config. Check that the raw request body (not parsed JSON) is used for HMAC computation.

### Entitlements Not Appearing in Firestore

- **Issue**: Purchase completes but `users/{uid}.subscription` is not updated.
- **Solutions**:
  - Confirm webhook URL is correct and reachable.
  - Check Cloud Function logs for errors.
  - Manually call `/revenuecat/sync/{appUserId}` endpoint to force a sync.
  - Confirm the `appUserId` in RevenueCat matches the Firebase `uid`.

### Grace Periods & Billing Retries

- **Issue**: User is charged but entitlement shows as inactive.
- **Solution**: RevenueCat handles grace periods automatically. Update your parser in `functions/src/parsePurchaserInfo.ts` to account for `grace_period_expires_date` if applicable.

### Refunds & Cancellations

- **Issue**: User refunded but entitlement still active.
- **Solution**: RevenueCat webhooks send cancellation events. Your Cloud Function will update Firestore when the webhook arrives. Consider adding a reconciliation job that periodically syncs all users.

## Part 9: Deployment Checklist

Before going live:

- [ ] RevenueCat project created and configured with both iOS and Android apps.
- [ ] App Store Connect: app created, in-app purchase products created, signing key generated.
- [ ] Google Play Console: app created, in-app purchase products created, service account linked.
- [ ] Cloud Functions deployed with `revenuecat.api_key` and `revenuecat.webhook_secret` configured.
- [ ] RevenueCat webhook URL configured and test event received successfully.
- [ ] iOS sandbox testing completed; purchase flow works and entitlements appear in Firestore.
- [ ] Android sandbox testing completed; purchase flow works and entitlements appear in Firestore.
- [ ] Client app gating logic implemented and tested (premium features gate based on `profile.subscription`).
- [ ] Privacy policy updated to disclose in-app purchases.
- [ ] App Store Connect: in-app purchase tax & banking info filled in.
- [ ] Google Play: merchant account and payment info configured.
- [ ] Monitoring & alerting set up for Cloud Functions.

## References

- RevenueCat Docs: https://docs.revenuecat.com
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
- Firebase Cloud Functions: https://firebase.google.com/docs/functions

---

**Note**: Replace placeholder values (project IDs, bundle IDs, etc.) with your actual values. Keep API keys and secrets secure and never commit them to version control.
