# Project structure
Below is a visual representation of this repository. Clicking on a folder will take you to a short explanation about the folder and structure.

Not every folder or file will be named or explained here. If you feel like there are explanations missing, [consider adding](./contributing.md) them.

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
│&emsp;&emsp; &emsp;&emsp; │&emsp;&emsp; ├── [screens/](#screens) \
│&emsp;&emsp; &emsp;&emsp; │&emsp;&emsp; ├── [hooks/](#hooks) \
│&emsp;&emsp; &emsp;&emsp; │&emsp;&emsp; └── [providers/](#providers) \
│&emsp;&emsp; &emsp;&emsp; ├── [android/](#android) \
│&emsp;&emsp; &emsp;&emsp; ├── [app.json](#appjson) \
│&emsp;&emsp; &emsp;&emsp; ├── [app.tsx](#apptsx) \
│&emsp;&emsp; &emsp;&emsp; ├── [CHANGELOG.md](#changelogmd) \
│&emsp;&emsp; &emsp;&emsp; └── [package.json](#packagejson) \
├── [docs/](#docs) \
└── [.env](#env)

---

## .github
The `.github` folder contains all the repository workflows. These workflows run everytime a pull request gets opened or changes are commited to an already open pull request. There is also a pullrequest template in this folder.

For more explanation, check out the [GitHub documentation of the project](./github.md)

---

## components
The `components` folder contains every reusable component. Every component that gets used on one screen only, should **not** be in this folder. Instead it should be in the screen component or folder itself. Like the [SettingListItem](../apps/expo/src/screens/SettingsScreen/_settingListItem.tsx) component on the [SettingsScreen](../apps/expo/src/screens/SettingsScreen/) for example. The `components` folder contains the following folders:
- common
- elements
- routers

### common
The `common` folder contains every reusable custom component or custom components that get used on more than one screen. Try to keep these components as generic and customizable as possible (while staying consistent style-wise) to allow them to be reused in multiple places.

### elements
The `elements` folder contains elements from the [React Native Elements](https://www.reactnativeelements.com) UI toolkit with custom props assigned. These custom props can be found in [theme.d.ts](../apps/expo/src/types/theme.d.ts). \
The styling can be found in [theme.ts](../apps/expo/src/lib/theme.ts), explained [here](#themets).

### routers
Routers are special types of components. The `routers` folder contains all the navigation stacks used in the application.

For more information, check out the [Expo Router Documentation](https://docs.expo.dev/router/introduction/).

---

## lang
The `lang` folder contains every translation file for all supported languages. \
You can read all about translations [here](./translating.md).

---

## theme.ts
In `theme.ts` all the theme colors can be found.

Every color that is unused (as of now) has a bright purple color assigned to it:
```ts
greyOutline: "#FF00D6", // Unused
```
Styling for the [elements](#elements) can also be found in this file. Besides colors this file also contains the definition for several font sizes, padding and margin sizes and fonts. When styling components or pages make sure to use the values from `theme.ts`.

The use of `theme.ts` makes for a consistent UI. Possible redesigns in the future will also be made much easier. It also prevents magic values in styling.

---

## screens
The `screens` folder contains every screen in the app. Each navigation stack (like `home` and `info`) and every individual screen (like `SettingScreen`) have their own folder or file.

This relies on the [Routers](#routers).

---

## hooks
Hooks are an important part of React. Reusable code that is used in an `useEffect()` for example, can be turned in a custom hook so it can be used anywhere else in the code.
 
---

## providers
The providers folder has an index screen that the app uses to give structure to the screens and router. In a nutshell, everything that goes around the screens like the MeasurementsRouter.

This also contains the code to have [Firebase Dynamic Links](https://firebase.google.com/docs/dynamic-links) working and activate the user.

---

## app.json
The `app.json` file contains all the expo settings related to the applicaton. The app name, description, owner, permissions, versions, platforms and much more can be found here.

Documentation about `app.json` is available on [docs.expo.dev](https://docs.expo.dev/versions/latest/config/app/)

---

## app.tsx
The `app.tsx` is the main entrypoint of the app.

If you're trying to figure out how everything works in a somewhat logical way (the react way), start here.

---

## CHANGELOG.md
The `CHANGELOG.md` contains all the changes of every version. This file is updated automatically.

Do not touch this file.

---
## package.json
The `package.json` contains some project information, scripts and (dev) dependencies. All the dependencies that get added show up here.

Make sure to pin versions (remove the ^ or ~ in front of the version).

---
## docs

The `docs` folder contains as much of the documentation in this repository as possible.

---

## .env
All environment variables for the whole repository can be found here.

Setup can be found [here](https://github.com/energietransitie/twomes-app-needforheat/blob/docs/revamp/docs/developing.md#4-add-environment-variable).
