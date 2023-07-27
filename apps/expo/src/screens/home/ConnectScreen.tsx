import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import Box from "@/components/elements/Box";
import useDeviceConnect from "@/hooks/device/useDeviceConnect";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { HomeStackParamList } from "@/types/navigation";

type ConnectScreenProps = NativeStackScreenProps<HomeStackParamList, "ConnectScreen">;

export default function ConnectScreen({ navigation, route }: ConnectScreenProps) {
  const { device, proofOfPossession } = route.params;
  const focused = useIsFocused();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isConnected, connectToDevice } = useDeviceConnect({ device, proofOfPossession });

  // Disable going back while connecting to prevent unexpected behaviour
  useDisableBackButton(true);

  const onSearch = () => {
    navigation.navigate("SearchDeviceScreen", {
      deviceName: device.deviceName,
      proofOfPossession,
    });
  };

  const onError = (error?: string) => {
    console.log(`Connection to ${device.deviceName} failed: ${error}`);

    Alert.alert("Error", `${t("screens.home_stack.connect.alert.unknown_error")}${error ? `\n\n${error}` : ""}`, [
      {
        text: t("common.back_to_home"),
        onPress: () => navigation.navigate("HomeScreen"),
        style: "cancel",
      },
      {
        text: t("screens.home_stack.connect.alert.retry"),
        onPress: onSearch,
      },
    ]);
  };

  const onDeviceConnected = () => {
    setTimeout(() => {
      navigation.navigate("WifiOverviewScreen", { device, proofOfPossession });
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
      <Text>{t("screens.home_stack.connect.status.connected", { name: device.deviceName })}</Text>
    ) : (
      <Text>{t("screens.home_stack.connect.status.connecting", { name: device.deviceName })}</Text>
    );
  };

  useEffect(() => {
    if (focused) {
      connectToDevice(onDeviceConnected, onError);
    }
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