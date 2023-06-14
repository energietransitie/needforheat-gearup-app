import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BarCodeScanner } from "expo-barcode-scanner";
import { BarCodeScanningResult, Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, Text } from "react-native";

import Box from "@/components/elements/Box";
import { InvalidQrCodeException } from "@/exceptions/InvalidQrCodeException";
import { MismatchedDeviceNameException } from "@/exceptions/MismatchedDeviceNameException";
import useTranslation from "@/hooks/translation/useTranslation";
import { SensorQrCode } from "@/types";
import { HomeStackParamList } from "@/types/navigation";

type QrScannerScreenProps = NativeStackScreenProps<HomeStackParamList, "QrScannerScreen">;

export default function QrScannerScreen({ navigation, route }: QrScannerScreenProps) {
  const { expectedDeviceName } = route.params ?? {};
  const [scanned, setScanned] = useState(false);
  const focused = useIsFocused();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const { t } = useTranslation();
  const hasPermission = permission?.granted;

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
  }, [focused]);

  if (!hasPermission) {
    requestPermission();
  }

  return (
    <Box center>
      {hasPermission ? (
        <>
          {focused && (
            <Camera
              onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
              ratio="16:9"
              style={{ flex: 1, height: "100%", width: "100%" }}
            />
          )}
        </>
      ) : (
        <Text>{t("screens.home_stack.qr_scanner.errors.no_permission")}</Text>
      )}
    </Box>
  );
}
