# Android development

When developing for Android you need to have Android Studio installed. You can find more information about the setup [here](https://docs.expo.io/workflow/android-studio-emulator/).

After getting the prerequisites installed you can start the development server with the following command:

```bash
yarn workspace app dev:android
```

This will ask you to select a device or simulator to run the app on. It is recommended for developing that you select a device because of the limitations of the simulator.

## Limitations

Although the Android simulator is great for rapid development, it does come with a few limitations.

The following hardware is unavailable in Simulator:

- Audio Input
- Barometer
- Camera
- Motion Support (accelerometer and gyroscope)

This means that specificly testing the `NeedForHeat` app that the simulator isn't of any use because the camera is needed to detect the QR code.
