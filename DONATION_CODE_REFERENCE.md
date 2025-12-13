# Donation Services - Code Reference

This document provides quick reference for the donation services implementation.

## Service Layer: `src/services/donations.ts`

Frontend service for initiating and recording donations:

```typescript
// Types
interface DonationRequest {
  type: "stripe" | "revenuecat";
  userId: string;
  amount: number;
  tierName: string;
  productId?: string;
  stripePrice?: string;
}

interface DonationResponse {
  success?: boolean;
  sessionUrl?: string;
  error?: string;
}

// API Functions
export const initiateDonation = async (request: DonationRequest)
export const recordDonation = async (userId, amount, type, transactionId?)
```

## Cloud Functions: `functions/src/donations.ts`

Backend handlers for payment processing:

```typescript
// Stripe Checkout Session Creation
async function initiateStripeCheckout(req, res)

// Donation Recording to Firestore
async function recordDonation(req, res)

// Webhook Handler for Payment Verification
async function handleStripeWebhook(req, res)
```

## Routes

All routes are prefixed with `/donations`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/donations/initiate` | Create Stripe Checkout session |
| POST | `/donations/record` | Record donation to Firestore |
| POST | `/donations/webhook` | Handle Stripe payment events |

## Firestore Schema

### Collections

#### `/donations/{donationId}`
```json
{
  "userId": "firebase-uid",
  "amount": 25.00,
  "type": "stripe|revenuecat|manual",
  "transactionId": "pi_123456789",
  "status": "completed|pending|failed",
  "timestamp": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### `/users/{userId}` (extended fields)
```json
{
  "totalDonated": 100.00,
  "donationCount": 4,
  "lastDonationDate": "2024-01-15T10:30:00Z"
}
```

## Environment Variables

Required for Cloud Functions:

```bash
# Firebase Config (via Console or .runtimeconfig.json)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=https://yourapp.com

# Frontend .env
REACT_APP_DONATION_FUNCTION_URL=https://region-projectId.cloudfunctions.net/donations
```

## API Request/Response Examples

### Initiate Stripe Checkout

**Request:**
```json
{
  "type": "stripe",
  "userId": "user123",
  "amount": 25,
  "tierName": "Monthly supporter",
  "stripePrice": "price_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "sessionUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_live_..."
}
```

### Record Donation

**Request:**
```json
{
  "userId": "user123",
  "amount": 25,
  "type": "stripe",
  "transactionId": "pi_123456789",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "donationId": "donation_abc123"
}
```

## User Flow

### Web (Stripe)

```
User selects tier
  ↓
UI calls initiateDonation()
  ↓
Cloud Function creates Stripe session
  ↓
User redirected to Stripe Checkout
  ↓
User completes payment
  ↓
Stripe sends webhook to Cloud Function
  ↓
Cloud Function records donation
  ↓
User redirected to app with success
```

### Mobile (RevenueCat)

```
User selects tier on mobile
  ↓
UI calls initiateDonation() with productId
  ↓
Cloud Function initiates RevenueCat flow
  ↓
Native in-app purchase dialog
  ↓
RevenueCat webhook received
  ↓
Cloud Function records donation
```

## Type Safety

All functions are fully typed with TypeScript:

```typescript
// Request types
DonationRequest
DonationResponse

// Internal types
interface Session {
  userId: string;
  amount: number;
  tierName: string;
}
```

## Error Handling

- Missing required fields: 400 Bad Request
- Invalid signature: 401 Unauthorized
- Server errors: 500 Internal Server Error
- Network timeouts: Connection error with retry

## Security Features

1. **Webhook Verification**: HMAC-SHA256 signature validation
2. **CORS**: Restricted to app domain
3. **Environment Variables**: Never committed to git
4. **PCI Compliance**: Delegated to Stripe/RevenueCat
5. **Firebase Auth**: User verification required

## Testing

### Local Development

```bash
# Start emulator
firebase emulators:start

# Test endpoint
curl -X POST http://localhost:5001/project-id/us-central1/donations/initiate \
  -H "Content-Type: application/json" \
  -d '{"type":"stripe","userId":"test","amount":5,"tierName":"Coffee","stripePrice":"price_..."}'
```

### Stripe Test Cards

| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card Declined |
| 4000 0025 0000 3155 | Requires 3D Secure |

## Deployment

```bash
# Build functions
cd functions
npm install
npm run build

# Deploy
cd ..
firebase deploy --only functions

# Monitor
firebase functions:log
```

## Monitoring

### Firebase Console
- View function logs
- Check execution metrics
- Monitor errors

### Firestore
- Query donations collection
- Verify user stats updates
- Export data for analytics

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "User not found" | Ensure user document exists in Firestore |
| "Invalid Stripe key" | Check env variable is set correctly |
| "Webhook not received" | Verify URL in Stripe Dashboard |
| "CORS error" | Check Cloud Function CORS config |
| "Session creation failed" | Check Stripe product/price IDs exist |

## Next Steps

1. Follow DONATIONS_SETUP.md for deployment
2. Configure Stripe account
3. Set Firebase environment variables
4. Deploy functions
5. Test with real payments
6. Monitor webhook events
7. Track donations in analytics
