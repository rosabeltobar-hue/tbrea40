# 🚀 Quick Start - Stripe Setup (5 Minutes)

**For when you just want to get started NOW!**

---

## Step 1: Create Stripe Account (2 min)

1. Open: **https://stripe.com**
2. Click **"Sign up"**
3. Enter email, create password
4. Verify email ✓

---

## Step 2: Get Your Test Keys (1 min)

1. In Stripe Dashboard: **Developers** → **API keys**
2. Make sure toggle says **"Test mode"** (top right)
3. Click **"Reveal test key token"** next to Secret key
4. Copy it (starts with `sk_test_...`)

**Save this key somewhere safe!**

---

## Step 3: Login to Firebase (1 min)

In your terminal:

```bash
firebase login
```

Follow the prompts to authenticate.

---

## Step 4: Run Setup Script (1 min)

```bash
./setup-stripe.sh
```

The script will:
- Guide you to create 4 products in Stripe
- Configure Firebase automatically
- Deploy your functions
- Setup webhooks
- Build your app

**Just follow the prompts!**

---

## What You'll Be Asked For:

1. **Stripe Secret Key** (from Step 2)
2. **4 Price IDs** (script tells you how to create them)
3. **Your app URL** (script suggests the dev URL)
4. **Webhook Secret** (script tells you where to get it)

---

## After Setup:

Test it:
```bash
npm start
```

Go to donations page, use test card:
- **Card:** 4242 4242 4242 4242
- **Expiry:** 12/34
- **CVC:** 123

---

## Need More Detail?

See `STRIPE_SETUP_GUIDE.md` for complete walkthrough with explanations.

---

**That's it! 20 minutes and you're accepting donations! 🎉**
