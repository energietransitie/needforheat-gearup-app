import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";
import RNExitApp from "react-native-exit-app";
import Ionicons from "react-native-vector-icons/Ionicons";

import Box from "@/components/elements/Box";
import useDeviceConnect from "@/hooks/device/useDeviceConnect";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { HomeStackParamList } from "@/types/navigation";

type ConnectScreenProps = NativeStackScreenProps<HomeStackParamList, "ConnectScreen">;

export default function ConnectScreen({ navigation, route }: ConnectScreenProps) {
  const { device, proofOfPossession, device_TypeName, normalName } = route.params;
  const focused = useIsFocused();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isConnected, connectToDevice } = useDeviceConnect({ device, proofOfPossession });
  const exitTheApp = () => RNExitApp.exitApp();

  // Disable going back while connecting to prevent unexpected behaviour
  useDisableBackButton(false);

  const onSearch = () => {
    navigation.navigate("SearchDeviceScreen", {
      deviceName: device.deviceName,
      proofOfPossession,
      device_TypeName,
      normalName,
    });
  };

  const onError = (error?: string) => {
    console.log(`Connection to ${device.deviceName} failed: ${error}`);

    Alert.alert("Error", `${t("screens.home_stack.connect.alert.unknown_error")}${error ? `\n\n${error}` : ""}`, [
      {
        text: t("common.back_to_home") as string,
        onPress: () => navigation.navigate("HomeScreen"),
        style: "cancel",
      },
      {
        text: t("screens.home_stack.connect.alert.retry") as string,
        onPress: onSearch,
      },
    ]);
  };

  const onDeviceConnected = () => {
    setTimeout(() => {
      navigation.navigate("WifiOverviewScreen", { device, proofOfPossession, device_TypeName, normalName });
    }, 500);
  };

  const ConnectIcon = () => {
    return isConnected ? (
      <Ionicons name="checkmark" size={32} color={theme.colors.success} />
    ) : (
      <ActivityIndicator size="large" />
    );
  };

  const ConnectText = () => {
    return isConnected ? (
      <Text>{t("screens.home_stack.connect.status.connected", { name: normalName })}</Text>
    ) : (
      <Text>{t("screens.home_stack.connect.status.connecting", { name: normalName })}</Text>
    );
  };

  useEffect(() => {
    if (focused) {
      connectToDevice(
        () => {
          onDeviceConnected();
          clearTimeout(connectionTimeout);
        },
        error => {
          onError(error);
          clearTimeout(connectionTimeout);
        }
      );

      const connectionTimeout = setTimeout(() => {
        if (!isConnected) {
          Alert.alert(
            `${t("screens.home_stack.connect.title_timeout")}`,
            `${t("screens.home_stack.connect.alert.timeout")}`,
            [
              {
                text: t("screens.home_stack.connect.alert.Exit") as string,
                onPress: () => {
                  exitTheApp();
                },
              },
            ]
          );
        }
      }, 20000);

      return () => {
        clearTimeout(connectionTimeout);
      };
    }
    return undefined;
  }, [focused]);

  return (
    <Box center padded>
      <ConnectIcon />
      <Box style={{ marginTop: 16 }}>
        <ConnectText />
      </Box>
    </Box>
  );
}
