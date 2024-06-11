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
      if (Platform.OS === "ios") {
        throw new Error(t("hooks.bluetooth_permission.not_granted_ios") as string);
      } else {
        throw new Error(t("hooks.bluetooth_permission.not_granted_android") as string);
      }
    }
  };

  const checkBluetoothPermission = async () => {
    const checkStatusses = await checkMultiple(BLUETOOTH_PERMISSIONS);
    return Object.values(checkStatusses).every(status => status === "granted");
  };

  return { requestBluetoothPermission, checkBluetoothPermission };
}
