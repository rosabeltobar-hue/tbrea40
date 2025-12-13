# T-Break Android App: Build & Release Workflow

Quick reference for building and publishing the Android app to Google Play Store.

## TL;DR (Quick Steps)

### 1. Prepare locally (one-time)

```bash
# Generate signing key (run on your machine, not in container)
keytool -genkeypair -v \
  -keystore tbreak.keystore \
  -alias tbreakkey \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -keypass myKeyPass \
  -storepass myStorePass

# Move keystore into project
mv tbreak.keystore android/keystore/

# Add passwords to ~/.gradle/gradle.properties (macOS/Linux)
# or C:\Users\YourUser\.gradle\gradle.properties (Windows)
# Add these lines:
#   TBREAK_KEYSTORE_PASSWORD=myStorePass
#   TBREAK_KEY_PASSWORD=myKeyPass

# Place google-services.json from Firebase into android/app/
cp ~/Downloads/google-services.json android/app/
```

### 2. Build (repeat for each release)

```bash
# From project root
npm run build
npx cap copy android
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### 3. Upload to Play Store

- Go to Google Play Console → Release → Production
- Upload `app-release.aab`
- Submit for review

---

## Detailed Setup

See `android/README-RELEASE.md` for:
- Firebase configuration
- Keystore generation
- Gradle signing setup
- Play Store setup
- Submission checklist

---

## Environment Setup

### Install Android SDK & Tools (on your machine)

**macOS (with Homebrew):**
```bash
brew install openjdk@11
brew install --cask android-studio
```

**Windows:**
- Download [Android Studio](https://developer.android.com/studio)
- During installation, ensure you install:
  - Android SDK (API 30+)
  - Android SDK Build-Tools
  - Android Emulator

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-11-jdk-headless
# Download Android Studio from https://developer.android.com/studio
```

### Set Environment Variables (optional, for CLI builds)

**macOS/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
```

**Windows:**
- System Properties → Environment Variables
- Add `ANDROID_SDK_ROOT` = `C:\Users\YourUser\AppData\Local\Android\Sdk`
- Add `ANDROID_HOME` (same as above)

---

## Build Process

### Prerequisites

1. ✅ Web build: `npm run build` (creates `build/` folder with optimized assets)
2. ✅ Firebase config: `android/app/google-services.json`
3. ✅ Signing key: `android/keystore/tbreak.keystore`
4. ✅ Signing passwords: in `~/.gradle/gradle.properties` or `android/gradle.properties`

### Build Commands

```bash
# Full workflow from project root
npm run build                    # Build React web app
npx cap copy android            # Copy web assets to Android
cd android
./gradlew bundleRelease         # Build Android App Bundle (release)

# Output location
# android/app/build/outputs/bundle/release/app-release.aab
```

### Build with Android Studio GUI

1. Open Android Studio
2. Open `android/` folder as a project
3. Let Gradle sync (may download dependencies)
4. Build → Build Bundle(s) / APK(s) → Build Bundle(s)
5. Select "release" variant
6. Find AAB in `app/build/outputs/bundle/release/app-release.aab`

### Troubleshooting Builds

**Gradle sync fails:**
- File → Sync Now
- Check Java version: `java -version` (should be 11+)
- Increase heap: add `org.gradle.jvmargs=-Xmx4096m` to `gradle.properties`

**Missing google-services.json:**
- Download from Firebase Console → Project Settings → Android app
- Place at `android/app/google-services.json`

**Signing key not found:**
- Ensure `android/keystore/tbreak.keystore` exists
- Ensure passwords are in `~/.gradle/gradle.properties` (macOS/Linux) or `C:\Users\YourUser\.gradle\gradle.properties` (Windows)

**OutOfMemory during build:**
Add to `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m
```

---

## Release to Play Store

### Prerequisites

1. Google Play Developer Account ($25 one-time)
2. App signed with release keystore (see above)
3. Completed Play Store listing (description, screenshots, icons, privacy policy)

### Steps

1. **Create Play Store app** (one-time)
   - Go to https://play.google.com/console
   - Click Create app
   - Fill app name, language, category

2. **Complete store listing**
   - Short description
   - Full description
   - App icon (512×512)
   - Screenshots (2+ per device type)
   - Feature graphic
   - Content rating
   - Privacy policy URL

3. **Test with Internal Testing** (recommended)
   - Go to Release → Internal testing
   - Create release with AAB
   - Add tester Google accounts
   - Download and test on real device
   - Verify push notifications, login, donation flow

4. **Release to Production**
   - Go to Release → Production
   - Create release
   - Upload AAB (`app-release.aab`)
   - Review release notes
   - Click "Review release" then "Start rollout"

5. **Monitor review**
   - Google usually reviews within 2–6 hours
   - Check Policy Status for any issues
   - App goes live after approval

---

## Version Management

For each update, increment version code in `android/app/build.gradle`:

```gradle
android {
  defaultConfig {
    versionCode 2        // increment this (1, 2, 3, ...)
    versionName "1.1.0"  // user-facing version
  }
}
```

Then rebuild:
```bash
npm run build
npx cap copy android
cd android
./gradlew bundleRelease
```

---

## Code Update Workflow

When you update the React app code:

```bash
# From project root
git add .
git commit -m "feat: add feature X"

# Rebuild
npm run build
npx cap copy android

# Increment version
# (edit android/app/build.gradle: versionCode++)

# Build release AAB
cd android
./gradlew bundleRelease

# Upload to Play Store
# (manual in Play Console)
```

---

## Useful Links

- [Android App Bundle](https://developer.android.com/guide/app-bundle)
- [Google Play Console](https://play.google.com/console)
- [Firebase Setup for Android](https://firebase.google.com/docs/android/setup)
- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Studio Docs](https://developer.android.com/studio/intro)

---

## Checklist: Ready to Release

- [ ] Web build created (`npm run build`)
- [ ] Web assets synced (`npx cap copy android`)
- [ ] `google-services.json` in `android/app/`
- [ ] `tbreak.keystore` in `android/keystore/`
- [ ] Signing passwords in `~/.gradle/gradle.properties`
- [ ] App tested on real Android device
- [ ] Store listing complete
- [ ] Privacy policy URL set
- [ ] AAB built successfully (`./gradlew bundleRelease`)
- [ ] Internal testing passed
- [ ] Ready to submit to Play Store

---

## Support

For issues, see `android/README-RELEASE.md` for detailed setup and troubleshooting.
