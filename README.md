# NeedForHeat GearUp App<!-- omit in toc -->
![GitHub License](https://img.shields.io/github/license/energietransitie/needforheat-gearup-app)
![Project Status badge](https://img.shields.io/badge/status-in%20progress-brightgreen)
![Version Status Badge](https://img.shields.io/badge/version-beta-orange)

This repository contains the source code for the GearUp version of the NeedForHeat (NFH) app for both Android and iOS. The app helps users to install and connect one or more NFH measurement devices that start collecting monitoring data related to home heating.

## Table of contents<!-- omit in toc -->
- [General info](#general-info)
- [Installing the app](#installing-the-app)
- [Documentation](#documentation)
  - [EnergyDoctor](#energydoctor)
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
The LTS version of the app is available on the [Google Play Store (Android)](https://play.google.com/store/apps/details?id=nl.windesheim.energietransitie.needforheat) and [Apple App Store (iOS)](https://apps.apple.com/nl/app/needforheat-gearup/id6503364746).

For beta versions an invite is required. To receive an invite please contact [@henriterhofte](https://github.com/henriterhofte). \
Please include in your request the email address of the Apple ID or Google account that's being used on the device you wish to install the app.

To deploy and successfully use the app you need to have received an e-mail with a proper Firebase Dynamic Link and you need be in the possession of at least one NFH measurement device.

## Documentation
### EnergyDoctor
Documentation specifically for the EnergyDoctor can be found in [here](./docs/energydoctor.md).

### Deploying
Documentation for deploying to the Google Play Store and Apple App Store can be found in [here](./docs/deploying.md).

### Developing
Documentation for developing can be found [here](./docs/developing.md).

### Contributing
For contributing, please see the [Contribution Guidelines](./docs/contributing.md).\
For adding or updating a language or translation see [Translating - Getting Started](./docs/translating.md).

## Features

**Ready and field tested:**
- Account activation using Firebase Dynamic Links.
- Provisioning of NeedForHeat measurement devices.
  - Scanning of QR codes of any NeedForHeat measurement device.
  - Present device-specific installation instructions provided by the API.
  - Connect via Bluetooth Low Energy (BLE) to a NeedForHeat measurement device to provision internet connectivity.
  - Verification of successful device provisioning by checking for a device heartbeat.
- Multi-language support.

**Ready but not field tested:**
- **DataSourceList**
  - Setup a list of items that need to be completed for a campaign.
- **Monitoring**
  - Get a GREEN, YELLOW, or RED status depending on how late uploads are for a DataSource.
  - See how long it takes until the next upload should happen.
  - Send a notification locally if a DataSource is RED.
- **EnergyQueries**
  - **WeatherInterpolationLocation**
    - Use a map to put a marker on your home and calculate the WeatherZone.
  - **BuildingProfile**
    - Use a map to get your home address and perform calculations using BAG APIs.

** To-Do **
- **Technical Debt**
  - **Replace Firebase Dynamic Links**: Firebase Dynamic Links is deprecated and will be sunset on August 25, 2025 ([Firebase FAQ](https://firebase.google.com/support/dynamic-links-faq)). Consider using React Native's `Linking.getInitialURL()` combined with website content to handle account activation invites.
  - **Target Android 15 (API Level 35)**: Update the app to target Android 15 (API Level 35) by August 31, 2025, to comply with Google Play’s requirement for apps to target within one year of the latest Android release. Current target is Android 14 (API Level 34). Deadline for updates is August 31, 2025, with an option to request an extension until November 1, 2025 ([Google Play Policy](https://support.google.com/googleplay/android-developer/answer/11926878)).

- **Functional Improvements**
  - see [TODO-DESIRED.md](TODO-DESIRED.md).

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
* Matthijs Noordhof - [@Matthijsn](https://github.com/Matthijsn)
* Rick Klaasboer - [@rickklaasboer](https://github.com/rickklaasboer)
* Rowan van der Zande - [@RowanvdZ](https://github.com/RowanvdZ)
* Ward Pieters - [@wardpieters](https://github.com/wardpieters)
* Wietske Veneberg · [@WVeneberg](https://github.com/WVeneberg)

Product owners:

- Henri ter Hofte - [@henriterhofte](https://github.com/henriterhofte)
- (Formely) Nick van Ravenzwaaij - [@n-vr](https://github.com/n-vr)

We use and gratefully acknowlegde the efforts of the makers of the following source code and libraries:

- [Typescript](https://github.com/microsoft/TypeScript), by Microsoft, licensed under [Apache 2.0](https://github.com/microsoft/TypeScript/blob/master/LICENSE.txt).
- [React Native](https://github.com/facebook/react-native), by Meta Platforms, Inc. and affiliates, licensed under [MIT](https://github.com/facebook/react/blob/master/LICENSE).
- [Expo](https://github.com/expo/expo), by 2015-present 650 Industries, Inc. (aka Expo), licensed under [MIT](https://github.com/expo/expo/blob/main/LICENSE).
- [Babel](https://github.com/babel/babel), by Babel, licensed under [MIT](https://github.com/babel/babel/blob/main/LICENSE).
- [Jest](https://github.com/facebook/jest), by Meta Platforms, Inc., licensed under [MIT](https://github.com/facebook/jest/blob/main/LICENSE).
- [Turbo](https://github.com/vercel/turbo), by Vercel, licensed under [Apache 2.0](https://github.com/vercel/turbo/blob/main/LICENSE).
- [Eslint](https://github.com/eslint/eslint), by Nicholas C. Zakas, licensed under [MIT](https://github.com/eslint/eslint/blob/main/LICENSE).
- [Prettier](https://github.com/prettier/prettier), by Prettier, licensed under [MIT](https://github.com/prettier/prettier/blob/main/LICENSE).
- [Node](https://github.com/nodejs/node), by Node.js with their own [license](https://github.com/nodejs/node/blob/main/LICENSE).
- [Yarn](https://github.com/yarnpkg/berry), by Yarn, licensed under [BSD 2-Clause "Simplified"](https://github.com/yarnpkg/berry/blob/master/LICENSE.md).

---

- [h3](https://github.com/uber/h3), by Uber, licensed under [Apache 2.0](https://github.com/uber/h3/blob/master/LICENSE)
- [cron-parser](https://github.com/harrisiirak/cron-parser/), by Harri Siirak, licensed under [MIT](https://github.com/harrisiirak/cron-parser/blob/master/LICENSE)
- [lz-string](https://github.com/pieroxy/lz-string), by pieroxy, licensed under [MIT](https://github.com/pieroxy/lz-string/blob/master/LICENSE.md)
- [zod](https://github.com/colinhacks/zod), by Colin McDonnell, licensed under [MIT](https://github.com/colinhacks/zod/blob/master/LICENSE)
- [burnt](https://github.com/thesephist/burnt), by Linus Lee (aka thesephist), licensed under [MIT](https://github.com/thesephist/burnt/blob/main/LICENSE)
- [base-64](https://github.com/mathiasbynens/base64), by Mathias Bynens, licensed under [MIT](https://github.com/mathiasbynens/base64/blob/master/LICENSE-MIT.txt)
- [braces](https://github.com/micromatch/braces), by Jon Schlinkert, licensed under [MIT](https://github.com/micromatch/braces/blob/master/LICENSE)
- [crc](https://github.com/alexgorbatchev/node-crc), by Alex Gorbatchev, licensed under [MIT](https://github.com/alexgorbatchev/node-crc/blob/master/LICENSE)
- [date-fns](https://github.com/date-fns/date-fns), by Sasha Koss and contributors, licensed under [MIT](https://github.com/date-fns/date-fns/blob/main/LICENSE)
- [dayjs](https://github.com/iamkun/dayjs), by iamkun and contributors, licensed under [MIT](https://github.com/iamkun/dayjs/blob/dev/LICENSE)
- [html-entities](https://github.com/mdevils/html-entities), by Alexander Simonov, licensed under [MIT](https://github.com/mdevils/html-entities/blob/main/LICENSE)
- [html-minifier](https://github.com/kangax/html-minifier), by Kangax, licensed under [MIT](https://github.com/kangax/html-minifier/blob/gh-pages/LICENSE)
- [i18next](https://github.com/i18next/i18next), by Jan Mühlemann, licensed under [MIT](https://github.com/i18next/i18next/blob/master/LICENSE)
- [intl](https://github.com/andyearnshaw/Intl.js), by Andy Earnshaw, licensed under [MIT](https://github.com/andyearnshaw/Intl.js/blob/master/LICENSE.txt)
- [json5](https://github.com/json5/json5), by Aseem Kishore and Jordan Harband, licensed under [MIT](https://github.com/json5/json5/blob/main/LICENSE.md)
- [luxon](https://github.com/moment/luxon), by Isaac Cambron, licensed under [MIT](https://github.com/moment/luxon/blob/master/license.md)
- [mathjs](https://github.com/josdejong/mathjs), by Jos de Jong, licensed under [Apache 2.0](https://github.com/josdejong/mathjs/blob/develop/LICENSE)

---

- [React Native Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet), by Mo Gorhom, licensed under [MIT](https://github.com/gorhom/react-native-bottom-sheet/blob/master/LICENSE)
- [React Native Network Info](https://github.com/react-native-netinfo/react-native-netinfo), by react-native-netinfo, licensed under [MIT](https://github.com/react-native-netinfo/react-native-netinfo/blob/master/LICENSE)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps), by Airbnb, licensed under [MIT](https://github.com/react-native-maps/react-native-maps/blob/master/LICENSE)
- [react-native-background-fetch](https://github.com/transistorsoft/react-native-background-fetch), by Transistor Software, licensed under [Apache 2.0](https://github.com/transistorsoft/react-native-background-fetch/blob/master/LICENSE)
- [react-native-bluetooth-state-manager](https://github.com/ccoenraets/react-native-bluetooth-state-manager), by Christophe Coenraets, licensed under [MIT](https://github.com/ccoenraets/react-native-bluetooth-state-manager/blob/master/LICENSE)
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit), by Catalin Miron, licensed under [MIT](https://github.com/indiespirit/react-native-chart-kit/blob/master/LICENSE)
- [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv), by Juhan Aasaru, licensed under [MIT](https://github.com/goatandsheep/react-native-dotenv/blob/main/LICENSE)
- [react-native-esp-idf-provisioning](https://github.com/espressif/react-native-esp-idf-provisioning), by Espressif Systems, licensed under [Apache 2.0](https://github.com/espressif/react-native-esp-idf-provisioning/blob/master/LICENSE)
- [react-native-exit-app](https://github.com/wumke/react-native-exit-app), by Wumke, licensed under [MIT](https://github.com/wumke/react-native-exit-app/blob/master/LICENSE)
- [react-native-geocoding](https://github.com/marlove/react-native-geocoding), by Marlove, licensed under [MIT](https://github.com/marlove/react-native-geocoding/blob/master/LICENSE)
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler), by Software Mansion, licensed under [MIT](https://github.com/software-mansion/react-native-gesture-handler/blob/main/LICENSE)
- [react-native-google-places-autocomplete](https://github.com/FaridSafi/react-native-google-places-autocomplete), by Farid Safi, licensed under [MIT](https://github.com/FaridSafi/react-native-google-places-autocomplete/blob/master/LICENSE)
- [react-native-vector-icons/Ionicons](https://github.com/oblador/react-native-vector-icons), by Joel Arvidsson (aka oblador), licensed under [MIT](https://github.com/oblador/react-native-vector-icons/blob/master/LICENSE)
- [react-native-localize](https://github.com/zoontek/react-native-localize), by Mathieu Acthernoene (aka zoontek), licensed under [MIT](https://github.com/zoontek/react-native-localize/blob/master/LICENSE)
- [react-native-maps](https://github.com/react-native-maps/react-native-maps), by Airbnb, licensed under [MIT](https://github.com/react-native-maps/react-native-maps/blob/master/LICENSE)
- [react-native-permissions](https://github.com/zoontek/react-native-permissions), by Mathieu Acthernoene (aka zoontek), licensed under [MIT](https://github.com/zoontek/react-native-permissions/blob/master/LICENSE.md)
- [react-native-prompt-android](https://github.com/naoufal/react-native-prompt-android), by Naoufal, licensed under [MIT](https://github.com/naoufal/react-native-prompt-android/blob/master/LICENSE)
- [react-native-push-notification](https://github.com/zo0r/react-native-push-notification), by zo0r (aka Dieam), licensed under [MIT](https://github.com/zo0r/react-native-push-notification/blob/master/LICENSE)
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated), by Software Mansion, licensed under [MIT](https://github.com/software-mansion/react-native-reanimated/blob/master/LICENSE)
- [react-native-render-html](https://github.com/meliorence/react-native-render-html), by Pierre-Marc Airoldi, licensed under [MIT](https://github.com/meliorence/react-native-render-html/blob/master/LICENSE)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context), by Th3rd Wave, licensed under [MIT](https://github.com/th3rdwave/react-native-safe-area-context/blob/main/LICENSE.md)
- [react-native-screens](https://github.com/software-mansion/react-native-screens), by Software Mansion, licensed under [MIT](https://github.com/software-mansion/react-native-screens/blob/main/LICENSE)
- [react-native-svg](https://github.com/react-native-svg/react-native-svg), by React Native Community, licensed under [MIT](https://github.com/react-native-svg/react-native-svg/blob/main/LICENSE)
- [react-native-tab-view](https://github.com/satya164/react-native-tab-view), by Satya Sahoo, licensed under [MIT](https://github.com/satya164/react-native-tab-view/blob/main/LICENSE)
- [react-native-url-polyfill](https://github.com/charpeni/react-native-url-polyfill), by Henri CHARPENTIER, licensed under [MIT](https://github.com/charpeni/react-native-url-polyfill/blob/main/LICENSE)
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons), by Joel Arvidsson (aka oblador), licensed under [MIT](https://github.com/oblador/react-native-vector-icons/blob/master/LICENSE)
- [react-native-web](https://github.com/necolas/react-native-web), by Nicolas Gallagher, licensed under [MIT](https://github.com/necolas/react-native-web/blob/main/LICENSE)
- [react-native-wifi-reborn](https://github.com/JuanSeBestia/react-native-wifi-reborn), by Juan Sebastian Saborio, licensed under [MIT](https://github.com/JuanSeBestia/react-native-wifi-reborn/blob/main/LICENSE)
- [react-i18next](https://github.com/i18next/react-i18next/tree/master), by i18next, licensed under [MIT](https://github.com/i18next/react-i18next/blob/master/LICENSE)

---

This `README` uses [badges](https://github.com/badges/shields/blob/master/LICENSE), by [Shield.io](https://github.com/badges), licensed under [CC0 v1.0 Universal](https://github.com/badges/shields/blob/master/LICENSE)
