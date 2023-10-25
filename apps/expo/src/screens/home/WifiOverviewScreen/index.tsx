import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler } from "react-native";

import WifiNetworkList from "./WifiNetworkList";
import WifiConnectBottomSheet from "./_wifiConnectBottomSheet";

import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import Screen from "@/components/elements/Screen";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import useStoredWifiNetworks from "@/hooks/wifi/useStoredWifiNetworks";
import useWifiNetworks from "@/hooks/wifi/useWifiNetworks";
import { Maybe, WifiEntry } from "@/types";
import { HomeStackParamList } from "@/types/navigation";

type WifiOverviewScreenProps = NativeStackScreenProps<HomeStackParamList, "WifiOverviewScreen">;

export default function WifiOverviewScreen({ navigation, route }: WifiOverviewScreenProps) {
  const { device, proofOfPossession, device_TypeName } = route.params;
  const [selectedNetwork, setSelectedNetwork] = useState<Maybe<WifiEntry>>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();
  const { storedWifiNetworks } = useStoredWifiNetworks();
  const {
    data: networks,
    isInitialLoading: isLoading,
    isError,
    failureCount,
    refetch,
    isRefetching,
  } = useWifiNetworks(device.deviceName);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      navigation.goBack();
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);


  const onProvision = (network: WifiEntry, password?: string) => {
    bottomSheetRef.current?.close();

    navigation.navigate("ProvisionScreen", {
      device,
      proofOfPossession,
      network,
      password,
      device_TypeName
    });
  };

  const onReconnect = () => {
    navigation.navigate("SearchDeviceScreen", {
      deviceName: device.deviceName,
      proofOfPossession,
      device_TypeName
    });
  };

  const onLeave = () => navigation.navigate("HomeScreen");

  const onFetchError = () => {
    Alert.alert(
      t("screens.home_stack.wifi_overview.alerts.fetch_error.title"),
      t("screens.home_stack.wifi_overview.alerts.fetch_error.message"),
      [
        {
          text: t("common.back_to_home"),
          onPress: onLeave,
          style: "cancel",
        },
        {
          text: t("common.retry"),
          onPress: onReconnect,
        },
      ]
    );
  };

  const onConnect = async (network: WifiEntry) => {
    if (!network.name) {
      Alert.alert(
        t("screens.home_stack.wifi_overview.alerts.connect.hidden_wifi.title"),
        t("screens.home_stack.wifi_overview.alerts.connect.hidden_wifi.message")
      );
      return;
    }

    // If the network is open, navigate to the provisioning screen immediately
    if (network.security === 0) {
      onProvision(network);
      return;
    }

    if (network.security && network.security > 4) {
      Alert.alert(
        t("screens.home_stack.wifi_overview.alerts.connect.invalid_wifi.title"),
        t("screens.home_stack.wifi_overview.alerts.connect.invalid_wifi.message")
      );

      return;
    }

    // Prompt the user to use the stored password if the network is present in storedWifiNetworks
    const storedNetwork = storedWifiNetworks?.find(n => n.name === network.name);
    if (storedNetwork) {
      promptForKnownNetwork(storedNetwork);
      return;
    }

    promptForPassword(network);
  };

  const promptForKnownNetwork = (network: WifiEntry) => {
    Alert.alert(
      t("screens.home_stack.wifi_overview.alerts.known_network.title"),
      t("screens.home_stack.wifi_overview.alerts.known_network.message", { name: network.name }),
      [
        {
          text: t("common.no"),
          style: "cancel",
          onPress: () => promptForPassword(network),
        },
        {
          text: t("screens.home_stack.wifi_overview.alerts.known_network.buttons.yes"),
          onPress: () => {
            onProvision(network, network.password);
          },
        },
      ]
    );
  };

  const promptForPassword = (network: WifiEntry) => {
    // Prompt the user for the network password and navigate to the provisioning screen on success
    setSelectedNetwork(network);
    bottomSheetRef.current?.present();
  };

  useEffect(() => {
    if (isError) {
      onFetchError();
    }
  }, [isError]);

  return isLoading || isError ? (
    <Screen>
      <Box center padded>
        <StatusIndicator
          isLoading={isLoading}
          isError={isError}
          loadingText={
            failureCount > 0
              ? t("screens.home_stack.wifi_overview.status_indicator.unexpected_loading")
              : t("screens.home_stack.wifi_overview.status_indicator.loading")
          }
          errorText={t("screens.home_stack.wifi_overview.status_indicator.error")}
        />
      </Box>
    </Screen>
  ) : (
    <Screen>
      <WifiNetworkList networks={networks ?? []} onConnect={onConnect} onRefresh={refetch} refreshing={isRefetching} />
      <WifiConnectBottomSheet bottomSheetRef={bottomSheetRef} network={selectedNetwork} onProvision={onProvision} />
    </Screen>
  );
}
