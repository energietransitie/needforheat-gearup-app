# NeedForHeat GearUp App<!-- omit in toc -->
![GitHub License](https://img.shields.io/github/license/energietransitie/needforheat-gearup-app)
![Project Status badge](https://img.shields.io/badge/status-in%20progress-brightgreen)
![Version Status Badge](https://img.shields.io/badge/version-beta-orange)

This repository contains the source code for the GearUp version of the NeedForHeat (NFH) app for both Android and iOS. The app helps users to install and connect one or more NFH measurement devices that start collecting monitoring data related to home heating.

## Table of contents<!-- omit in toc -->
- [General info](#general-info)
- [Installing the app](#installing-the-app)
- [Deploying](#deploying)
- [Developing](#developing)
- [Contributing](#contributing)
- [Features](#features)
- [License](#license)
- [Credits](#credits)

## General info
The app is meant to be activated automatically by clicking on an e-mail invitation on your smartphone that contains a Firebase Dynamic Link, which automatically selects the proper app from the proper app store and activates the user's account using the account activation token in the Firebase Dynamic Link.

The user is then asked to proceed by scanning, one-by-one, the QR-code that is attached to each NFH measurement device that has been sent to the home address of the user. \
For each device scanned, the proper device installation instructions are retrieved from the NeedForHeat server and presented. The app then connects with the device, which then scans for available wifi networks. The user is asked to select their home wifi network from the list of available networks and supply the password for that network. \
If everything has been entered correctly, the user is notified that the setup was completed successfully and can choose to configure the next device.

After adding one or more devices the collected measurement data can be viewed in various graphs. \
A list with all setup devices connected to the account is also available.

The app currently supports the following languages:

- Nederlands (Dutch)
- English (American)

## Installing the app
The LTS version of the app is available on the [Google Play Store (Android)](https://play.google.com/store/apps/details?id=nl.windesheim.energietransitie.warmtewachter) and [Apple App Store (iOS)](https://apps.apple.com/nl/app/needforheat/id1563201993).

For beta versions an invite is required. To receive an invite please contact [@henriterhofte](https://github.com/henriterhofte). \
Please include in your request the email address of the Apple ID or Google account that's being used on the device you wish to install the app.

To deploy and successfully use the app you need to have received an e-mail with a proper Firebase Dynamic Link and you need be in the possession of at least one NFH measurement device.

## Documentation
### Deploying
Documentation for deploying to the Google Play Store and Apple App Store can be found in [here](./docs/deploying.md).

### Developing
Documentation for developing can be found [here](./docs/developing.md).

### Contributing
For contributing, please see the [Contribution Guidelines](./docs/contributing.md).\
For adding or updating a language or translation see [Translating - Getting Started](./docs/translating.md).

## Features
List of features in the NeedForHeat app:

- Account activation using Firebase Dynamic Links.
- Provisioning of NFH measurement devices.
  - Scanning of QR codes of any NFH measurement device.
  - Present device specific installation instructions provided by the API.
  - Connect via Bluetooth Low Energy (BLE) to a NFH measurement device to provision internet connectivity.
  - Verification of successful device provisioning by checking for a device heartbeat.
- Multi-language support  
- DataSourceList
  - Setup a list of items that need to be completed for a campaign
- Monitoring
  - Get a GREEN, YELLOW or RED status depending on how late uploads are for a DataSource
  - See how long it takes until the next upload should happen.   

## License
This software is available under the [Apache 2.0 license](./LICENSE), Copyright 2023 [Research group Energy Transition, Windesheim University of Applied Sciences](https://windesheim.nl/energietransitie)

## Credits
This version of the NeedForHeat app was created with the help of:

* Harris Mesic - [@Labhatorian](https://github.com/Labhatorian)
* Niels Even - [@Niels995](https://github.com/Niels995)
* Thomas Buijs - [@ThomasBuh](https://github.com/ThomasBuh)
* Meriyem Bilgili - [@MeriyemBilgili](https://github.com/MeriyemBilgili)

Thanks also go to the developers of previous versions of NeedForHeat and WarmteWachter, the predecessor of this app:

* Jort Driegen · [@jortdr](https://github.com/jortdr)
* Nick Koster · [@NormalNickYT](https://github.com/NormalNickYT)
* Robin Leuninge · [@RobinLeuninge](https://github.com/orgs/energietransitie/people/RobinLeuninge)
* Thomas van Meer · [@CodingMoonMan](https://github.com/orgs/energietransitie/people/CodingMoonMan)
* Tristan Jansen · [@Tristan611](https://github.com/Tristan611)
* Amicia Smit · [@AmiciaSmit](https://github.com/AmiciaSmit)
* Brian Hoen - [@lordpalf123](https://github.com/lordpalf123)
* Jesse Brand - [@jessuhh](https://github.com/Jessuhh)
* Joël Kuijper - [@joehoel](https://github.com/Joehoel)
* Marco Prins · [@mk-prins](https://github.com/mk-prins)
* Matthias Verweij - [@MatthiasVerweij](https://github.com/MatthiasVerweij)
* Mattijs Noordhof - [@Matthijsn](https://github.com/Matthijsn)
* Rick Klaasboer - [@rickklaasboer](https://github.com/rickklaasboer)
* Rowan van der Zande - [@RowanvdZ](https://github.com/RowanvdZ)
* Ward Pieters - [@wardpieters](https://github.com/wardpieters)
* Wietske Veneberg · [@WVeneberg](https://github.com/WVeneberg)

Product owners:

- Henri ter Hofte - [@henriterhofte](https://github.com/henriterhofte) - Twitter [@HeNRGi](https://twitter.com/HeNRGi)
- (Formely) Nick van Ravenzwaaij - [@n-vr](https://github.com/n-vr)

We use and gratefully acknowlegde the efforts of the makers of the following source code and libraries:

- [Typescript](https://github.com/microsoft/TypeScript), by Microsoft, licensed under [Apache 2.0](https://github.com/microsoft/TypeScript/blob/master/LICENSE.txt)
- [React Native](https://github.com/facebook/react-native), by Meta Platforms, Inc. and affiliates, licensed under [MIT](https://github.com/facebook/react/blob/master/LICENSE)
- [Expo](https://github.com/expo/expo), by 2015-present 650 Industries, Inc. (aka Expo), licensed under [MIT](https://github.com/expo/expo/blob/main/LICENSE)
- [react-i18next](https://github.com/i18next/react-i18next/tree/master), by i18next, licensed under [MIT](https://github.com/i18next/react-i18next/blob/master/LICENSE)
- [React Native Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet), by Mo Gorhom, licensed under [MIT](https://github.com/gorhom/react-native-bottom-sheet/blob/master/LICENSE)
- [React Native Network Info](https://github.com/react-native-netinfo/react-native-netinfo), by react-native-netinfo, licensed under [MIT](https://github.com/react-native-netinfo/react-native-netinfo/blob/master/LICENSE)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps), by Airbnb, licensed under [MIT](https://github.com/react-native-maps/react-native-maps/blob/master/LICENSE)
- [h3](https://github.com/uber/h3), by Uber, licensed under [Apache 2.0](https://github.com/uber/h3/blob/master/LICENSE)
- [cron-parser](https://github.com/harrisiirak/cron-parser/), by Harri Siirak, licensed under [MIT](https://github.com/harrisiirak/cron-parser/blob/master/LICENSE)
-[react-native-push-notification](https://github.com/zo0r/react-native-push-notification), by zo0r (aka Dieam), licensed under [MIT](https://github.com/zo0r/react-native-push-notification/blob/master/LICENSE)

This `README` uses [badges](https://github.com/badges/shields/blob/master/LICENSE), by [Shield.io](https://github.com/badges), licensed under [CC0 v1.0 Universal](https://github.com/badges/shields/blob/master/LICENSE)