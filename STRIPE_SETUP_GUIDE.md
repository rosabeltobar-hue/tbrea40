# 🎯 Stripe Setup Guide for T-Break Donations

## Quick Overview
This guide walks you through setting up Stripe for accepting donations in your T-Break app.

**Time Required:** 30-45 minutes  
**Cost:** Free (Stripe charges per transaction only)

---

## Step 1: Create Stripe Account (5 min)

1. Go to **https://stripe.com**
2. Click **"Sign up"** (top right)
3. Enter your email and create password
4. Fill in business details:
   - **Business name:** T-Break App (or your name)
   - **Business type:** Individual or Sole Proprietorship
   - **Country:** Your country
5. Verify your email address
6. You'll land in the Stripe Dashboard

✅ **Done!** You now have a Stripe account.

---

## Step 2: Get Your API Keys (2 min)

### Test Mode Keys (for development)

1. In Stripe Dashboard, click **"Developers"** (top menu)
2. Click **"API keys"** (left sidebar)
3. You'll see two keys in **Test mode**:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

4. **Copy the Secret Key** - you'll need this soon

⚠️ **Important:** Never share or commit your secret key to GitHub!

### Live Mode Keys (for production - do this later)

1. Toggle switch from "Test mode" to "Live mode"
2. Copy both keys (same process as test mode)
3. You'll switch to these after testing

---

## Step 3: Create Donation Products (10 min)

Now we'll create 4 donation products in Stripe.

### Product 1: Coffee Donation ☕

1. In Stripe Dashboard, go to **"Products"** (top menu)
2. Click **"Add product"**
3. Fill in:
   - **Name:** `Coffee Donation`
   - **Description:** `Support development with a small gift`
   - **Pricing:**
     - Select **"One time"**
     - **Price:** `5.00` USD
     - **Price name (optional):** `Coffee - $5`
4. Click **"Save product"**
5. **IMPORTANT:** Copy the **Price ID** (looks like `price_abc123xyz...`)
6. Save this ID - you'll need it!

### Product 2: Meal Donation 🍽️

Repeat the same process:
- **Name:** `Meal Donation`
- **Description:** `Help keep the lights on`
- **Price:** `15.00` USD
- **Copy the Price ID**

### Product 3: Monthly Support 💪

- **Name:** `Monthly Support`
- **Description:** `Recurring monthly support`
- **Pricing:**
  - Select **"Recurring"**
  - **Billing period:** Monthly
  - **Price:** `25.00` USD
- **Copy the Price ID**

### Product 4: Hero Donation 🦸

- **Name:** `Hero Donation`
- **Description:** `Major contributor to the mission`
- **Price:** `50.00` USD
- **Copy the Price ID**

✅ **Done!** You now have 4 products with Price IDs.

---

## Step 4: Update Your App Code (5 min)

Now update your code with the real Stripe Price IDs.

### Open `src/pages/Donations.tsx`

Find lines 23-46 and replace the placeholder IDs:

```typescript
const donationTiers = [
  {
    id: "donation_coffee",
    name: "Buy me a coffee ☕",
    amount: 5,
    description: "Support development with a small gift",
    stripePrice: "price_YOUR_COFFEE_PRICE_ID_HERE",  // ← Replace this
    revenuecat: "com.tbreak.donation.coffee"
  },
  {
    id: "donation_meal",
    name: "Buy me a meal 🍽️",
    amount: 15,
    description: "Help keep the lights on",
    stripePrice: "price_YOUR_MEAL_PRICE_ID_HERE",  // ← Replace this
    revenuecat: "com.tbreak.donation.meal"
  },
  {
    id: "donation_month",
    name: "Monthly supporter 💪",
    amount: 25,
    description: "Recurring monthly support",
    stripePrice: "price_YOUR_MONTHLY_PRICE_ID_HERE",  // ← Replace this
    revenuecat: "com.tbreak.donation.month"
  },
  {
    id: "donation_hero",
    name: "Be a hero 🦸",
    amount: 50,
    description: "Major contributor to the mission",
    stripePrice: "price_YOUR_HERO_PRICE_ID_HERE",  // ← Replace this
    revenuecat: "com.tbreak.donation.hero"
  }
];
```

Save the file!

---

## Step 5: Configure Firebase Functions (5 min)

Set your Stripe secret key in Firebase Functions config:

```bash
# Set Stripe test key first
firebase functions:config:set stripe.secret_key="sk_test_YOUR_KEY_HERE"

# Set your app URL (for redirects after payment)
firebase functions:config:set app.url="https://yourapp.com"

# View current config to verify
firebase functions:config:get
```

**For Codespaces/dev environment:**
```bash
# Your app URL might be:
firebase functions:config:set app.url="https://orange-space-acorn-g4j76xgxgxqghrxv.github.dev"
```

---

## Step 6: Deploy Cloud Functions (3 min)

```bash
# Navigate to your project root
cd /workspaces/tbrea40

# Deploy only the donations function
firebase deploy --only functions:donations

# Wait for deployment (1-2 minutes)
```

After deployment, you'll see output like:
```
✔  functions[donations(us-central1)]: Successful create operation.
Function URL (donations): https://us-central1-proj2aaf5898.cloudfunctions.net/donations
```

**Copy that URL!** You'll need it.

---

## Step 7: Update .env File (2 min)

Open `.env` in your project root and update:

```bash
REACT_APP_DONATION_FUNCTION_URL=https://us-central1-YOUR_PROJECT.cloudfunctions.net/donations
```

Replace with your actual deployed function URL from Step 6.

---

## Step 8: Setup Stripe Webhook (5 min)

This allows Stripe to notify your app when payments complete.

1. In Stripe Dashboard, go to **"Developers" > "Webhooks"**
2. Click **"Add endpoint"**
3. **Endpoint URL:** Paste your function URL + `/webhook`:
   ```
   https://us-central1-YOUR_PROJECT.cloudfunctions.net/donations/webhook
   ```
4. Click **"Select events"**
5. Choose these events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
6. Click **"Add events"** then **"Add endpoint"**
7. **Copy the Signing Secret** (looks like `whsec_...`)

### Add Webhook Secret to Firebase

```bash
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_SECRET_HERE"

# Redeploy with new config
firebase deploy --only functions:donations
```

✅ **Done!** Webhook is configured.

---

## Step 9: Test Everything (10 min)

### Build and run your app:

```bash
# Rebuild React app with new .env
npm run build

# Start dev server
npm start
```

### Test the donation flow:

1. Open your app and go to the Donations page
2. Click on "Coffee" donation ($5)
3. You should be redirected to Stripe Checkout
4. Use Stripe test card:
   - **Card number:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., `12/34`)
   - **CVC:** Any 3 digits (e.g., `123`)
   - **ZIP:** Any 5 digits (e.g., `12345`)
5. Complete the payment
6. You should be redirected back to your app with success message

### Verify in Stripe Dashboard:

1. Go to **"Payments"** in Stripe Dashboard
2. You should see your test payment listed
3. Go to **"Webhooks"** and check if webhook was delivered

### Check Firestore:

1. Open Firebase Console → Firestore Database
2. Look for new document in `donations` collection
3. Verify user's `totalDonated` field was updated

---

## Step 10: Go Live! (5 min)

Once testing works perfectly:

1. **Switch to Live Mode in Stripe:**
   - Toggle from "Test" to "Live" mode
   - Copy your **Live Secret Key** (starts with `sk_live_...`)

2. **Update Firebase config:**
   ```bash
   firebase functions:config:set stripe.secret_key="sk_live_YOUR_LIVE_KEY"
   firebase deploy --only functions:donations
   ```

3. **Setup Live Webhook:**
   - In Stripe (Live mode): Developers > Webhooks
   - Add same endpoint with live webhook secret
   - Update Firebase config:
     ```bash
     firebase functions:config:set stripe.webhook_secret="whsec_YOUR_LIVE_SECRET"
     firebase deploy --only functions:donations
     ```

4. **Test with real card (small amount)**

5. **You're live!** 🎉

---

## Troubleshooting

### Issue: "No such price: price_coffee_5"
**Fix:** You forgot to update the Price IDs in `Donations.tsx`. Go back to Step 4.

### Issue: "Webhook signature verification failed"
**Fix:** Make sure webhook secret in Firebase config matches Stripe dashboard.

### Issue: "Redirect URL not working"
**Fix:** Check `app.url` in Firebase config matches your actual domain.

### Issue: "User email not found"
**Fix:** Make sure users have email in Firebase Auth when signing up.

### Issue: Donation not recorded in Firestore
**Fix:** Check Firebase Functions logs:
```bash
firebase functions:log --only donations
```

---

## Summary Checklist

- [ ] Created Stripe account
- [ ] Created 4 products with Price IDs
- [ ] Updated `Donations.tsx` with real Price IDs
- [ ] Set Firebase Functions config (secret key + app URL)
- [ ] Deployed functions
- [ ] Updated `.env` with function URL
- [ ] Setup Stripe webhook
- [ ] Added webhook secret to Firebase config
- [ ] Tested with Stripe test card
- [ ] Verified payment in Stripe Dashboard
- [ ] Verified donation in Firestore
- [ ] Switched to live keys (when ready)
- [ ] Tested live payment
- [ ] **LIVE AND ACCEPTING DONATIONS!** 🚀

---

## Need Help?

If you get stuck:
1. Check Firebase Functions logs: `firebase functions:log`
2. Check Stripe Dashboard > Developers > Logs
3. Check browser console for errors
4. Review this guide step-by-step

**Common pitfall:** Forgetting to redeploy after changing Firebase config. Always run `firebase deploy --only functions:donations` after config changes!
