#!/bin/bash
# T-Break Deployment Script
# Handles web (Firebase Hosting) and Android builds

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${GREEN}==>${NC} $1"
}

print_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Must run from project root (where package.json is located)"
    exit 1
fi

# Parse command line arguments
DEPLOY_TARGET="${1:-web}"  # Default to web if no argument

case "$DEPLOY_TARGET" in
    web)
        print_step "Deploying web app to Firebase Hosting..."
        
        # Build React app
        print_step "Building React app..."
        npm run build
        
        # Deploy to Firebase
        print_step "Deploying to Firebase Hosting..."
        firebase deploy --only hosting
        
        print_step "✓ Web deployment complete!"
        echo "Visit: https://tbreakapp.web.app"
        ;;
        
    functions)
        print_step "Deploying Firebase Cloud Functions..."
        
        # Build functions
        print_step "Building functions..."
        cd functions
        npm run build
        cd ..
        
        # Deploy functions
        print_step "Deploying to Firebase..."
        firebase deploy --only functions
        
        print_step "✓ Functions deployment complete!"
        ;;
        
    rules)
        print_step "Deploying Firestore & Storage security rules..."
        firebase deploy --only firestore:rules,storage:rules
        print_step "✓ Security rules deployed!"
        ;;
        
    android)
        print_step "Building Android app..."
        
        # Build web assets first
        print_step "Building web assets..."
        npm run build
        
        # Copy to Android
        print_step "Copying to Capacitor Android..."
        npx cap copy android
        
        # Sync Capacitor
        print_step "Syncing Capacitor plugins..."
        npx cap sync android
        
        # Build AAB
        print_step "Building release AAB..."
        cd android
        ./gradlew bundleRelease
        cd ..
        
        AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"
        if [ -f "$AAB_PATH" ]; then
            print_step "✓ Android build complete!"
            echo "AAB location: $AAB_PATH"
            echo "Upload to Google Play Console: https://play.google.com/console"
        else
            print_error "AAB not found. Check build logs above."
            exit 1
        fi
        ;;
        
    all)
        print_step "Full deployment (web + functions + rules)..."
        
        # Build React app
        print_step "Building React app..."
        npm run build
        
        # Build functions
        print_step "Building functions..."
        cd functions
        npm run build
        cd ..
        
        # Deploy everything
        print_step "Deploying to Firebase..."
        firebase deploy
        
        print_step "✓ Full deployment complete!"
        ;;
        
    *)
        print_error "Unknown target: $DEPLOY_TARGET"
        echo ""
        echo "Usage: ./deploy.sh [target]"
        echo ""
        echo "Targets:"
        echo "  web        Deploy web app to Firebase Hosting (default)"
        echo "  functions  Deploy Cloud Functions only"
        echo "  rules      Deploy Firestore/Storage security rules"
        echo "  android    Build Android AAB for Play Store"
        echo "  all        Deploy web + functions + rules"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh web"
        echo "  ./deploy.sh android"
        echo "  ./deploy.sh all"
        exit 1
        ;;
esac

exit 0
