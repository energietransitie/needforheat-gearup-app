# Yarn Scripts

| Workspace | Name                    | Description                                                                                               |
| --------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `/`       | build                   | Runs all build commands for all workspaces in parallel.                                                   |
| `/`       | dev                     | Runs all dev commands for all workspaces in parallel.                                                     |
| `/`       | lint                    | Runs all lint commands for all workspaces in parallel.                                                    |
| `/`       | test                    | Runs all test commands for all workspaces in parallel.                                                    |
| `/`       | lint:fix                | Runs all lint commands for all workspaces in parallel and applies a fix for it when available.            |
| `/`       | ci:eslint               | Command that runs `eslint` in the continuous integration pipeline.                                        |
| `/`       | ci:tsc                  | Command that runs the typechecker across the whole workspace in the continous integration pipeline.       |
| `/`       | format                  | Command that runs `prettier` across the whole workspace and automaticly writes possible formatting fixes. |
| `app`     | dev                     | Starts the app development server with `expo`.                                                            |
| `app`     | dev:android             | Compiles all native code for android and starts the development server.                                   |
| `app`     | dev:ios                 | Compiles all native code for iOS and starts the development server.                                       |
| `app`     | eas-build-pre-install   | Runs shell scripts before installing the dependencies to configure SSH keys for the CI/CD pipeline.       |
| `app`     | test                    | Runs all available tests.                                                                                 |
| `app`     | release:android:build   | Builds a release APK using Gradle.                                                                        |
| `app`     | release:android:install | Installs the release APK to all ADB-connected devices.                                                    |
| `app`     | dev:android:build       | Builds a dev APK using Gradle.                                                                            |
| `app`     | dev:android:install     | Installs the dev APK to all ADB-connected devices.                                                        |