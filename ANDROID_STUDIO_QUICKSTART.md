# Quick Start: Android Studio in 5 Minutes

## TL;DR

```bash
# Your computer terminal:

# 1. On your computer, open Android Studio
open -a "Android Studio" /workspaces/tbrea40/android    # Mac

# Windows: Open Android Studio → File → Open → /workspaces/tbrea40/android

# 2. Wait for Gradle sync (green "Sync Now" button if needed)

# 3. Build debug APK for testing:
# In Android Studio: Build → Build APK(s) → Wait for "Build Successful"

# 4. Test on device:
# Connect phone, enable USB Debugging, then:
# Run → Run 'app' → Select phone → Run

# 5. Build release AAB for Play Store:
# Build → Generate Signed Bundle/APK → Choose Android App Bundle → Fill keystore info

# 6. Submit to Google Play Console
```

## File Paths You Need

```
On your computer:
- Android project folder: /workspaces/tbrea40/android
- Web app output: /workspaces/tbrea40/build/
- Keystore location: /workspaces/tbrea40/android/keystore/tbreak.keystore
- Signing credentials: /workspaces/tbrea40/android/gradle.properties
```

## Keyboard Shortcuts (Android Studio)

```
Cmd+R (Mac) / Ctrl+R (Windows) → Run app
Cmd+B (Mac) / Ctrl+B (Windows) → Build
Cmd+, (Mac) / Ctrl+, (Windows) → Settings/Preferences
```

## Common Tasks

**Update web app:**
```bash
cd /workspaces/tbrea40
npm run build
npx cap sync android
# Then Cmd+R in Android Studio to rebuild
```

**Set up signing for first time:**
```bash
# Generate keystore (one-time)
keytool -genkey -v -keystore ~/android_keystore/tbreak.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias tbreak-key

# Copy to project
mkdir -p /workspaces/tbrea40/android/keystore
cp ~/android_keystore/tbreak.keystore /workspaces/tbrea40/android/keystore/

# Edit /workspaces/tbrea40/android/gradle.properties and add:
# TBREAK_KEYSTORE_PASSWORD=your_password
# TBREAK_KEY_PASSWORD=your_password
```

**Test on device:**
- Connect Android phone via USB
- Enable USB Debugging (Settings → Developer Options)
- In Android Studio: Run → Run 'app' → Select phone

**Build for Play Store:**
- Build → Generate Signed Bundle / APK
- Choose: Android App Bundle (AAB)
- Select keystore at: `/workspaces/tbrea40/android/keystore/tbreak.keystore`
- Enter your keystore password
- Build type: Release
- Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Status Check

✅ **Ready to go:**
- Web app built
- Assets synced to Android
- Firebase Messaging configured
- Service worker ready
- Offline support active
- Push notifications ready
- All TypeScript errors fixed

🚀 **Next step:** Open `/workspaces/tbrea40/android` in Android Studio!

## Need Help?

Read these guides for more details:
- `ANDROID_STUDIO_SETUP_GUIDE.md` ← Full step-by-step guide
- `ANDROID_STUDIO_CHECKLIST.md` ← Interactive checklist
- `ANDROID-BUILD-GUIDE.md` ← Build reference
- `android/README-RELEASE.md` ← Play Store submission guide

**All set! Good luck!** 🎉
