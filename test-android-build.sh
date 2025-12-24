#!/bin/bash
# Android Build Path Test Script
# Tests the complete Android build pipeline

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_test() {
    echo -e "${YELLOW}Testing:${NC} $1"
}

print_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

print_fail() {
    echo -e "${RED}✗${NC} $1"
}

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         ANDROID BUILD PATH VALIDATION TEST                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Capacitor config
print_test "Capacitor configuration"
if [ -f "capacitor.config.json" ]; then
    APP_ID=$(grep -o '"appId": *"[^"]*"' capacitor.config.json | cut -d'"' -f4)
    WEB_DIR=$(grep -o '"webDir": *"[^"]*"' capacitor.config.json | cut -d'"' -f4)
    print_pass "Config exists - appId: $APP_ID, webDir: $WEB_DIR"
else
    print_fail "capacitor.config.json not found"
    exit 1
fi

# Test 2: Android project structure
print_test "Android project structure"
if [ -d "android" ]; then
    print_pass "Android directory exists"
else
    print_fail "Android directory missing"
    exit 1
fi

if [ -f "android/build.gradle" ]; then
    print_pass "Root build.gradle found"
else
    print_fail "build.gradle missing"
fi

if [ -f "android/app/build.gradle" ]; then
    print_pass "App build.gradle found"
else
    print_fail "app/build.gradle missing"
fi

# Test 3: Gradle wrapper
print_test "Gradle wrapper"
if [ -f "android/gradlew" ] && [ -x "android/gradlew" ]; then
    print_pass "Gradle wrapper is executable"
else
    print_fail "Gradle wrapper not executable"
fi

# Test 4: Web build output
print_test "Web build directory"
if [ -d "build" ]; then
    FILE_COUNT=$(find build -type f | wc -l)
    print_pass "Build directory exists ($FILE_COUNT files)"
else
    print_fail "Build directory missing - run 'npm run build' first"
fi

# Test 5: Capacitor sync
print_test "Capacitor sync capability"
if command -v npx &> /dev/null; then
    npx cap sync android > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_pass "Capacitor sync successful"
    else
        print_fail "Capacitor sync failed"
    fi
else
    print_fail "npx command not found"
fi

# Test 6: Android assets
print_test "Android web assets"
ASSETS_DIR="android/app/src/main/assets/public"
if [ -d "$ASSETS_DIR" ]; then
    ASSET_COUNT=$(find "$ASSETS_DIR" -type f | wc -l)
    print_pass "Web assets copied to Android ($ASSET_COUNT files)"
else
    print_fail "Android assets directory missing"
fi

# Test 7: Gradle tasks available
print_test "Gradle build tasks"
cd android
if ./gradlew tasks --quiet 2>&1 | grep -q "assembleRelease"; then
    print_pass "assembleRelease task available"
else
    print_fail "assembleRelease task not found"
fi

if ./gradlew tasks --quiet 2>&1 | grep -q "bundleRelease"; then
    print_pass "bundleRelease task available"
else
    print_fail "bundleRelease task not found"
fi
cd ..

# Test 8: Release signing configuration
print_test "Release signing setup"
if [ -f "android/gradle-signing.properties.template" ]; then
    print_pass "Signing template exists"
else
    echo -e "${YELLOW}⚠${NC} No signing template (expected for dev)"
fi

if [ -f "android/keystore/tbreak.keystore" ]; then
    print_pass "Keystore file exists"
elif [ -d "android/keystore" ]; then
    echo -e "${YELLOW}⚠${NC} Keystore directory exists but no keystore"
else
    echo -e "${YELLOW}⚠${NC} Keystore not configured (see ANDROID-BUILD-GUIDE.md)"
fi

# Test 9: Firebase configuration
print_test "Firebase Android configuration"
if [ -f "android/app/google-services.json" ]; then
    print_pass "google-services.json exists"
else
    echo -e "${YELLOW}⚠${NC} google-services.json missing (required for FCM)"
fi

# Test 10: Capacitor plugins
print_test "Capacitor plugin configuration"
if grep -q "@capacitor-firebase/messaging" "package.json"; then
    print_pass "Firebase Messaging plugin configured"
else
    print_fail "Firebase Messaging plugin not in package.json"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ANDROID BUILD PATH TEST SUMMARY               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Build command:     ./deploy.sh android"
echo "Manual steps:"
echo "  1. npm run build"
echo "  2. npx cap sync android"
echo "  3. cd android && ./gradlew bundleRelease"
echo ""
echo "Output location:   android/app/build/outputs/bundle/release/"
echo "Next step:         Upload AAB to Google Play Console"
echo ""
