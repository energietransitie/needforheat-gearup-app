# iOS development

When developing for iOS you need to have a Mac with Xcode installed. You can find more information about the setup [here](https://docs.expo.io/workflow/ios-simulator/).

After getting the prerequisites installed you can start the development server with the following command:

```bash
yarn workspace app dev:ios
```

This will ask you to select a device or simulator to run the app on. It is recommended for developing that you connect your iPhone to your Mac and select that device because of the limitations of the simulator.

## Limitations

Although the iOS simulator is great for rapid development, it does come with a few limitations.

The following hardware is unavailable in Simulator:

- Audio Input
- Barometer
- Camera
- Motion Support (accelerometer and gyroscope)

This means that specificly testing the `NeedForHeat` app that the simulator isn't of any use because the camera is needed to detect the QR code.

## Issues

> The CLI seems to be stuck when opening a Simulator

Sometimes the iOS simulator doesn't respond to the open command. If it seems stuck on this prompt, you can open the iOS simulator manually `(open -a Simulator)` and then in the macOS toolbar, choose Hardware → Device, and select an iOS version and device that you'd like to open.
