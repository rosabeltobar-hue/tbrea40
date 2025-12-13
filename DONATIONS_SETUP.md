# Donation Services Implementation Guide

## Overview

This guide explains how to set up and deploy the donation services for the T-break app, including Stripe payments and RevenueCat mobile in-app purchases.

## Architecture

```
Frontend (React)
  └─> Donations.tsx
      └─> initiateDonation() service call
          └─> Cloud Function: donations
              ├─> /initiate (Stripe checkout)
              ├─> /record (save donation to Firestore)
              └─> /webhook (Stripe webhook handler)
```

## Setup Steps

### 1. Configure Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project root
firebase init functions

# Set your Firebase project
firebase use your-project-id
```

### 2. Set Up Stripe

#### Create Stripe Account
- Go to [stripe.com](https://stripe.com)
- Create a new account or sign in
- Go to Developers > API Keys to get:
  - **Secret Key** (for backend)
  - **Publishable Key** (for frontend)

#### Create Products & Prices
In Stripe Dashboard, create donation products and their prices:
- Coffee (☕) - $5
- Meal (🍽️) - $15
- Monthly (💪) - $25
- Hero (🦸) - $50

Store the price IDs in the `Donations.tsx` component (e.g., `price_1234567890`)

#### Set Up Webhook Endpoint
1. Go to Developers > Webhooks
2. Add endpoint: `https://region-projectId.cloudfunctions.net/donations/webhook`
3. Subscribe to events:
   - `checkout.session.completed`
4. Get the **Webhook Signing Secret**

### 3. Configure Cloud Functions

#### Set Environment Variables

In Firebase console or via Firebase CLI:

```bash
# Set Stripe Secret Key
firebase functions:config:set stripe.secret_key="sk_live_..."

# Set Stripe Webhook Secret
firebase functions:config:set stripe.webhook_secret="whsec_..."

# Set app URL for Stripe success/cancel redirects
firebase functions:config:set app.url="https://yourapp.com"
```

Or edit `.runtimeconfig.json` in the `functions/` directory:

```json
{
  "stripe": {
    "secret_key": "sk_live_...",
    "webhook_secret": "whsec_..."
  },
  "app": {
    "url": "https://yourapp.com"
  }
}
```

### 4. Install Dependencies

```bash
cd functions
npm install
cd ..
```

### 5. Update Environment Variables in Frontend

Create a `.env` file in project root with:

```env
REACT_APP_DONATION_FUNCTION_URL=https://region-projectId.cloudfunctions.net/donations
```

Replace:
- `region` with your Firebase region (e.g., `us-central1`)
- `projectId` with your Firebase project ID

### 6. Deploy Cloud Functions

```bash
# Build TypeScript
npm run build

# Deploy to Firebase
firebase deploy --only functions
```

## File Structure

```
functions/
  ├── src/
  │   ├── donations.ts          # Donation handlers (Stripe, recording)
  │   ├── index.ts              # Express app setup & exports
  │   ├── revenuecat.ts         # RevenueCat integration
  │   ├── parsePurchaserInfo.ts # Subscription mapping
  │   └── ...
  └── package.json              # Dependencies

src/
  ├── pages/
  │   └── Donations.tsx         # Donation UI component
  ├── services/
  │   └── donations.ts          # Frontend donation service (API calls)
  └── ...
```

## How It Works

### Web Donation Flow (Stripe)

1. **User selects donation tier** in `Donations.tsx`
2. **Frontend calls** `initiateDonation()` with Stripe price
3. **Cloud Function** creates Stripe Checkout session
4. **User redirected** to Stripe Checkout (hosted payment form)
5. **After payment**, Stripe calls webhook endpoint
6. **Cloud Function** records donation in Firestore
7. **User redirected** back to app with success message

### Mobile Donation Flow (RevenueCat)

1. **User on mobile** selects donation tier
2. **Frontend calls** `initiateDonation()` with RevenueCat product ID
3. **Cloud Function** initiates RevenueCat transaction
4. **Native app** handles payment via App Store/Play Store
5. **Cloud Function** receives webhook from RevenueCat
6. **Donation recorded** in Firestore

## Database Schema

### Donations Collection

```typescript
{
  id: "auto-generated",
  userId: "firebase-auth-uid",
  amount: 25.00,
  type: "stripe" | "revenuecat" | "manual",
  transactionId: "stripe_pi_123456",
  status: "completed" | "pending" | "failed",
  timestamp: "2024-01-15T10:30:00Z",
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Users Collection (extended)

```typescript
{
  id: "firebase-auth-uid",
  email: "user@example.com",
  totalDonated: 100.00,
  donationCount: 4,
  lastDonationDate: "2024-01-15T10:30:00Z",
  // ... other user fields
}
```

## Testing

### Local Testing with Emulator

```bash
# Start Firebase emulator
firebase emulators:start

# In another terminal, test the function
curl -X POST http://localhost:5001/project-id/us-central1/donations/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "stripe",
    "userId": "test-user",
    "amount": 5,
    "tierName": "Coffee",
    "stripePrice": "price_1234567890"
  }'
```

### Test Stripe Payments

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiration date
3. Any CVC (e.g., 123)

## Troubleshooting

### "Donation Function URL not configured"
- Check `.env` file has `REACT_APP_DONATION_FUNCTION_URL`
- Restart dev server after adding `.env`

### "Invalid Stripe Secret Key"
- Go to Stripe Dashboard > Developers > API Keys
- Copy the **Secret Key** (starts with `sk_`)
- Set via `firebase functions:config:set stripe.secret_key="..."`

### Webhook not receiving events
- In Stripe Dashboard, check webhook endpoint status
- Verify webhook signing secret is correct
- Check Cloud Function logs: `firebase functions:log`

### "User email not found"
- Ensure user document exists in Firestore
- Check Firebase Authentication is set up

## Security Considerations

1. **Secret Keys**: Never commit to git, use Firebase config
2. **CORS**: Configured in Cloud Functions for app domain
3. **Authentication**: All endpoints expect authenticated users
4. **Webhooks**: Verified with HMAC signatures (Stripe/RevenueCat)
5. **Sensitive Data**: Never log user payment info

## Revenue Sharing & Analytics

Track donations in Firestore to:
- Monitor total revenue
- Segment by donation type
- Identify high-value supporters
- Send thank-you emails to donors

## Next Steps

1. Set up Stripe account and get API keys
2. Deploy Cloud Functions with Stripe credentials
3. Update `.env` with Cloud Function URL
4. Test donation flow in development
5. Deploy to production

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [RevenueCat Documentation](https://docs.revenuecat.com)
- [T-break App Documentation](../README.md)
