import { Platform } from "react-native";
import { checkMultiple, Permission, PERMISSIONS, requestMultiple } from "react-native-permissions";

import useTranslation from "../translation/useTranslation";

const LOCATION_PERMISSIONS = Platform.select<Permission[]>({
  android: [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
  ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
  default: [],
});

export default function usePreciseLocationPermission() {
  const { t } = useTranslation();

  const requestPreciseLocationPermission = async () => {
    const hasPreciseLocationPermission = await checkPreciseLocationPermission();
    if (hasPreciseLocationPermission) return;

    // Request permissions if not granted
    const requestStatusses = await requestMultiple(LOCATION_PERMISSIONS);
    if (Object.values(requestStatusses).some(status => status !== "granted")) {
      if (Platform.OS === "ios") {
        throw new Error(t("hooks.camera_permission.not_granted_ios"));
      } else {
        throw new Error(t("hooks.camera_permission.not_granted_android"));
      }
    }
  };

  const checkPreciseLocationPermission = async () => {
    const checkStatusses = await checkMultiple(LOCATION_PERMISSIONS);
    return Object.values(checkStatusses).every(status => status === "granted");
  };

  return { requestPreciseLocationPermission, checkPreciseLocationPermission };
}
