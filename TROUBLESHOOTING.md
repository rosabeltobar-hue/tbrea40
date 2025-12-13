# 🔧 Donation System Troubleshooting Guide

Common issues and how to fix them when setting up Stripe donations.

---

## 🚨 Setup Issues

### "No such price: price_coffee_5"

**Problem:** Using placeholder Price IDs that don't exist in your Stripe account.

**Solution:**
1. Go to Stripe Dashboard → Products
2. Create all 4 products with prices
3. Copy each Price ID (looks like `price_abc123...`)
4. Update `src/pages/Donations.tsx` lines 24-46 with real Price IDs
5. Rebuild: `npm run build`

---

### "Webhook signature verification failed"

**Problem:** Webhook secret doesn't match between Stripe and Firebase.

**Solution:**
1. In Stripe Dashboard: Developers → Webhooks
2. Click on your webhook endpoint
3. Copy the "Signing secret" (starts with `whsec_...`)
4. Run: `firebase functions:config:set stripe.webhook_secret="whsec_YOUR_SECRET"`
5. Redeploy: `firebase deploy --only functions:donations`

---

### "User email not found"

**Problem:** ~~User doesn't have email in Firestore or Firebase Auth.~~ **FIXED!**

**Status:** ✅ Already fixed - now uses Firebase Auth as fallback.

If you still see this:
1. Verify user has email when signing up
2. Check Firebase Console → Authentication → Users
3. Ensure email field is populated

---

### "Failed to authenticate, have you run firebase login?"

**Problem:** Not logged into Firebase CLI.

**Solution:**
```bash
firebase login
```
Follow the prompts to authenticate with Google.

---

### "Missing required fields"

**Problem:** Environment variables not set or function not deployed.

**Solution:**
1. Check `.env` file has `REACT_APP_DONATION_FUNCTION_URL`
2. Verify Firebase config:
   ```bash
   firebase functions:config:get
   ```
3. Should show:
   - `stripe.secret_key`
   - `stripe.webhook_secret`
   - `app.url`
4. If missing, set them:
   ```bash
   firebase functions:config:set stripe.secret_key="sk_test_..."
   firebase functions:config:set app.url="https://yourapp.com"
   ```
5. Redeploy: `firebase deploy --only functions:donations`

---

## 💳 Payment Issues

### Test payment not working

**Problem:** Using real card in test mode or test card in live mode.

**Solution:**
- **Test Mode:** Use card `4242 4242 4242 4242`
- **Live Mode:** Use real card
- Check Stripe Dashboard toggle (top right) shows correct mode

---

### Redirect not working after payment

**Problem:** `app.url` not configured correctly.

**Solution:**
1. Check Firebase config:
   ```bash
   firebase functions:config:get
   ```
2. Verify `app.url` matches your actual domain
3. For dev: Use your Codespaces URL
4. For prod: Use your production domain
5. Update if needed:
   ```bash
   firebase functions:config:set app.url="https://correct-url.com"
   firebase deploy --only functions:donations
   ```

---

### Payment succeeds but not recorded in Firestore

**Problem:** Webhook not configured or not working.

**Solution:**
1. Check Stripe Dashboard → Webhooks
2. Click on your webhook
3. Look at "Recent Webhook Calls"
4. If failing, check error message
5. Common fix: Update webhook secret (see above)
6. Check Firebase Functions logs:
   ```bash
   firebase functions:log --only donations
   ```

---

## 🔍 Debugging Commands

### Check Firebase Functions logs
```bash
firebase functions:log --only donations
```
Shows real-time logs from Cloud Functions.

---

### Check Firebase config
```bash
firebase functions:config:get
```
Shows all environment variables set in Functions.

---

### Test webhook locally
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5001/YOUR_PROJECT/us-central1/donations/webhook

# In another terminal, trigger test event
stripe trigger checkout.session.completed
```

---

### Check function deployment status
```bash
firebase functions:list
```
Shows all deployed functions and their URLs.

---

## 🐛 Common Error Messages

### "Cannot read property 'data' of undefined"

**Cause:** Firestore query returning no data.

**Fix:** Check if user document exists in Firestore.

---

### "Network request failed"

**Cause:** No internet or Cloud Function not reachable.

**Fix:** 
1. Check internet connection
2. Verify function URL in `.env` is correct
3. Try accessing function URL directly in browser

---

### "CORS error"

**Cause:** Cloud Function not allowing requests from your domain.

**Fix:** Already handled in code with `cors({ origin: true })`. If still seeing:
1. Check browser console for actual error
2. Verify function deployed correctly
3. Try clearing browser cache

---

## 📊 Verification Checklist

Use this to verify everything is working:

- [ ] Stripe account created and verified
- [ ] 4 products created with real Price IDs
- [ ] Price IDs updated in `Donations.tsx`
- [ ] Firebase login successful
- [ ] Firebase config set (stripe keys, app.url)
- [ ] Functions deployed successfully
- [ ] Function URL added to `.env`
- [ ] React app rebuilt with new `.env`
- [ ] Webhook endpoint added in Stripe
- [ ] Webhook secret added to Firebase config
- [ ] Test payment with 4242 card succeeds
- [ ] Redirected back to app after payment
- [ ] Payment visible in Stripe Dashboard
- [ ] Donation recorded in Firestore
- [ ] User's `totalDonated` field updated
- [ ] Webhook shows "Success" in Stripe Dashboard

---

## 🆘 Still Stuck?

If none of the above helps:

1. **Check all logs:**
   ```bash
   firebase functions:log --only donations
   ```

2. **Check Stripe logs:**
   - Stripe Dashboard → Developers → Logs
   - Look for errors in API calls

3. **Verify step-by-step:**
   - Go through `STRIPE_SETUP_GUIDE.md` again
   - Make sure you didn't skip any steps

4. **Start fresh:**
   ```bash
   # Reset Firebase config
   firebase functions:config:unset stripe
   
   # Re-run setup
   ./setup-stripe.sh
   ```

5. **Ask for help:**
   - Include error message
   - Include relevant logs
   - Mention which step you're on

---

## 💡 Pro Tips

✅ **Always test in TEST mode first**
- Switch to test mode in Stripe Dashboard
- Use test card: 4242 4242 4242 4242
- Test webhooks with Stripe CLI

✅ **Check logs immediately when something fails**
- Firebase Functions logs show backend errors
- Browser console shows frontend errors
- Stripe logs show payment/webhook errors

✅ **Redeploy after config changes**
- Any time you change Firebase config
- Run: `firebase deploy --only functions:donations`
- Wait for deployment to complete

✅ **Keep Stripe Dashboard open while testing**
- Watch payments come in real-time
- Check webhook delivery status
- View detailed logs

---

## 📞 Getting Help

**Before asking for help, gather this info:**
1. Error message (exact text)
2. Firebase Functions logs (last 10 lines)
3. Stripe Dashboard logs (if payment-related)
4. Which step you're on
5. What you've already tried

This will help get you a faster, more accurate answer!

---

**Remember:** Most issues are just missing configuration. Double-check all environment variables and keys! 🔑
