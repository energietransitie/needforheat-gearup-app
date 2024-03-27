import { Platform } from "react-native";
import { checkMultiple, Permission, PERMISSIONS, requestMultiple } from "react-native-permissions";

import useTranslation from "../translation/useTranslation";

const BLUETOOTH_PERMISSIONS = Platform.select<Permission[]>({
  android: [
    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ],
  ios: [PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL],
  default: [],
});

export default function useBluetoothPermission() {
  const { t } = useTranslation();

  const requestBluetoothPermission = async () => {
    const hasBluetoothPermission = await checkBluetoothPermission();
    if (hasBluetoothPermission) return;

    // Request permissions if not granted
    const requestStatusses = await requestMultiple(BLUETOOTH_PERMISSIONS);
    if (Object.values(requestStatusses).some(status => status !== "granted")) {
      // Will always error on iOS if not granted the first time
      throw new Error(t("hooks.bluetooth_permission.not_granted"));
    }
  };

  const checkBluetoothPermission = async () => {
    const checkStatusses = await checkMultiple(BLUETOOTH_PERMISSIONS);
    return Object.values(checkStatusses).every(status => status === "granted");
  };

  return { requestBluetoothPermission, checkBluetoothPermission };
}
