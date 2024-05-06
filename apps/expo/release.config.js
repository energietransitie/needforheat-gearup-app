module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    [
      "semantic-release-react-native",
      {
        iosPath: "apps/expo/ios",
        androidPath: "apps/expo/android/app/build.gradle",
        versionStrategy: {
          android: { buildNumber: "increment" },
          ios: { buildNumber: "increment" },
        },
      },
    ],
    [
      "@google/semantic-release-replace-plugin",
      {
        replacements: [
          {
            files: ["app.json"],
            from: '"version": ".*"',
            to: '"version": "${nextRelease.version}"',
          },
          {
            files: ["app.json"],
            from: '"buildNumber": ".*"',
            to: '"buildNumber": "${nextRelease.version}"',
          },
          {
            files: ["app.json"],
            from: `"versionCode": .*$`,
            to: match => {
              const hadComma = match.includes(",");
              // eslint-disable-next-line radix
              const currVersion = parseInt(match.split(":")[1].trim()) || 0;
              const nextVersion = currVersion + 1;
              return `"versionCode": ${nextVersion}${hadComma ? "," : ""}`;
            },
          },
        ],
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          "package.json",
          "package-lock.json",
          "app.json",
          "android/app/build.gradle",
          "ios/**/Info.plist",
          "ios/**/*.pbxproj",
        ],
        message: "chore(release): ${nextRelease.version}\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
};
