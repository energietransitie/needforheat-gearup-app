# Android development
This Android-specific development guide will explain how to setup an environment to develop the Android app. Including important things to look out for to ensure the app can be built.

## Table of contents
- [1. Prerequisites](#1-prerequisites)
- [2. Preparing a physical device](#2-preparing-a-physical-device)
- [3. Starting the app with Expo Go](#3-starting-the-app-with-expo-go)
- [4. Compiling an APK for testing](#4-compiling-an-apk-for-testing)

## 1. Prerequisites
You should have read the [main developing guide](./developing.md) before looking into the Android guide.

When developing for Android you need to have [Android Studio](https://developer.android.com/studio) installed and updated. \
You should still check for updates after installing by opening the menu `Help` and then `Check for updates`. This menu might be under a burger-menu.

You should read the [Expo documentation on Android Studio](https://docs.expo.io/workflow/android-studio-emulator/) as it explains how to set it up for development. Including how to setup an Android Emulator and how to add the platform-tools (including [Android Debug Bridge (ADB)](https://developer.android.com/tools/adb)) to the OS environment.

It is IMPORTANT that `ANDROID_HOME` gets set to the Android SDK folder.

### 1.1. Secure Folder issue
Attempting to run Expo Go will crash due to a bug in Expo. ADB attempts to install the development app to all users, including the Secure Folder (User 150) on Samsung devices. This has not been accounted for yet.

To fix this, do the workaround as explained in: <https://github.com/expo/expo/issues/22473#issuecomment-1546718389>

## 2. Preparing a physical device
If you followed the [Expo documentation on Android Studio](https://docs.expo.io/workflow/android-studio-emulator/). You should have an Android emulator ready for development. However, it is recommended to use a real Android device due to performance and [Emulator limitations](#emulator-limitations).

The first step is to enable [Developer Options](https://developer.android.com/studio/debug/dev-options) on the device. Then you have two options to connect the device to the PC:

- **Wired with USB**: Enable USB-Debugging and allow the fingerprint for your PC.
- **Over WiFi**: Use the [Command-line tool](https://developer.android.com/tools/adb#wireless-android11-command-line) (Recommendend) or with [Android Studio](https://developer.android.com/tools/adb#connect-to-a-device-over-wi-fi).

With ADB ready, you can now send the app straight to your device for development.

## 3. Starting the app with Expo Go
After getting the prerequisites installed you can start the development server with the following command:

```bash
yarn workspace app dev:android
```

This will ask you to select a device or emulator to run the app on. It is recommended for developing that you select a [physical device connected with ADB](#preparing-a-physical-device) because of the limitations of the emulator.

The development app should build and automatically install using Expo Go and Metro. Changes you do to the code will automatically be reflected in the app.

As explained in the [main developing guide](./developing.md), you should not rely on Expo Go for development. You should [compile the APK](#compiling-an-apk-for-testing) and install it for the most genuine experience.

### 3.1. Emulator Limitations
The following hardware is unavailable in Simulator:

- Audio Input
- Barometer
- Camera
- Motion Support (accelerometer and gyroscope)

This means that specificly testing the `NeedForHeat` app that the emulator isn't of any use because the camera is needed to detect the QR code.

## 4. Compiling an APK for testing
There are [Yarn scripts](./scripts.md) that can do this for you if you set everything up properly including [adding platform-tools](https://developer.android.com/tools/adb) to `PATH`.
<br><br>

In the `apps\expo\android\` folder, run the following command in a Terminal window to build an APK:

>***Note*** You might need to add `./` in front of the command like `./gradlew` to get it to run 

```bash
gradlew app:assembleRelease 
```
Note that `app:` is required for Gradle to build properly.

Running the following command will build a development app that relies on a development server from Expo Go:

```bash
gradlew app:assembleDebug 
```

You can still use this, but you need to run the development server with:

```bash
yarn workspace app dev
```

The app gets built to the `apps\expo\android\app\build\outputs\apk` folder in either the `debug` or `release` folder.

### 4.1. Installing the app
You can then use the following ADB command from the [platform-tools](https://developer.android.com/tools/adb) to install the release APK to ***all*** ADB-connected devices:

```bash
adb install app-release.apk 
```

The ADB-connected can either be a running emulator or a physical device. Of course, it is possible to send this APK to anyone else to install manually.
