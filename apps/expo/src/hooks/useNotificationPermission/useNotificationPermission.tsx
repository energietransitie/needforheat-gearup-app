import { Platform } from "react-native";
import { checkMultiple, Permission, PERMISSIONS, requestMultiple } from "react-native-permissions";

const NOTIFICATION_PERMISSIONS = Platform.select<Permission[]>({
  android: [PERMISSIONS.ANDROID.POST_NOTIFICATIONS],
  ios: [],
  default: [],
});

export default function useNotificationPermission() {
  const requestNotificationPermission = async () => {
    const hasCameraPermission = await checkNotificationPermission();
    if (hasCameraPermission) return;

    // Request permissions if not granted
    const requestStatusses = await requestMultiple(NOTIFICATION_PERMISSIONS);
    if (Object.values(requestStatusses).some(status => status !== "granted")) {
      throw new Error("Notification permission not granted");
    }
  };

  const checkNotificationPermission = async () => {
    const checkStatusses = await checkMultiple(NOTIFICATION_PERMISSIONS);
    console.log(checkStatusses)
    const statusValues = Object.values(checkStatusses).map(status => {
      if (status === "granted") {
        return 2; // "granted" -> 2
      } else if (status === "denied") {
        return 1; // "denied" -> 1
      } else {
        return 0; // "default" -> 0 (or any other status)
      }
    });
    const allGranted = statusValues.every(value => value === 2);
    return allGranted ? 2 : statusValues.includes(1) ? 1 : 0;
  };

  return { requestNotificationPermission, checkNotificationPermission };
}
