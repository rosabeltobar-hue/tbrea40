# Opening T-Break App in Android Studio - Step by Step

## What's Already Done ✅

Your app has been prepared for Android Studio:
- ✅ React web app built to `build/` folder
- ✅ Web assets synced to `android/app/src/main/assets/public/`
- ✅ Service worker included for offline support
- ✅ Capacitor plugins configured (Firebase Cloud Messaging)
- ✅ Signing template ready at `android/gradle-signing.properties.template`

## Step-by-Step Instructions

### Step 1: Launch Android Studio on Your Computer

```
1. Open Android Studio application
2. You should see a Welcome screen
3. Look for one of these options:
   - "Open Project"
   - "File" menu → "Open"
```

### Step 2: Open the Android Project Folder

**Via Menu:**
```
File → Open...
↓
Navigate to: /workspaces/tbrea40/android
↓
Click "Open"
```

**On Mac via Terminal:**
```bash
open -a "Android Studio" /workspaces/tbrea40/android
```

**On Windows via Terminal:**
```bash
start "C:\Program Files\Android\Android Studio\bin\studio.exe" /workspaces/tbrea40/android
```

### Step 3: Wait for Gradle Sync

After opening, Android Studio will automatically:
- **Scan the project files**
- **Download Gradle dependencies** (takes 1-3 minutes on first open)
- **Index the codebase**
- **Resolve plugins and libraries**

**What to expect:**
- Bottom status bar shows: "Gradle build finished"
- Yellow banner may appear: "Sync Now" — click it if you see this
- Once complete, the project tree on the left side becomes interactive

### Step 4: Verify Project Structure

In the left panel, you should see:

```
T-Break (or "android" project name)
├── app
│   ├── manifests
│   │   └── AndroidManifest.xml
│   ├── kotlin+java
│   │   └── com
│   │       └── tbreak
│   │           └── app
│   │               └── MainActivity.kt
│   ├── res
│   │   ├── drawable
│   │   ├── layout
│   │   └── values
│   └── assets
│       └── public (← Your React app here!)
│           ├── index.html
│           ├── service-worker.js
│           └── static/
├── gradle
├── build.gradle
├── settings.gradle
└── gradlew
```

### Step 5: Verify Android SDK Setup

**If you see red errors or warnings:**

1. **Tools** → **SDK Manager**
2. Go to **SDK Platforms** tab
3. Check the box for **Android 14** or **Android 15** (latest)
4. Click **Apply** and **OK**
5. Wait for download to complete

**Expected installed items:**
- ✅ Android SDK Platform 35 (or similar)
- ✅ Android SDK Build-Tools 35.0.0
- ✅ Android Emulator (optional)
- ✅ Android SDK Platform-Tools

### Step 6 (Optional): Set Up Signing for Release Build

Only do this if you want to build for Play Store.

**6A: Create a Keystore (One-Time Setup)**

Open Terminal on your computer and run:

```bash
# Create directory
mkdir -p ~/android_keystore

# Generate keystore (answer the prompts)
keytool -genkey -v -keystore ~/android_keystore/tbreak.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias tbreak-key
```

**When prompted, enter:**
```
Keystore password: [create a strong password - SAVE IT!]
Confirm password: [same password]
First and last name: [Your Name]
Organizational unit: [e.g., Development]
Organization: [e.g., T-Break]
City: [Your City]
State: [Your State]
Country: [US, GB, etc.]
Key password: [same as keystore or different - SAVE IT!]
```

**6B: Copy Keystore to Project**

```bash
# Copy your keystore to the project
mkdir -p /workspaces/tbrea40/android/keystore
cp ~/android_keystore/tbreak.keystore /workspaces/tbrea40/android/keystore/
```

**6C: Add Credentials to gradle.properties**

In Android Studio OR any text editor:
1. Open: `/workspaces/tbrea40/android/gradle.properties`
2. Add these lines at the end:
   ```properties
   TBREAK_KEYSTORE_PASSWORD=your_keystore_password_here
   TBREAK_KEY_PASSWORD=your_key_password_here
   ```
3. **Save the file**
4. In Android Studio: **File** → **Sync Now**

### Step 7: Build the App

#### For Debug (Testing):

1. Top menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. You'll see a notification: "Build Successful"
4. Output location: `android/app/build/outputs/apk/debug/app-debug.apk`

#### For Release (Play Store):

1. Top menu: **Build** → **Generate Signed Bundle / APK**
2. Choose:
   - **Android App Bundle** (AAB) - recommended
   - OR **APK** - for direct installation
3. Click **Next**
4. **Keystore selection:**
   - Path: `android/keystore/tbreak.keystore`
   - Keystore password: (your password)
   - Alias: `tbreak-key`
   - Key password: (your password)
5. Click **Next**
6. **Signing versions:**
   - Check: **V2 (Full APK Signature Scheme)**
   - Build type: **Release**
7. Click **Create**
8. Output location: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 8: Test on Device or Emulator

#### Option A: Real Device (Recommended)

1. **Connect your Android phone via USB cable**

2. **Enable USB Debugging on your phone:**
   - Settings → About Phone
   - Tap "Build Number" 7 times (until it says "You are a developer")
   - Settings → Developer Options
   - Enable "USB Debugging"

3. **In Android Studio:**
   - **Run** → **Run 'app'**
   - Select your phone from the "Available devices" list
   - Click **Run**
   - App will install and launch on your phone!

#### Option B: Android Emulator

1. **Create or select an emulator:**
   - Android Studio → **Tools** → **Device Manager**
   - Click **Create Device** (or use existing)
   - Choose a device (e.g., Pixel 7)
   - Choose Android version (e.g., 14 or 15)
   - Click **Finish**

2. **Run the app:**
   - **Run** → **Run 'app'**
   - Select your emulator from the list
   - Click **Run**
   - App will launch in the emulator!

### Step 9: What to Expect When Running

When you run the app, you should see:

1. **Gradle build** (if first time)
2. **App installs** on device
3. **Splash screen** appears (or Android default)
4. **T-Break app loads** with:
   - Dashboard page
   - Navigation menu
   - All your React pages working
   - Offline support active
   - Push notifications ready

### Step 10: Submit to Play Store (When Ready)

1. Build a signed release APK/AAB (see Step 7)
2. Go to [Google Play Console](https://play.google.com/console)
3. Create app or select T-Break
4. **Release** → **Production**
5. Upload your `.aab` file
6. Fill in release notes, content rating, etc.
7. Submit for review

See `android/README-RELEASE.md` for detailed Play Store setup.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Gradle sync stuck** | File → Sync Now; if still stuck: `cd android && ./gradlew clean` |
| **"SDK Platform 35 not found"** | Tools → SDK Manager → Install Android SDK Platform 35 |
| **"Java version mismatch"** | Settings → Project Structure → Set JDK to Android Studio's bundled JDK |
| **"USB device not recognized"** | Enable USB Debugging in phone Settings → Developer Options |
| **Build fails** | Bottom panel shows error → scroll to see full error message → Google the error |
| **Emulator too slow** | In Device Manager, increase RAM allocation; use real device if possible |

## File Locations Reference

```
Your Computer:
- Project folder: /workspaces/tbrea40/
- Android folder: /workspaces/tbrea40/android/
- Web app: /workspaces/tbrea40/build/
- Web assets in Android: /workspaces/tbrea40/android/app/src/main/assets/public/

Keystore:
- Keystore file: /workspaces/tbrea40/android/keystore/tbreak.keystore
- Gradle credentials: /workspaces/tbrea40/android/gradle.properties
```

## Commands Reference

```bash
# Rebuild web app
cd /workspaces/tbrea40 && npm run build

# Sync to Android
npx cap sync android

# Clean Gradle cache
cd android && ./gradlew clean

# Build APK from command line
cd android
./gradlew assembleDebug      # Debug APK
./gradlew bundleRelease      # Release AAB

# Check build outputs
ls android/app/build/outputs/
```

## You're All Set! 🎉

Your T-Break app is ready to open in Android Studio. Just open the `/workspaces/tbrea40/android` folder and let Gradle do the heavy lifting.

**Questions?** Check these files:
- `ANDROID_STUDIO_CHECKLIST.md` — Simplified checklist
- `ANDROID-BUILD-GUIDE.md` — Quick reference
- `android/README-RELEASE.md` — Detailed Play Store guide
