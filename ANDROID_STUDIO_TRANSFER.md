# How to Open & Build T-Break App in Android Studio

## Step 1: Prerequisites Check

Before opening Android Studio, verify you have:

```bash
# Check Java version (need Java 11 or higher)
java -version

# Check Android SDK installation
ls ~/Android/Sdk

# Check Gradle wrapper in project
ls android/gradlew
```

If missing Android SDK:
1. Open Android Studio → **Tools** → **SDK Manager**
2. Install:
   - **Android SDK Platform 35** (or latest)
   - **Android SDK Build-Tools 35.0.0**
   - **Android Emulator** (optional, for testing)
   - **Android SDK Platform-Tools**

## Step 2: Rebuild Web Assets

Always rebuild the web app before syncing to Android:

```bash
cd /workspaces/tbrea40

# Build React app
npm run build

# The build/ folder is now ready for Capacitor
```

## Step 3: Sync Web Assets to Android Project

Update the Capacitor web directory in the Android project:

```bash
npx cap sync android
```

This copies `build/` → `android/app/src/main/assets/public/`

## Step 4: Open in Android Studio

### Option A: From Command Line
```bash
# Open the Android project folder
open -a "Android Studio" /workspaces/tbrea40/android
```

### Option B: Using Android Studio UI
1. Open Android Studio
2. **File** → **Open...**
3. Navigate to: `/workspaces/tbrea40/android`
4. Click **Open**

Android Studio will:
- Index the project
- Download Gradle dependencies
- Build the project (this takes 2-3 minutes first time)

## Step 5: Configure Signing (Release Build)

To build a signed APK/AAB for Play Store submission:

### 5A: Set Up Gradle Signing Properties

```bash
cd /workspaces/tbrea40/android

# Copy the template file
cp gradle-signing.properties.template gradle.properties

# Edit gradle.properties and add your signing credentials
nano gradle.properties
```

Add to `gradle.properties`:
```properties
TBREAK_KEYSTORE_PASSWORD=your_keystore_password_here
TBREAK_KEY_PASSWORD=your_key_password_here
```

### 5B: Place Your Keystore File

Your keystore must be at: `android/keystore/tbreak.keystore`

If you haven't created a keystore yet:
```bash
mkdir -p android/keystore

# Generate keystore (one-time setup)
keytool -genkey -v -keystore android/keystore/tbreak.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias tbreak-key

# When prompted:
# - Keystore password: (your strong password)
# - Key password: (same or different)
# - Fill in your details (Company name, etc.)
```

**Save these passwords securely** — you'll need them for future updates!

## Step 6: Build in Android Studio

### Debug Build (for testing on device/emulator)

1. In Android Studio top menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete (watch the bottom status bar)
3. Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Build (for Play Store)

1. **Build** → **Generate Signed Bundle / APK**
2. Choose **Android App Bundle** (recommended for Play Store)
3. Select your keystore:
   - Keystore path: `android/keystore/tbreak.keystore`
   - Keystore password: (your password)
   - Key alias: `tbreak-key`
   - Key password: (your password)
4. Build type: **Release**
5. Click **Create**

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Step 7: Common Issues & Fixes

### Issue: "Gradle sync failed"
**Solution:**
```bash
# Clean Gradle cache
cd /workspaces/tbrea40/android
./gradlew clean

# Then in Android Studio: File → Sync Now
```

### Issue: "SDK Platform not installed"
**Solution:**
- Android Studio → **Tools** → **SDK Manager**
- Install the missing Android SDK version under "SDK Platforms" tab

### Issue: "Java version mismatch"
**Solution:**
- Android Studio → **Preferences** (Mac) / **Settings** (Windows/Linux)
- Search: "Project Structure"
- Set JDK to: Android Studio's bundled JDK (11+)

### Issue: Build takes forever
**Solution:** Increase Gradle heap in `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m
```

## Step 8: Test on Device/Emulator

### Connect Physical Device

1. Enable USB Debugging on Android device
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → USB Debugging → Enable
2. Connect via USB cable
3. In Android Studio:
   - **Run** → **Run 'app'**
   - Select your device from list
   - Click **Run**

### Use Android Emulator

1. Android Studio → **Tools** → **Device Manager**
2. Create a new virtual device or select existing
3. **Run** → **Run 'app'** → Select emulator

## Step 9: Play Store Submission

Once you have a signed AAB (Android App Bundle):

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select T-Break
3. **Release** → **Production**
4. Upload your `app-release.aab`
5. Fill in:
   - Release notes
   - Content rating questionnaire
   - App settings (privacy policy, etc.)
6. Review & submit for review (usually 24-48 hours)

See `ANDROID-BUILD-GUIDE.md` for detailed Play Store setup.

## Quick Reference Commands

```bash
# Build and sync from command line
cd /workspaces/tbrea40
npm run build                    # Build React web app
npx cap sync android             # Sync to Android

# Build APK from command line (if you prefer not to use Studio UI)
cd android
./gradlew assembleDebug          # Build debug APK
./gradlew bundleRelease          # Build release AAB

# Check build outputs
ls android/app/build/outputs/
```

## Project Structure

```
/workspaces/tbrea40/
├── build/                          ← React app build (synced to Android)
├── src/                            ← React/TypeScript source
│   └── services/offline.ts        ← Offline support
├── android/                        ← Android native project (open this in Studio)
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       └── assets/public/  ← Synced web files
│   │   └── build.gradle
│   ├── keystore/
│   │   └── tbreak.keystore        ← Your signing key
│   ├── gradle-signing.properties.template
│   ├── gradle.properties           ← Your signing credentials
│   └── gradlew
└── capacitor.config.json           ← Capacitor configuration
```

## Next Steps

1. ✅ Rebuild web: `npm run build`
2. ✅ Sync to Android: `npx cap sync android`
3. ✅ Open in Studio: File → Open → `/workspaces/tbrea40/android`
4. ✅ Create keystore (if needed): `keytool` command above
5. ✅ Add signing credentials to `gradle.properties`
6. ✅ Build: **Build** → **Generate Signed Bundle / APK**
7. ✅ Test on device or emulator
8. ✅ Submit AAB to Play Store

**Questions?** Check `ANDROID-BUILD-GUIDE.md` or `android/README-RELEASE.md` for detailed guides.
