import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, Text, makeStyles, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, View } from "react-native";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import EspIdfProvisioning from "react-native-esp-idf-provisioning";
import { openSettings } from "react-native-permissions";
import Ionicons from "react-native-vector-icons/Ionicons";

import Box from "@/components/elements/Box";
import { MANUAL_URL } from "@/constants";
import useBluetoothPermission from "@/hooks/bluetooth/useBluetoothPermission";
import useBluetoothState from "@/hooks/bluetooth/useBluetoothState";
import useDevice from "@/hooks/device/useDevice";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { BleDeviceType } from "@/types";
import { HomeStackParamList } from "@/types/navigation";
import { withTimeout } from "@/utils/withTimeout";

const useStyles = makeStyles(theme => ({
  text: {
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  secondaryText: {
    marginTop: theme.spacing.xs,
  },
}));

type SearchDeviceScreenProps = NativeStackScreenProps<HomeStackParamList, "SearchDeviceScreen">;

export default function SearchDeviceScreen({ navigation, route }: SearchDeviceScreenProps) {
  const { deviceName, proofOfPossession, device_TypeName } = route.params;
  const styles = useStyles();
  const { requestBluetoothPermission, checkBluetoothPermission } = useBluetoothPermission();
  const {
    enable: enableBluetooth,
    isEnabled: isBluetoothEnabled,
    isResetting: isBluetoothResetting,
  } = useBluetoothState();
  const [devices, setDevices] = useState<BleDeviceType[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isError, setIsError] = useState(false);
  const { t, resolvedLanguage } = useTranslation();
  const focused = useIsFocused();
  const { theme } = useTheme();

  useDisableBackButton(true);

  const targetDevice = devices?.find(foundDevice => foundDevice.deviceName === deviceName);

  const onRequestPermissionError = (err: string) => {
    console.log("onRequestPermissionError", err);

    Alert.alert("Error", err, [
      {
        text: t("screens.home_stack.search_device.open_settings"),
        onPress: () => {
          // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-empty-function
          openSettings().catch(e => {});
        },
      },
    ]);
  };

  const onEnableBluetoothError = (err: string) => {
    console.log("onEnableBluetoothError", err);

    Alert.alert("Error", err, [
      Platform.OS === "ios"
        ? {
            text: "OK",
          }
        : {
            text: "Open settings",
            onPress: () => {
              // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-empty-function
              BluetoothStateManager.openSettings().catch(e => {});
            },
          },
    ]);
  };

  const askForBluetoothPermission = async (): Promise<null> => {
    return new Promise((resolve, reject) => {
      let title = "";
      let message = "";
      if (Platform.OS === "android") {
        title = t("screens.home_stack.search_device.bluetooth.alert.title");
        message = t("screens.home_stack.search_device.bluetooth.alert.message");
      }
      Alert.alert(title, message, [
        {
          text: t("screens.home_stack.search_device.bluetooth.alert.button"),
          onPress: async () => {
            try {
              await requestBluetoothPermission();
              resolve(null);
            } catch (err: unknown) {
              const errorMsg =
                err instanceof Error
                  ? err.message
                  : t("screens.home_stack.search_device.errors.bluetooth.request_failed");
              onRequestPermissionError(errorMsg);

              setIsScanning(false);
              setIsError(true);
              reject(err);
            }
          },
        },
      ]);
    });
  };

  // useEffect(() => {
  //   const handleBluetoothReset = async () => {
  //     if (isBluetoothResetting) {
  //       try {
  //         const bluetoothState = await BluetoothStateManager.getState();
  //         if (bluetoothState !== "PoweredOn") {
  //           // Voer hier de logica uit om Bluetooth in te schakelen en scanDevices aan te roepen
  //           await enableBluetooth();
  //           await scanDevices();
  //         }
  //       } catch (error) {
  //         console.error("Error checking Bluetooth state:", error);
  //       }
  //     }
  //   };

  //   handleBluetoothReset();
  // }, [isBluetoothResetting]);

  const scanDevices = async () => {
    if (isScanning) return;

    setIsScanning(true);
    setIsError(false);

    const hasBluetoothPermission = await checkBluetoothPermission();
    if (!hasBluetoothPermission) {
      await askForBluetoothPermission();
    }

    try {
      await enableBluetooth();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : t("screens.home_stack.search_device.errors.bluetooth.enable_failed");
      onEnableBluetoothError(errorMsg);

      setIsScanning(false);
      setIsError(true);
      return;
    }

    try {
      // Scan at most 30 seconds for devices
      const devices = await withTimeout<BleDeviceType[]>(30, EspIdfProvisioning.getBleDevices(""));
      setDevices(devices);
    } catch {
      setIsError(true);
    } finally {
      setIsScanning(false);
    }
  };

  const onConnect = (device: BleDeviceType, proofOfPossession: string, device_TypeName: any) => {
    // Before connecting to the device, navigate to the activation screen
    // to register the device on the server
    setTimeout(() => {
      navigation.navigate("ConnectScreen", {
        device,
        proofOfPossession,
        device_TypeName,
      });
    }, 500);
  };

  useEffect(() => {
    // If the qrData.name exists in the devices list, connect to it
    if (targetDevice) {
      onConnect(targetDevice, proofOfPossession, device_TypeName);
    }
  }, [devices]);

  useEffect(() => {
    if (focused) {
      scanDevices();
    }
  }, [focused]);

  useEffect(() => {
    if (isBluetoothEnabled && focused && isError && !isScanning) {
      scanDevices();
    }
  }, [isBluetoothEnabled]);

  const hasFoundDevice = !isScanning && targetDevice;

  // Scanning is disabled if bluetooth is being enabled/disabled, the device is already scanning, or if the target device has been found.
  const isScanningDisabled = isBluetoothResetting || isScanning || Boolean(targetDevice);

  return (
    <Box padded center>
      <Box center>
        {isError && (
          <>
            {isBluetoothResetting ? (
              <>
                <ActivityIndicator size="large" />
                <Text style={styles.text}>{t("screens.home_stack.search_device.bluetooth.enabling")}</Text>
                <View style={{ marginTop: 20 }} />
                <Button
                  containerStyle={{ width: "100%" }}
                  title={t("screens.home_stack.search_device.bluetooth.alert.enable_button")}
                  onPress={() => BluetoothStateManager.openSettings()}
                />
              </>
            ) : (
              <>
                <Ionicons name="alert-circle-outline" size={32} color={theme.colors.error} />
                <Text style={styles.text}>{t("screens.home_stack.search_device.bluetooth.error.title")}</Text>
                <Text style={[styles.text, styles.secondaryText]}>
                  {t("screens.home_stack.search_device.bluetooth.error.message")}
                </Text>
              </>
            )}
          </>
        )}
        {!isError && (
          <>
            {isScanning && (
              <>
                <ActivityIndicator size="large" />
                <Text style={styles.text}>
                  {t("screens.home_stack.search_device.scanning.message", { name: device_TypeName })}
                </Text>
              </>
            )}
            {!isScanning && !targetDevice && (
              <>
                <Ionicons name="help-circle-outline" size={32} color={theme.colors.error} />
                <Text style={styles.text}>
                  {t("screens.home_stack.search_device.scanning.not_found.title", { name: device_TypeName })}
                </Text>
                <Text style={[styles.text, styles.secondaryText]}>
                  {t("screens.home_stack.search_device.scanning.not_found.message")}
                </Text>
              </>
            )}
            {hasFoundDevice && (
              <>
                <Ionicons name="checkmark" size={32} color={theme.colors.success} />
                <Text style={styles.text}>
                  {t("screens.home_stack.search_device.scanning.found", { name: device_TypeName })}
                </Text>
              </>
            )}
          </>
        )}
      </Box>
      <Box style={{ width: "100%" }}>
        <Button
          containerStyle={{ width: "100%" }}
          disabled={isScanningDisabled}
          icon={<Icon name="refresh" color={theme.colors.grey4} containerStyle={{ marginRight: 5 }} />}
          title="Scan"
          onPress={scanDevices}
        />
      </Box>
    </Box>
  );
}
