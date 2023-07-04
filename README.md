<!-- omit in toc -->

# Twomes provisioning app

This repository contains the source code for the NeedForHeat app for both Android and iOS. The app helps users to install and connect one or more Twomes measurement devices that start collecting monitoring data related to home heating.

<!-- omit in toc -->

## Table of contents

- [General info](#general-info)
- [Installing the app](#installing-the-app)
- [Deploying](#deploying)
- [Developing](#developing)
- [Features](#features)
- [Contributing](#contributing)
- [Status](#status)
- [License](#license)
- [Credits](#credits)

## General info

The app is meant to be installed automatically by clicking on an e-mail invitation on your smartphone that contains a Firebase Dynamic Link, which automatically selects the proper app from the proper app store, installs it and activates the user's account using the account activation token in the Firebase Dynamic Link. The user is then asked to proceed by scanning, one-by-one, the QR-code that is attached to each Twomes measurement device that has been sent to the home address of the user. For each device scanned, the proper device installation instructions are retrieved from the Twomes server and presented. The app then connects with the device, which then scans for available wifi networks. The user is asked to select their home wifi network from the list of available networks and supply the password for that network. If everything has been entered correctly, the user is notified that the setup was completed successfully and can choose to configure the next device.

After adding one or more devices the collected measurement data can be viewed in various graphs. Giving the user the ability to view the collected data themselves. A list with all setup devices connected to the account is also available.

The app currently supports the following languages:

- English
- Dutch

## Installing the app

LTS version is available in both the Apple App Store and Google Play Store. For beta versions an invite is required. To receive an invite please contact [@henriterhofte](https://github.com/henriterhofte). Please include in your request the email address of the Apple ID or Google account that's being used on the device you wish to install the app.

To deploy and successfully use the app you need to have received an e-mail with a proper Firebase Dynamic Link and you need be in the possession of at least one Twomes measurement device.

## Deploying

Documentation for deplying can be found [here](/docs/store-update.md).

## Developing

Documentation for developing can be found [here](/docs/developing.md).

## Features

List of features in the NeedForHeat app:

- Account activation using Firebase Dynamic Links.
- Provisioning of Twomes measurement devices.
  - Scanning of QR codes of any Twomes measurement device.
  - Present device specific installation instructions provided by the API.
  - Connect via Bluetooth Low Energy (BLE) to a Twomes measurement device to provision internet connectivity.
  - Verification of successful device provisioning by checking for a device heartbeat.
- Multi-language support for the following languages:
  - English
  - Dutch

## Contributing

For getting started with the development of the app see [Developing - Getting Started](./docs/developing.md). \
For contributing, adding or updating a language or translation see [Translating - Getting Started](./docs/translating.md).

## Status

Project is: _in progress_

Current version is stable.

## License

This software is available under the [Apache 2.0 license](./LICENSE), Copyright 2021 [Research group Energy Transition, Windesheim University of Applied Sciences](https://windesheim.nl/energietransitie)

## Credits

This software is a collaborative effort of:

- Rick Klaasboer - [@rickklaasboer](https://github.com/rickklaasboer)
- Joël Kuijper - [@joehoel](https://github.com/Joehoel)
- Ward Pieters - [@wardpieters](https://github.com/wardpieters)
- Jesse Brand - [@jessuhh](https://github.com/Jessuhh)

Thanks also go to:

- Wietske Veneberg - [@WVeneberg](https://github.com/WVeneberg)
- Amicia Smit - [@AmiciaSmit](https://github.com/AmiciaSmit)
- Marco Prins - [@mk-prins](https://github.com/mk-prins)
- Brian Hoen - [@lordpalf123](https://github.com/lordpalf123)
- Mattijs Noordhof - [@Matthijsn](https://github.com/Matthijsn)
- Matthias Verweij - [@MatthiasVerweij](https://github.com/MatthiasVerweij)
- Rowan van der Zande - [@RowanvdZ](https://github.com/RowanvdZ)

Product owner:

- Nick van Ravenzwaaij - [@n-vr](https://github.com/n-vr)

We use and gratefully acknowlegde the efforts of the makers of the following source code and libraries:

- [Typescript](https://github.com/microsoft/TypeScript), by Microsoft, licensed under [Apache 2.0](https://github.com/microsoft/TypeScript/blob/master/LICENSE.txt)
- [React Native](https://github.com/facebook/react-native), by Meta Platforms, Inc. and affiliates, licensed under [MIT](https://github.com/facebook/react/blob/master/LICENSE)
- [Expo](https://github.com/expo/expo), by 2015-present 650 Industries, Inc. (aka Expo), licensed under [MIT](https://github.com/expo/expo/blob/main/LICENSE)
- [react-i18next](https://github.com/i18next/react-i18next/tree/master), by i18next, licensed under [MIT](https://github.com/i18next/react-i18next/blob/master/LICENSE)
- [React Native Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet), by Mo Gorhom, licensed under [MIT](https://github.com/gorhom/react-native-bottom-sheet/blob/master/LICENSE)
