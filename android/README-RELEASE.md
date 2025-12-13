# Android Release Guide for Google Play Store

This guide walks you through building and publishing the T-Break app to Google Play Store.

## Prerequisites

- Android Studio installed (macOS, Windows, or Linux)
- Java JDK 11+ installed
- Google Play Developer Account ($25 one-time fee) — sign up at https://play.google.com/console
- Firebase project with Android app configured

## Step 1: Firebase Configuration

### Add Android App to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your T-Break project
3. Go to **Project Settings** → **Your apps** → **Add app** (Android icon)
4. Register Android app:
   - Package name: `com.tbreak.app` (must match `capacitor.config.json`)
   - App nickname: `T-Break Android`
   - SHA-1 certificate fingerprint (optional but recommended for authentication)
5. Click "Register app"
6. Download `google-services.json`
7. **Place `google-services.json` in this folder** (`android/app/google-services.json`)

The `google-services.json` file contains Firebase credentials (API keys, project ID, etc.) and is required for:
- Firebase Authentication
- Cloud Firestore
- Cloud Messaging (FCM) for push notifications

**Important:** `google-services.json` should NOT be committed to git if it contains sensitive data. Add to `.gitignore`:
```
android/app/google-services.json
```

## Step 2: Generate App Signing Key

The keystore file (`tbreak.keystore`) is used to sign your APK/AAB. **Keep it safe** — you'll need it to upload future updates to Play Store.

### Generate keystore locally (on your machine)

Run this command on your local machine (macOS/Linux/Windows):

```bash
keytool -genkeypair -v \
  -keystore tbreak.keystore \
  -alias tbreakkey \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -keypass your_key_password \
  -storepass your_store_password
```

**Replace:**
- `your_key_password` — password for the key (remember this)
- `your_store_password` — password for the keystore (remember this)

**Example (with example passwords):**
```bash
keytool -genkeypair -v \
  -keystore tbreak.keystore \
  -alias tbreakkey \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -keypass myKeyPass123 \
  -storepass myStorePass456
```

### Move keystore to project

After generating, move or copy `tbreak.keystore` to:
```
android/keystore/tbreak.keystore
```

```bash
mkdir -p android/keystore
# macOS/Linux: move the keystore
mv tbreak.keystore android/keystore/

# Windows: copy to the folder
# copy tbreak.keystore android\keystore\
```

**Keep the keystore file safe.** You'll use it to sign all future versions of your app on Play Store.

## Step 3: Configure Gradle Signing

Passwords should NOT be committed to source control. Store them in `~/.gradle/gradle.properties` (user-level):

### On macOS/Linux:

```bash
# Create or edit ~/.gradle/gradle.properties
nano ~/.gradle/gradle.properties
```

Add:
```properties
TBREAK_KEYSTORE_PASSWORD=your_store_password
TBREAK_KEY_PASSWORD=your_key_password
```

### On Windows:

Create or edit: `C:\Users\YourUsername\.gradle\gradle.properties`

Add the same lines:
```properties
TBREAK_KEYSTORE_PASSWORD=your_store_password
TBREAK_KEY_PASSWORD=your_key_password
```

### Or use project-level gradle.properties (less secure):

If you prefer to store passwords in the project (not recommended for public repos), add to `android/gradle.properties`:

```properties
TBREAK_KEYSTORE_PASSWORD=your_store_password
TBREAK_KEY_PASSWORD=your_key_password
```

Then add `android/gradle.properties` to `.gitignore`.

## Step 4: Build the Android App Bundle (AAB)

The AAB format is required for Google Play Store publishing (newer format than APK).

### Sync web assets and build

From the project root:

```bash
# Build the React web app
npm run build

# Copy web assets to Android
npx cap copy android

# Build the Android App Bundle (release variant)
cd android
./gradlew bundleRelease
```

If successful, the AAB will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Troubleshooting build errors

- **Gradle sync fails:** Click "Sync Now" in Android Studio and let it download dependencies.
- **Missing keystore:** Ensure `android/keystore/tbreak.keystore` exists and passwords are in `~/.gradle/gradle.properties`.
- **Out of memory:** Add to `gradle.properties`:
  ```properties
  org.gradle.jvmargs=-Xmx4096m
  ```

## Step 5: Create App on Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - **App name:** T-Break
   - **Default language:** English
   - **App or game:** App
   - **Free or paid:** Free
4. Click **Create app**

## Step 6: Fill App Store Listing

In Play Console, go to **Store listing** and fill in:

- **Short description** (80 chars max):
  ```
  A T-break companion app with daily check-ins, metabolite tracking, and community support.
  ```

- **Full description** (4000 chars max):
  ```
  T-Break is your personal T-break companion app.
  
  Features:
  • Daily check-in tracker
  • Cannabis metabolite clearance estimator
  • Mood and symptom tracking
  • Community chat with other T-breakers
  • Gamification (coins, streaks, achievements)
  • Donation support for development
  
  Privacy first. No ads. 100% optional donations.
  ```

- **App icon** (512×512 PNG)
- **Feature graphic** (1024×500 PNG)
- **Screenshots:** Provide at least 2 phone screenshots (min 1080×1920)
  - Recommended: home, daily checkin, chat, profile screens
- **Video URL** (optional)

- **Content rating:**
  - Go to **Content rating** → **Questionnaire**
  - Answer questions about content (e.g., no violence, no adult content)
  - Get content rating
  
- **Target audience:**
  - Minimum age: 18+ (cannabis-related app)
  
- **Privacy policy:** Link to your privacy policy URL
  - If you don't have one, create a simple page (required for app review)

- **Support email:** e.g., support@tbreak.app

## Step 7: Upload AAB and Configure Release

In Play Console, go to **Release** → **Production** (or **Internal testing** first):

1. Click **Create new release**
2. Click **Upload** next to "Android App Bundle"
3. Select your `app-release.aab` (from `android/app/build/outputs/bundle/release/`)
4. Wait for signing and validation
5. Review the app version and release notes
6. Click **Save** and then **Review release**

### Test with Internal Testing first (recommended)

1. Go to **Release** → **Internal testing**
2. Create a release with your AAB
3. Add testers' Google accounts
4. Testers download via link and test on real devices
5. Verify all features work (login, donations, chat, FCM notifications, etc.)
6. Once verified, promote to Production

## Step 8: Submit for Review

After filling store listing and uploading AAB:

1. In Play Console, go to **Release** → **Production**
2. Click **Review release**
3. Confirm all details
4. Click **Start rollout to Production**

Google will review your app (usually 2–6 hours, occasionally longer).

### Common rejection reasons
- Missing privacy policy
- App crashes on launch
- Misleading description
- Permission misuse
- Outdated content or broken features

Check **Policy status** and **App content** to review any feedback.

## Step 9: Monitor and Update

After approval, your app is live on Play Store!

### Monitor performance
- Go to **Statistics** → **Overview** for downloads, install rate, crash reports
- Check **Crashes & ANRs** to fix stability issues
- Use **User reviews** to gather feedback

### Release updates
- Update version code in `android/app/build.gradle`
- Rebuild AAB: `./gradlew bundleRelease`
- Upload new AAB in Play Console
- Write release notes and submit

Example version update in `android/app/build.gradle`:
```gradle
android {
  defaultConfig {
    versionCode 2  // increment this for each release
    versionName "1.1.0"
  }
}
```

## Useful Commands

```bash
# Full build + release process from project root
npm run build
npx cap copy android
cd android
./gradlew bundleRelease

# Clean build (if you have issues)
cd android
./gradlew clean bundleRelease

# View build output
cd android
./gradlew bundleRelease --info

# Open Android Studio for GUI configuration
# (from project root)
npx cap open android
```

## Checklist Before Submission

- [ ] `google-services.json` in `android/app/`
- [ ] `tbreak.keystore` in `android/keystore/`
- [ ] Signing passwords in `~/.gradle/gradle.properties`
- [ ] AAB built successfully
- [ ] App tested on real Android device or emulator
- [ ] Firebase setup complete (Authentication, Firestore, FCM)
- [ ] Store listing complete (description, screenshots, icons)
- [ ] Privacy policy URL set
- [ ] Support email configured
- [ ] Internal testing passed
- [ ] Ready to submit for review

## Support

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)
- [Firebase Setup Docs](https://firebase.google.com/docs/android/setup)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
