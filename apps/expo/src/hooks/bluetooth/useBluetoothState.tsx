import { useEffect, useState } from "react";
import { Platform } from "react-native";
import BluetoothStateManager from "react-native-bluetooth-state-manager";

export default function useBluetoothState() {
  const [state, setState] = useState<BluetoothStateManager.BluetoothState>("Unknown");
  const [isResetting, setIsResetting] = useState(false);
  const isEnabled = state === "PoweredOn";

  useEffect(() => {
    const subscription = BluetoothStateManager.onStateChange(bluetoothState => {
      // Update state if it has changed
      if (bluetoothState !== state) {
        if (bluetoothState === "PoweredOn") {
          setIsResetting(false);
        }

        setState(bluetoothState);
      }
    }, true);

    return () => {
      subscription.remove();
    };
  }, []);

  const enable = async () => {
    const currentState = await BluetoothStateManager.getState();
    if (currentState === "PoweredOn") return;

    // Enable Bluetooth on Android if it's not already enabled
    if (Platform.OS === "android") {
      setIsResetting(true);
      await BluetoothStateManager.enable();
      return;
    }

    throw new Error(
      `Bluetooth is not enabled. Please enable it in ${
        Platform.OS === "ios" ? "the Control Center." : "your settings."
      }`
    );
  };

  return {
    state,
    enable,
    isEnabled,
    isResetting: isResetting || state === "Resetting",
  };
}
