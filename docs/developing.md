# Developing

## Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 16.0.0)
- [Yarn](https://yarnpkg.com/) (>= 1.22.0)
- [Android Studio](https://developer.android.com/studio) (>= 4.2.0)
- [Xcode](https://developer.apple.com/xcode/) (>= 13.0.0)

### Clone the repository

```bash
git clone https://github.com/Need-for-Heat/need-for-heat.git
cd need-for-heat
```

### Install dependencies

```bash
yarn
```

### Add environment variables

#### Copy the .env.example

```bash
cp .env.example .env
```

#### Fill in the environment variables

```yaml
API_URL= # The API URL for the need-for-heat app
```

### Install development app

Read the guides for [android](./android.md) and [ios](./ios.md) for a more complete explanation.

To get started quickly, run the following for android:
```bash
yarn workspace app dev:android
```
Or for iOS:
```bash
yarn workspace app dev:ios
```

## Running and debugging

Start the expo developer client using
```bash
yarn workspace app dev
```
(For more info about the available scripts. See [Scripts](./scripts.md))

You're now ready to add and change code! Make sure you stick to the [Contribution Guidelines](./contributing.md) when contributing to this repository. For an explanation of the project structure, see [Project Structure](./project-structure.md). If you want to change or add translations and languages check out [Translating - Getting Started](./translating.md)
