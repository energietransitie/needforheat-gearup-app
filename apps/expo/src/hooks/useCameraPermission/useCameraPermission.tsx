import { Platform } from "react-native";
import { checkMultiple, Permission, PERMISSIONS, requestMultiple } from "react-native-permissions";

import useTranslation from "../translation/useTranslation";

const CAMERA_PERMISSIONS = Platform.select<Permission[]>({
  android: [PERMISSIONS.ANDROID.CAMERA],
  ios: [PERMISSIONS.IOS.CAMERA],
  default: [],
});

export default function useCameraPermission() {
  const { t } = useTranslation();

  const requestCameraPermission = async () => {
    const hasCameraPermission = await checkCameraPermission();
    if (hasCameraPermission) return;

    // Request permissions if not granted
    const requestStatusses = await requestMultiple(CAMERA_PERMISSIONS);
    if (Object.values(requestStatusses).some(status => status !== "granted")) {
      if (Platform.OS === "ios") {
        throw new Error(t("hooks.camera_permission.not_granted_ios") as string);
      } else {
        throw new Error(t("hooks.camera_permission.not_granted_android") as string);
      }
    }
  };

  const checkCameraPermission = async () => {
    const checkStatusses = await checkMultiple(CAMERA_PERMISSIONS);
    return Object.values(checkStatusses).every(status => status === "granted");
  };

  return { requestCameraPermission, checkCameraPermission };
}
