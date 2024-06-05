module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          path: "../../.env",
          verbose: false,
        },
      ],
      [
        "module-resolver",
        {
          // root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
          },
        },
      ],
      //[DO NOT UNCOMMENT!] WILL CRASH THE APP - TESTING NOT POSSIBLE ON REACT NATIVE
      //"@babel/plugin-proposal-class-properties",
      //"@babel/plugin-proposal-private-methods",
      "react-native-reanimated/plugin",
    ],
  };
};
