# Developing
This guide will explain how to prepare the local enviroment to start developing the app. Including important things to look out for both Android and iOS.

## Table of contents
- [Prerequisites](#prerequisites)
- [1. Setup SSH Key](#1-setup-ssh-key)
- [2. Clone the repository](#2-clone-the-repository)
- [3. Install dependencies](#3-install-dependencies)
- [4. Add environment variable](#4-add-environment-variable)
- [5. Setup Java](#5-setup-java)
- [6. Prepare and Running with Expo Go](#6-prepare-and-running-with-expo-go)
- [7. Compiling binaries for testing](#7-compiling-binaries-for-testing)
- [8. Ready!](#8-ready)

## Prerequisites
-	[Node.js](https://yarnpkg.com/) (>= 16.0.0)
-	[Yarn](https://yarnpkg.com/) (>= 1.22.0)
-   [Git](https://git-scm.com/)
- Android
    -	OpenJDK 17
        - You can get OpenJDK from [Microsoft](https://learn.microsoft.com/nl-nl/java/openjdk/download#openjdk-17) or [Adoptium](https://adoptium.net/temurin/releases/?version=17)
    -	[Android Studio](https://developer.android.com/studio) (>= 4.2.0)
- iOS
    - [Xcode](https://developer.apple.com/xcode/) (>= 13.0.0)
    - [Ruby](https://www.ruby-lang.org/en/) (>= 3.1.0)
    - [Cocaopods](https://cocoapods.org/) (>=1.15.2)

## 1. Setup SSH Key
Due to the potential private repositories, a SSH key will be required to set up so Yarn can properly fetch this repo. Please contact [@henriterhofte](https://github.com/henriterhofte) if there is a repository that should not be private.

To do this, please follow the GitHub documentation to setup an SSH key on the device you will be using to develop:
1. [Generate a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
2. [Adding a SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

## 2. Clone the repository
Go to a folder you plan on cloning the code to on your device and run:
```bash
git clone https://github.com/Need-for-Heat/need-for-heat.git
cd need-for-heat
```

## 3. Install dependencies
Before you can run the app, dependencies need to be fetched and installed to the `node_modules` folder with the following command in a terminal:

```bash
yarn
```

## 4. Add environment variable
Copy the example environment file and rename it to `.env`:

```bash
cp .env.example .env
```

Fill in the environment variable for the API:

```yaml
API_URL= # The API URL for the needforheat app
MANUAL_URL= # The MANUAL URL is for the manual server
GOOGLE_MAPS_API_KEY= # The key to enable Google Maps in the app
```

### 4.1. Test- or Local API?
The recommended server to use is the existing public test server available on <https://api.tst.energietransitiewindesheim.nl/v3>

A local server with the [needforheat-server-api](https://github.com/energietransitie/needforheat-server-api) is possible by running it through Docker with the [feat/cors branch](https://github.com/energietransitie/needforheat-server-api/tree/feat/cors). \
However, this is not the best way to develop and you might run in to issues you won't have by just using the public test server. This issue is because of security from [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

### 4.2. API URL not changing?
Due to caching, this URL might not always change. You can fix this by running `npx expo start -c` in the `apps\expo` folder then doing `CTRL + C` when it starts/finishes to stop it. \
The cache should then be cleared and you can use Yarn again to run the app.

## 5. Setup Java
Make sure the JDK for Java 17 is installed and that `JAVA_HOME` is set. \
It is recommeded to remove other versions of Java that you no longer use.

In addition, make sure you also remove the `/Program Files/Java` folder. \
Otherwise, the Java JDK inside this folder will be used when building which is most likely not the right version. 

## 6. Prepare and Running with Expo Go
You SHOULD read the guides for [Android](./android.md) and [iOS](./ios.md) for the OS-specific guide. These guides will explain how to prepare your environment to build the development app on either a emulator or a physical device.

Do note that you should not exclusively develop on Expo Go. Mainly because icons will not load and because of React Native Bindings that get used from [needforheat-gearup-app-eup](needforheat-gearup-app-eup). 

In addition, Expo Go requires that the network is a **private** network with a firewall that allows the Expo Go ports to go through on the PC hosting the Expo Go server. This means you will be unable to use Expo Go on public networks like `eduroam`. \
You *can* fix this by running through a hotspot or and/or setting the network to private for [Windows](https://support.microsoft.com/en-us/windows/make-a-wi-fi-network-public-or-private-in-windows-0460117d-8d3e-a7ac-f003-7a0da607448d). MacOS has no public/private network setting and should work fine on private networks.

You should do [Step 7](#7-compiling-binaries-for-testing) to properly develop and test the app.
<br><br>

To get started quickly, run the following for Android:
```bash
yarn workspace app dev:android
```
Or for iOS:
```bash
yarn workspace app dev:ios
```

## 7. Compiling binaries for testing
Compiling binaries is OS-specific. Again, you should check out the guides for [Android](./android.md) and [iOS](./ios.md).
<br><br>

To get started quickly, run the following for Android:

```bash
yarn workspace app release:android:build
```

```bash
yarn workspace app release:android:install
```

## 8. Ready!
You're now ready to add and change code! \
Make sure you stick to the [Contribution Guidelines](./contributing.md) when contributing to this repository.

To check what scripts are available for Yarn, see [Yarn Scripts](./scripts.md). \
For an explanation of the project structure, see [Project Structure](./project-structure.md). \
If you want to change or add translations and languages check out [Translating - Getting Started](./translating.md).
