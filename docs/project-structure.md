# Project structure

Below is a visual representation of this repository. Clicking on a folder will take you to a short explanation about the folder and structure (if available). Not every folder or file will be named or explained here. If you feel like there are explanations missing, [consider adding](./contributing.md) them.

## Overview

need-for-heat/ \
├── [.github/](#github) \
├── apps/ \
│&emsp;&emsp; └── expo/ \
│&emsp;&emsp; &emsp;&emsp; ├── src/ \
│&emsp;&emsp; &emsp;&emsp; │&emsp;&emsp; ├── [components/](#components) \
│&emsp;&emsp; &emsp;&emsp; │&emsp;&emsp; ├── [lang/](#lang) \
│&emsp;&emsp; &emsp;&emsp; │&emsp;&emsp; ├── lib/ \
│&emsp;&emsp; &emsp;&emsp; │&emsp;&emsp; │&emsp;&emsp; └── [theme.ts](#themets) \
│&emsp;&emsp; &emsp;&emsp; │&emsp;&emsp; └── [screens/](#screens) \
│&emsp;&emsp; &emsp;&emsp; ├── [app.json](#appjson) \
│&emsp;&emsp; &emsp;&emsp; ├── [app.tsx](#apptsx) \
│&emsp;&emsp; &emsp;&emsp; ├── [CHANGELOG.md](#changelogmd) \
│&emsp;&emsp; &emsp;&emsp; └── [package.json](#packagejson) \
├── [docs/](#docs) \
└── [.env](#env)

---

## .github

The `.github` folder contains all the repository workflows. These workflows run everytime a pull request gets opened or changes are commited to an already open pull request.

---

## components

The `components` folder contains every reusable component. Every component that gets used on one screen only, should **not** be in this folder. Instead it should be in the screen component or folder itself. Like the [SettingListItem](../apps/expo/src/screens/SettingsScreen/_settingListItem.tsx) component on the [SettingsScreen](../apps/expo/src/screens/SettingsScreen/) for example. The `components` folder contains the following folders:
- common
- elements
- routers

### common

The `common` folder contains every reusable custom component or custom components that get used on more than one screen. Try to keep these components as generic and customizable as possible (while staying consistent style-wise) to allow them to be reused in multiple places.

### elements

The `elements` folder contains elements from the [React Native Elements](https://www.reactnativeelements.com) UI toolkit with custom props assigned. These custom props can be found in [theme.d.ts](../apps/expo/src/types/theme.d.ts). The styling can be found in [theme.ts](../apps/expo/src/lib/theme.ts), explained [here](#themets).

### routers

Routers are special types of components. The `routers` folder contains all the navigation stacks used in the application.

---

## lang

The `lang` folder contains every translation file for all supported languages. You can read all about translations [here](./translating.md).

---

## theme.ts

In `theme.ts` all the theme colors can be found. Every color that is unused (as of now) has a bright purple color assigned to it:
```ts
greyOutline: "#FF00D6", // Unused
```
Styling for the [elements](#elements) can also be found in this file. Besides colors this file also contains the definition for several font sizes, padding and margin sizes and fonts. When styling components or pages make sure to use the values from `theme.ts`. This makes for a consistent UI. Possible redesigns in the future will also be made much easier. It also prevents magic values in styling.

---

## screens

The `screens` folder contains every screen in the app. Each navigation stack (like `home` and `info`) and every individual screen (like `SettingScreen`) have their own folder or file.

---

## app.json

The `app.json` file contains all the expo settings related to the applicaton. The app name, description, owner, permissions, versions, platforms and much more can be found here. Documentation about `app.json` is available on [docs.expo.dev](https://docs.expo.dev/versions/latest/config/app/)

---

## app.tsx

The `app.tsx` is the main entrypoint of the app. If you're trying to figure out how everything works in a somewhat logical way (the react way), start here.

---

## CHANGELOG.md

The `CHANGELOG.md` contains all the changes of every version. This file is updated automatically, there is no reason to change this.

---

## package.json

The `package.json` contains some project information, scripts and (dev) dependencies. All the dependencies that get added show up here. Make sure to pin  versions (remove the ^ or ~ in front of the version).

---

## docs

The `docs` folder contains as much of the documentation in this repository as possible. There might be situations where a README in the folder itself is more effective or practical.

---

## .env

All environment variables for the whole repository can be found here. Setup can be found [here](./developing.md#add-environment-variables).
