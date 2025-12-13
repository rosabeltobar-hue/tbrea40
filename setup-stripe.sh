#!/bin/bash
# Stripe Setup Helper Script for T-Break Donations

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         T-Break Stripe Donation Setup Helper                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}✗ .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 1: Stripe Account Setup"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1. Go to: https://stripe.com"
echo "2. Click 'Sign up' and create your account"
echo "3. Complete email verification"
echo ""
read -p "Press Enter when you've created your Stripe account..."

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 2: Get Stripe API Keys"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1. In Stripe Dashboard: Developers > API keys"
echo "2. Make sure you're in TEST MODE (toggle at top)"
echo "3. Copy your Secret Key (starts with sk_test_...)"
echo ""
read -p "Enter your Stripe TEST Secret Key: " STRIPE_SECRET_KEY

if [[ $STRIPE_SECRET_KEY != sk_test_* ]]; then
    echo -e "${YELLOW}⚠ Warning: Key doesn't start with 'sk_test_' - make sure you're in TEST mode${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 3: Create Stripe Products"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Create these 4 products in Stripe Dashboard (Products > Add product):"
echo ""
echo "  1. Coffee Donation - \$5 (one-time)"
echo "  2. Meal Donation - \$15 (one-time)"
echo "  3. Monthly Support - \$25 (recurring/monthly)"
echo "  4. Hero Donation - \$50 (one-time)"
echo ""
echo "After creating each, copy the PRICE ID (looks like: price_abc123...)"
echo ""
read -p "Press Enter when you've created all 4 products..."

echo ""
read -p "Enter Coffee (\$5) Price ID: " PRICE_COFFEE
read -p "Enter Meal (\$15) Price ID: " PRICE_MEAL
read -p "Enter Monthly (\$25) Price ID: " PRICE_MONTH
read -p "Enter Hero (\$50) Price ID: " PRICE_HERO

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 4: Configure Firebase"
echo "════════════════════════════════════════════════════════════════"
echo ""
read -p "Enter your app URL (e.g., https://yourapp.com): " APP_URL

echo ""
echo "Setting Firebase Functions configuration..."
firebase functions:config:set \
  stripe.secret_key="$STRIPE_SECRET_KEY" \
  app.url="$APP_URL"

echo -e "${GREEN}✓ Firebase config set${NC}"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 5: Update Donations.tsx"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Updating src/pages/Donations.tsx with your Stripe Price IDs..."

# Update the Donations.tsx file with actual Price IDs
sed -i "s/stripePrice: \"price_coffee_5\"/stripePrice: \"$PRICE_COFFEE\"/" src/pages/Donations.tsx
sed -i "s/stripePrice: \"price_meal_15\"/stripePrice: \"$PRICE_MEAL\"/" src/pages/Donations.tsx
sed -i "s/stripePrice: \"price_month_25\"/stripePrice: \"$PRICE_MONTH\"/" src/pages/Donations.tsx
sed -i "s/stripePrice: \"price_hero_50\"/stripePrice: \"$PRICE_HERO\"/" src/pages/Donations.tsx

echo -e "${GREEN}✓ Updated Donations.tsx${NC}"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 6: Deploy Functions"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Deploying Firebase Functions..."
firebase deploy --only functions:donations

echo ""
echo -e "${GREEN}✓ Functions deployed!${NC}"
echo ""
echo "Copy the Function URL from above and save it."
read -p "Enter your deployed function URL: " FUNCTION_URL

# Update .env file
if grep -q "REACT_APP_DONATION_FUNCTION_URL=" .env; then
    sed -i "s|REACT_APP_DONATION_FUNCTION_URL=.*|REACT_APP_DONATION_FUNCTION_URL=$FUNCTION_URL|" .env
else
    echo "REACT_APP_DONATION_FUNCTION_URL=$FUNCTION_URL" >> .env
fi

echo -e "${GREEN}✓ Updated .env file${NC}"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 7: Setup Stripe Webhook"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1. In Stripe Dashboard: Developers > Webhooks"
echo "2. Click 'Add endpoint'"
echo "3. Enter this URL:"
echo -e "${BLUE}   $FUNCTION_URL/webhook${NC}"
echo "4. Select these events:"
echo "   - checkout.session.completed"
echo "   - checkout.session.async_payment_succeeded"
echo "   - checkout.session.async_payment_failed"
echo "5. Click 'Add endpoint'"
echo "6. Copy the 'Signing secret' (starts with whsec_...)"
echo ""
read -p "Enter Webhook Signing Secret: " WEBHOOK_SECRET

firebase functions:config:set stripe.webhook_secret="$WEBHOOK_SECRET"
echo -e "${GREEN}✓ Webhook secret configured${NC}"

echo ""
echo "Redeploying functions with webhook secret..."
firebase deploy --only functions:donations

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 8: Build & Test"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Building React app..."
npm run build

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    SETUP COMPLETE! 🎉                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start your app:"
echo -e "   ${BLUE}npm start${NC}"
echo ""
echo "2. Test donation flow with Stripe test card:"
echo "   Card: 4242 4242 4242 4242"
echo "   Expiry: 12/34"
echo "   CVC: 123"
echo ""
echo "3. Check Stripe Dashboard to see test payment"
echo "4. Check Firestore for donation record"
echo ""
echo "When ready for production:"
echo "1. Switch Stripe to LIVE mode"
echo "2. Update Firebase config with live keys"
echo "3. Setup live webhook"
echo "4. Test with real card"
echo ""
echo -e "${YELLOW}📖 For detailed guide, see: STRIPE_SETUP_GUIDE.md${NC}"
echo ""
