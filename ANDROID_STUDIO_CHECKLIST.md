# Android Studio Setup Checklist

## ✅ Pre-Transfer Checklist (Already Completed!)

- [x] Web app built: `npm run build` ✓
- [x] Web assets synced to Android: `npx cap sync android` ✓
- [x] Capacitor plugins updated ✓
- [x] Firebase Messaging plugin configured ✓

## 📋 Now Open in Android Studio

### On Your Computer:

1. **Open Android Studio**
   - If you already have it open, go to: **File** → **Open...**
   - Navigate to: `/workspaces/tbrea40/android`
   - Click **Open**

2. **Wait for Gradle Sync**
   - Android Studio will automatically:
     - Index the project
     - Resolve dependencies
     - Build Gradle (takes 2-3 min first time)
   - You'll see "Sync Now" if Gradle is out of date - click it
   - Watch the bottom status bar until "Gradle build finished"

3. **Verify Android SDK**
   - If you see SDK warnings:
     - **Tools** → **SDK Manager**
     - Install Android SDK Platform 35 (or latest)
     - Install Android SDK Build-Tools 35.0.0
     - Click **OK**

## 🔑 Set Up Signing (For Release Build)

Only needed if you want to build for Play Store:

1. **Generate a Keystore** (one-time, if you don't have one):
   ```bash
   # Run this in your terminal:
   keytool -genkey -v -keystore ~/android_keystore/tbreak.keystore \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias tbreak-key
   
   # Copy it to the project:
   mkdir -p /workspaces/tbrea40/android/keystore
   cp ~/android_keystore/tbreak.keystore /workspaces/tbrea40/android/keystore/
   ```

2. **Add Credentials to gradle.properties**:
   - Open: `/workspaces/tbrea40/android/gradle.properties` (in any text editor)
   - Add these lines:
     ```properties
     TBREAK_KEYSTORE_PASSWORD=your_keystore_password
     TBREAK_KEY_PASSWORD=your_key_password
     ```
   - **Save the file**

## 🏗️ Build APK/AAB in Android Studio

### Debug Build (for testing):
1. Top menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for completion (watch bottom status bar)
3. Output file: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Build (for Play Store):
1. Top menu: **Build** → **Generate Signed Bundle / APK**
2. Choose:
   - **Android App Bundle** (AAB)
   - Keystore path: `android/keystore/tbreak.keystore`
   - Keystore password: (your password)
   - Key alias: `tbreak-key`
   - Key password: (your password)
   - Build type: **Release**
3. Click **Create**
4. Output file: `android/app/build/outputs/bundle/release/app-release.aab`

## 📱 Test on Device or Emulator

### Physical Device:
1. Connect Android phone via USB
2. Enable USB Debugging on phone:
   - Settings → About Phone → Tap "Build Number" 7x
   - Settings → Developer Options → USB Debugging → ON
3. In Android Studio:
   - **Run** → **Run 'app'**
   - Select your phone from the device list
   - Click **Run**

### Emulator:
1. Android Studio → **Tools** → **Device Manager**
2. Click **Create Device** (or use existing)
3. **Run** → **Run 'app'** → Select emulator

## 🎯 Expected Structure After Sync

You should see in Android Studio:
```
app/
├── build/
├── src/
│   ├── androidTest/
│   ├── test/
│   └── main/
│       ├── AndroidManifest.xml
│       ├── assets/
│       │   └── public/              ← Your React app here!
│       │       ├── index.html
│       │       ├── static/
│       │       │   ├── css/
│       │       │   └── js/
│       │       └── service-worker.js
│       └── java/com/tbreak/app/
└── build.gradle
```

## ⚠️ Common Fixes

**"Gradle sync failed"?**
```bash
cd /workspaces/tbrea40/android
./gradlew clean
```
Then in Android Studio: **File** → **Sync Now**

**"Java version mismatch"?**
- Android Studio → **Settings** (or **Preferences** on Mac)
- Search: "Project Structure"
- Set JDK to Android Studio's bundled JDK

**"Platform 35 not found"?**
- **Tools** → **SDK Manager**
- Under "SDK Platforms" tab, install Android 14 or 15 (latest)

## 📚 Full Documentation

For detailed guides, read these files:
- `ANDROID_STUDIO_TRANSFER.md` — This full guide
- `ANDROID-BUILD-GUIDE.md` — Quick build reference
- `android/README-RELEASE.md` — Detailed Play Store submission

## Next Steps

1. ✅ Open `/workspaces/tbrea40/android` in Android Studio
2. ✅ Wait for Gradle sync to complete
3. ✅ Set up signing credentials in `gradle.properties`
4. ✅ Build → **Generate Signed Bundle / APK**
5. ✅ Test on device/emulator
6. ✅ Submit AAB to Google Play Console

**You're all set!** Your app is ready to transfer to Android Studio. 🚀
