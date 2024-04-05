# iOS development
This iOS-specific development guide will explain how to setup an environment to develop the iOS app. Including important things to look out for to ensure the app can be built.

## Table of contents
- [1. Prerequisites](#1-prerequisites)
- [2. Simulator with Expo Go](#2-simulator-with-expo-go)
- [3. Physical device](#3-physical-device)
  - [3.1. Expo Go version](#31-expo-go-version)
  - [3.2. Release version on the iOS device](#32-release-version-on-the-ios-device)
- [4. Using a physical device](#4-using-a-physical-device)

## 1. Prerequisites
You should have read the [main developing guide](./developing.md) before looking into the iOS guide.

You can find more information about setting up for iOS development over at the [Expo documentation on iOS development](https://docs.expo.io/workflow/ios-simulator/).

Please make sure the Mac you have has sudo privileges so you are able to set it up correctly.

## 2. Simulator with Expo Go
### 2.1. Ruby
MacOS comes with a built-in version of Ruby that might not match the required version of this project. Ruby is used for Cocoapods.

To install the correct version of Ruby, you can use `rbenv` through `homebrew`. \
If you don't have homebrew, you can learn more at [brew.sh](https://brew.sh/).

To install `rbenv` you can run the following command:

```bash
brew install rbenv
```

Then, install the correct version of Ruby (3.1.0) using `rbenv`:

```bash
rbenv install 3.1.0
```

After installing Ruby, you can set the global version of Ruby to 3.1.0:

```bash
rbenv global 3.1.0
```

You can verify that the correct version of Ruby is installed by running:

```bash
ruby -v
```

This should output something along the lines of `ruby 3.1.0p0 (2021-12-25 revision 123456) [x86_64-darwin20]`.

---

If this isn't the case, check where your Ruby version is coming from by running `which ruby`. 
If this is not the version you just installed, you can run 
```bash
rbenv init
```
to get instructions on how to fix this by adding a command to `~/.zshrc`.

If `.zshrc` does not exist, run
```bash
touch ~/.zshrc
```
then
```bash
open touch ~/.zshrc
```
to be able to add the command in the newly opened text editor.

<br>
If that *still* does not work, try running the following command:

```bash
eval "$(rbenv init -)"
```
and then run `which ruby` again to check if the Ruby (3.1.0) in `/.rbenv/` is used.

### 2.2. Cocoapods
Install Cocaopods with [Gem](https://rubygems.org/?locale=nl). You may want to add `-V` for verbose output to ensure it is doing something as it may not show any output when it is installing.
```bash
sudo gem install cocoapods -V
```

#### Setting up pods
After installing Ruby correctly, you can install the required pods by running the following command in the `ios` directory:

```bash
cd ./apps/expo/ios
```
```bash
pod install
```

After getting the prerequisites installed you can start the development server with the following command for running with Expo Go:

```bash
yarn workspace app dev:ios
```

This will ask you to select a device or simulator to run the app on. However, it is recommended for developing that [you connect your iPhone to your Mac](#3-physical-device) and follow that guide instead for the best experience.

The simulator has limitations as described below.

### 2.3. Simulator Limitations
The following hardware is unavailable in simulator:

- Audio Input
- Barometer
- Camera
- Motion Support (accelerometer and gyroscope)

This means that specificly testing the `NeedForHeat` app that the simulator isn't of any use because the camera is needed to detect the QR code.

## 3. Physical device
You can connect a phyiscal iPhone with USB to the Macbook. It will then automatically prepare the iPhone to support Xcode builds in `Window -> Devices and Simulators`. This chapter will mostly go through Xcode as doing it through Yarn is not possible unlike Android which has Yarn scripts for building and installing.

---

For Xcode signing, you need to get access to a developer account to sign the iOS app. For access to the developer account, please contact [@n-vr](https://github.com/n-vr) or [@henriterhofte](https://github.com/henriterhofte). \
Log the account in that is part of the Windesheim team in Xcode and select the Windesheim team for signing.

---

You will need to register your physical device to the team to be able to start compiling the app and installing it on the device.

---

Make sure there are no errors, check [issues](#4-issues) for additional help. \
Do not update the project/apply recommended settings as that may make the build fail.

---

You can now start building to the physical device. There will be a prompt that asks for access to the keys, use your Mac device password to allow that.

The app will automatically install to the iOS device, check the status of this in Xcode in the middle top of the window.

### 3.1. Expo Go version
When everything goes well, the app will open to the Expo Go version of the app. You can then run the yarn command:

```bash
yarn workspace app dev:ios
```
and select the physical device to get the QR-code that you can scan on the iOS device. Metro should start bundling and the app should open up to the expected screen.

### 3.2. Release version on the iOS device
To install the release version of the, select the release schema in Xcode in the top-menu where it says `NeedforHeat` next to the iOS device selection and then select `NeedforHeat Release`.

![Change Xcode scheme to Release](https://github.com/energietransitie/needforheat-gearup-app/assets/16213031/7619856f-6dc6-42c2-a4cb-976faea140e5)

Then you can build the app as release version and automatically install to your iOS device. When you open it up, you will get the release version without Expo Go and thus see the app open up immediatley without Metro bundling. \
You might still see a terminal open with Metro bundler which you can ignore

## 4. Issues
***The CLI seems to be stuck when opening a simulator***

Sometimes the iOS simulator doesn't respond to the open command. If it seems stuck on this prompt, you can open the iOS simulator manually `(open -a Simulator)` and then in the macOS toolbar, choose Hardware → Device, and select an iOS version and device that you'd like to open.

---

***I get an error while building the app in Xcode or when running dev:ios*** \
 If you get the following error:

 ```bash
 ❌  (ios/Pods/boost/boost/container_hash/hash.hpp:131:33)

   129 | #else
   130 |         template <typename T>
 > 131 |         struct hash_base : std::unary_function<T, std::size_t> {};
       |                                 ^ no template named 'unary_function' in namespace 'std'; did you mean '__unary_function'?
   132 | #endif
   133 | 
   134 |         struct enable_hash_value { typedef std::size_t type; };
   ```

Open up Xcode, execute a build, select the error under `hash` that pops up and select 'Fix' when clicking on the error in the Xcode IDE. \
This will replace the `std::unary_function` with `std::__unary_function` and the build should succeed just fine. You'll also be able to run dev:ios again.
