# iOS development
You should have read the [main developing guide](./developing.md) before looking into the iOS guide.

When developing for iOS you need to have a Mac with Xcode and Ruby 3.1.0 installed (for the simulator). You can find more information about the setup over at the [Expo documentation on iOS development](https://docs.expo.io/workflow/ios-simulator/).

Please make sure the Mac you have has sudo privileges so you are able to set it up correctly.

## Expo Go
### Ruby
To install Cocoapods, Ruby is required. MacOS comes with a built-in version of Ruby that might not match the required version of this project. To install the correct version of Ruby, you can use `rbenv` using `homebrew`.

If you don't have homebrew, you can learn more at [brew.sh](https://brew.sh/).

To install `rbenv` you can run the following command:

```bash
brew install rbenv
```

Then, install the correct version of Ruby (3.1.0) using `rbenv`:

```bash
rbenv install 3.1.0
```

After installing Ruby, you can set the global version of Ruby to 3.1.0:

```bash
rbenv global 3.1.0
```

You can verify that the correct version of Ruby is installed by running:

```bash
ruby -v
```

This should output something along the lines of `ruby 3.1.0p0 (2021-12-25 revision 123456) [x86_64-darwin20]`.

If this isn't the case, check where your Ruby version is coming from by running `which ruby`. If this is not the version you just installed, you can run `rbenv init` to get instructions on how to fix this.

If that doesn't work, try eval

```bash
eval "$(rbenv init -)"
```

and then run `which ruby` again.

### Pods
After installing Ruby correctly, you can install the required pods by running the following command in the `ios` directory:

```bash
cd /apps/expo/ios

pod install
```

After getting the prerequisites installed you can start the development server with the following command for running with Expo Go:

```bash
yarn workspace app dev:ios
```

This will ask you to select a device or simulator to run the app on. It is recommended for developing that you connect your iPhone to your Mac and select that device because of the limitations of the simulator.

### Simulator Limitations
The following hardware is unavailable in simulator:

- Audio Input
- Barometer
- Camera
- Motion Support (accelerometer and gyroscope)

This means that specificly testing the `NeedForHeat` app that the simulator isn't of any use because the camera is needed to detect the QR code.

## Using a physical device
You can connect a phyiscal iPhone with USB to the Macbook. It will then automatically prepare the iPhone to support Xcode builds in `Window -> Devices and Simulators`

## Issues

> The CLI seems to be stuck when opening a simulator

Sometimes the iOS simulator doesn't respond to the open command. If it seems stuck on this prompt, you can open the iOS simulator manually `(open -a Simulator)` and then in the macOS toolbar, choose Hardware → Device, and select an iOS version and device that you'd like to open.

> I get an error while building the app in Xcode or when running dev:ios
 If you get the following error:

 ```bash
 ❌  (ios/Pods/boost/boost/container_hash/hash.hpp:131:33)

   129 | #else
   130 |         template <typename T>
 > 131 |         struct hash_base : std::unary_function<T, std::size_t> {};
       |                                 ^ no template named 'unary_function' in namespace 'std'; did you mean '__unary_function'?
   132 | #endif
   133 | 
   134 |         struct enable_hash_value { typedef std::size_t type; };
   ```

Open up Xcode, execute a build, select the error that pops up and select 'Fix'. This will replace the `std::unary_function` with `std::__unary_function` and the build should succeed just fine. You'll also be able to run dev:ios again.
