import Box from "@/components/elements/Box";
import { InvalidQrCodeException } from "@/exceptions/InvalidQrCodeException";
import { MismatchedDeviceNameException } from "@/exceptions/MismatchedDeviceNameException";
import useTranslation from "@/hooks/translation/useTranslation";
import useCameraPermission from "@/hooks/useCameraPermission/useCameraPermission";
import { SensorQrCode } from "@/types";
import { HomeStackParamList } from "@/types/navigation";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, makeStyles } from "@rneui/themed";
import { BarCodeScanner } from "expo-barcode-scanner";
import { BarCodeScanningResult, Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, Platform, Text } from "react-native";
import { openSettings } from "react-native-permissions";

type QrScannerScreenProps = NativeStackScreenProps<HomeStackParamList, "QrScannerScreen">;

export default function QrScannerScreen({ navigation, route }: QrScannerScreenProps) {
  const { expectedDeviceName } = route.params ?? {};
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const styles = useStyles();
  const focused = useIsFocused();
  const { requestCameraPermission, checkCameraPermission } = useCameraPermission();
  const { t } = useTranslation();

  const onRequestCameraError = (err: string) => {
    console.log("onRequestPermissionError", err);
    if (Platform.OS === "ios") {
      // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-empty-function  
      openSettings().catch(e => { });
    } else {
      Alert.alert("Error", err, [
        {
          text: t("screens.home_stack.search_device.open_settings"),
          onPress: () => {
            // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-empty-function
            openSettings().catch(e => { });
          },
        },
      ])
    }
  };

  const askForCameraPermission = async (): Promise<null> => {
    const permission = await checkCameraPermission();
    setHasPermission(permission);

    return new Promise((resolve, reject) => {
      if (!permission) {
        const title = t("screens.home_stack.qr_scanner.camera.alert.title");
        const message = t("screens.home_stack.qr_scanner.camera.alert.message");

        Alert.alert(title, message, [
          {
            text: t("screens.home_stack.qr_scanner.camera.alert.button"),
            onPress: async () => {
              try {
                await requestCameraPermission();
                resolve(null);
                setHasPermission(await checkCameraPermission());
              } catch (err: unknown) {
                const errorMsg =
                  err instanceof Error
                    ? err.message
                    : t("screens.home_stack.qr_scanner.errors.camera_request_failed");
                onRequestCameraError(errorMsg);
                reject(err);
              }
            },
          },
        ]);
      }
    })
  };

  const onError = (error?: string) => {
    Alert.alert("Error", error ?? t("screens.home_stack.qr_scanner.errors.unknown_error"), [
      {
        text: "OK",
        onPress: () => setScanned(false),
      },
    ]);
  };

  const onBarCodeScanned = (scanned: BarCodeScanningResult) => {
    setScanned(true);

    try {
      const data = JSON.parse(scanned.data) as SensorQrCode;

      if (!data?.name || !data?.pop || data?.transport !== "ble") {
        throw new InvalidQrCodeException();
      }

      if (expectedDeviceName && expectedDeviceName !== data.name) {
        throw new MismatchedDeviceNameException();
      }

      navigation.navigate("ActivateDeviceScreen", { qrData: data });
    } catch (e) {
      if (e instanceof InvalidQrCodeException) {
        onError(t("screens.home_stack.qr_scanner.errors.invalid_qr"));
      } else if (e instanceof MismatchedDeviceNameException) {
        onError(t("screens.home_stack.qr_scanner.errors.mismatched_device_name"));
      } else {
        onError();
      }
    }
  };

  useEffect(() => {
    !focused && setScanned(false);
    if (focused) {
      if (!hasPermission) askForCameraPermission();
    }
  }, [focused]);

  return (
    <Box center>
      {hasPermission ? (
        <>
          <Text style={styles.title}>{t("screens.home_stack.home.authenticated.title")}</Text>
          <Text style={styles.description}>{t("screens.home_stack.home.authenticated.description")}</Text>
          {focused && (
            <Camera
              onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
              ratio="16:9"
              style={{ flex: 1, width: "100%", height: "100%" }}
            />
          )}
        </>
      ) : (
        <>
          <Text>{t("screens.home_stack.qr_scanner.errors.no_permission")}</Text>
          <Button
            containerStyle={{ width: "100%" }}
            title={t("screens.home_stack.qr_scanner.camera.alert.enable_button")}
            onPress={() => askForCameraPermission()}
          />
        </>
      )}
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  title: {
    marginTop: theme.spacing.xl,
    fontFamily: "RobotoBold",
    fontSize: 24,
    paddingHorizontal: theme.spacing.lg,
  },
  description: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
}));
