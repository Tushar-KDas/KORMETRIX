# WorkForce 360 — Mobile Application Build & Release Guide

WorkForce 360 Employee Self-Service Mobile Application is built with **Flutter 3.50+** and **Dart 3.14+**, supporting Android and iOS. This guide provides step-by-step instructions for assembling debug APKs, signing release APKs and App Bundles (AAB) for the Google Play Store, and configuring iOS Xcode builds.

---

## 1. Prerequisites

- **Flutter SDK**: `>= 3.27.0` (Recommended: `3.50.0`)
- **Dart SDK**: `>= 3.14.0`
- **Java Development Kit**: JDK 17 (e.g., Microsoft OpenJDK 17 or Eclipse Temurin 17)
- **Android SDK**: Build Tools `35.0.0`, Platform `android-35`, NDK configured
- **macOS & Xcode** (for iOS builds only): Xcode 15+ with Command Line Tools and CocoaPods

### Environment Variables
Ensure the following variables are present in your shell:

```bash
# Android & Java
export JAVA_HOME="/path/to/jdk-17"
export ANDROID_HOME="/path/to/android-sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

# Windows SSL Truststore (if behind enterprise proxy or missing certs)
export JAVA_TOOL_OPTIONS="-Djavax.net.ssl.trustStoreType=WINDOWS-ROOT"
```

---

## 2. Dependency Installation & Verification

From the monorepo root or the `apps/mobile` directory:

```bash
cd apps/mobile

# Fetch all Flutter & Dart dependencies
flutter pub get

# Run static analysis
flutter analyze

# Execute automated widget and unit tests
flutter test
```

Expected test results:
- `Authentication & Login Flow Test`: **PASSED**
- `Dashboard Widgets & Quick Actions Test`: **PASSED**
- `Attendance Screen & Geofencing UI Test`: **PASSED**

---

## 3. Android Build Guide

### A. Debug APK Build
Use the debug APK for local testing, QA verification, and internal device distribution:

```bash
flutter build apk --debug
```

- Output path: `apps/mobile/build/app/outputs/flutter-apk/app-debug.apk`
- Features enabled: Development logs, hot reload support, mock geofence toggle.

### B. Release Keystore Generation
For production distribution on Google Play Store or enterprise MDM, generate a Java KeyStore:

```bash
keytool -genkey -v -keystore apps/mobile/android/app/workforce360-release.keystore \
  -alias workforce360 -keyalg RSA -keysize 2048 -validity 10000
```

Create `apps/mobile/android/key.properties` (this file is excluded from Git in `.gitignore`):

```properties
storePassword=YourKeystorePasswordHere
keyPassword=YourKeyPasswordHere
keyAlias=workforce360
storeFile=workforce360-release.keystore
```

### C. Release APK Build
Assemble a standalone, optimized release APK:

```bash
flutter build apk --release --split-per-abi
```

Generated outputs:
- `app-arm64-v8a-release.apk` (Optimized for modern 64-bit devices)
- `app-armeabi-v7a-release.apk` (32-bit compatibility)
- `app-x86_64-release.apk` (Chromebook / Emulator compatibility)

### D. Google Play Store App Bundle (AAB)
Google Play requires `.aab` format for publishing:

```bash
flutter build appbundle --release
```

- Output path: `apps/mobile/build/app/outputs/bundle/release/app-release.aab`
- Upload this `.aab` file directly to the **Google Play Console** -> Production / Internal Testing track.

---

## 4. iOS Build Guide (macOS)

### A. CocoaPods Setup
```bash
cd apps/mobile/ios
pod repo update
pod install
cd ..
```

### B. Xcode Configuration
1. Open `apps/mobile/ios/Runner.xcworkspace` in Xcode.
2. Select the `Runner` target.
3. Under **Signing & Capabilities**:
   - Set **Team** to your Apple Developer Account.
   - Set **Bundle Identifier** to `com.workforce360.mobile`.
   - Ensure the following capabilities are active:
     - *Push Notifications*
     - *Background Modes* (Background fetch, Remote notifications)
     - *Location When In Use*

### C. Build IPA for TestFlight
```bash
flutter build ipa --release --export-options-plist=ios/ExportOptions.plist
```

Output path: `apps/mobile/build/ios/ipa/WorkForce360.ipa`

---

## 5. Mobile Runtime & Feature Configurations

The mobile application pulls dynamic branding, feature flags, and geofence tolerances via the **Remote Configuration Engine** on startup:

- **Offline Mode**: If the employee is in an area with poor connectivity, punches are queued in local SQLite (`drift`) with cryptographic device timestamps. Upon reconnection, punches are synchronized with the Supabase backend.
- **Geofence Check**: Mobile queries the device's native GPS API. Coordinates are sent to the `record_attendance_punch` RPC stored procedure, which computes the Haversine distance against authorized branch boundaries.
- **Device Attestation**: Device hardware UUID, OS version, and network status are registered to prevent buddy punching and unauthorized device cloning.
