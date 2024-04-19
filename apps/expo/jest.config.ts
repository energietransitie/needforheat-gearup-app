import type { Config } from "jest";

const config: Config = {
  fakeTimers: {
    doNotFake: ["nextTick"],
    timerLimit: 1000,
  },
  preset: "react-native",
  testPathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/dist"],
  setupFilesAfterEnv: ["./jest-setup.js"],
  transformIgnorePatterns: [
    "<rootDir>/../../node_modules/(?!(@react-native|react-native|@rneui/base)/)",
    "<rootDir>/../../node_modules/(?!(@react-native|react-native|react-native-vector-icons)/)",
    "<rootDir>/../../node_modules/(?!(@react-native|react-native|react-native-gesture-handler)/)",
  ],
  testMatch: ["**/__test__/**/*.tsx", "**/?(*.)+(spec|test).tsx"],
  globals: {
    __DEV__: true,
  },
  transform: {
    "\\.(js|jsx|ts|tsx)$": require.resolve("babel-jest"),
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

module.exports = config;
