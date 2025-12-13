React Native + RevenueCat integration notes

This document shows a minimal example of integrating `react-native-purchases` in a React Native app and how to connect the client to the server-side sync endpoint created in `functions/`.

1) Install SDK (React Native)

```bash
# React Native (not Expo managed)
npm install react-native-purchases
# then follow native install steps from RevenueCat docs
```

2) Initialize RevenueCat on app startup

```ts
// App.tsx (React Native)
import Purchases from 'react-native-purchases';

useEffect(() => {
  Purchases.configure({ apiKey: 'REVENUECAT_PUBLIC_KEY' });
}, []);
```

3) Purchase flow (example)

```ts
async function purchaseProduct(productIdentifier: string) {
  try {
    const purchase = await Purchases.purchaseProduct(productIdentifier);
    // RevenueCat handles receipts server-side. You can optionally call your server to sync.
    // Example: POST /revenuecat/sync/:appUserId to force a server-side sync
    await fetch(`https://<YOUR_FUNCTIONS_URL>/revenuecat/sync/${encodeURIComponent(appUserId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ })
    });
    return purchase;
  } catch (e) {
    // handle error
    throw e;
  }
}
```

4) Restore purchases

```ts
async function restorePurchases() {
  try {
    const restored = await Purchases.restoreTransactions();
    // Optionally sync with server
    await fetch(`https://<YOUR_FUNCTIONS_URL>/revenuecat/sync/${encodeURIComponent(appUserId)}`, { method: 'POST' });
    return restored;
  } catch (e) {
    throw e;
  }
}
```

5) App user id mapping

- RevenueCat allows you to pass an `appUserID` when configuring Purchases. Use your Firebase `uid` as the appUserID so webhooks and purchaser info map directly to `users/{uid}` in Firestore.

```ts
Purchases.configure({ apiKey: 'REVENUECAT_PUBLIC_KEY', appUserID: firebaseUid });
```

6) Security

- Do not embed RevenueCat secret keys in the client. Use RevenueCat server API keys only on the server (Cloud Functions). Keep webhook secret and API key in Functions config.

7) Using Firestore as canonical source

- The Cloud Function writes a compact `subscription` object into `users/{uid}.subscription`. Update your `UserContext` (already listening to user doc) so the client reads `profile.subscription` and gates premium features accordingly.

8) Notes

- For offline or immediate UI, you can use the RevenueCat SDK on the client to read entitlements and show premium UI instantly; server/webhook sync ensures canonical state is writable and observable by other services.
