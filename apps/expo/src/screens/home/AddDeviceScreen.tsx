import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";

import ManualContent from "@/components/common/ManualContent";
import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import useDevice from "@/hooks/device/useDevice";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { useEffect, useState } from "react";
import { MANUAL_URL } from "@/constants";

type AddDeviceScreenProps = NativeStackScreenProps<HomeStackParamList, "AddDeviceScreen">;

export default function AddDeviceScreen({ navigation, route }: AddDeviceScreenProps) {
  const { qrData } = route.params;
  const { theme } = useTheme();

  const { data: device, isFetching, isError } = useDevice(qrData.name);
  const { t, resolvedLanguage } = useTranslation();

  const { data: deviceTypeName, isLoading } = useDevice(device?.name || '');
  const [fetchedData, setFetchedData] = useState(null);
  const ComleteUrl = MANUAL_URL + deviceTypeName?.device_type.name;

  const fetchData = async () => {
    try {
      const response = await fetch(ComleteUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      setFetchedData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (ComleteUrl) {
      fetchData();
    }
  }, []);


  const onAddDevice = () => {
    navigation.navigate("SearchDeviceScreen", {
      deviceName: qrData.name,
      proofOfPossession: qrData.pop,
      device_TypeName: fetchedData?.[resolvedLanguage]
    });
  };

  const onCancel = () => navigation.navigate("HomeScreen");

  if (isFetching || isError) {
    return (
      <Box center padded>
        <StatusIndicator
          isError={isError}
          isLoading={isFetching}
          loadingText={t("screens.home_stack.add_device.status_indicator.working")}
          errorText={t("screens.home_stack.add_device.status_indicator.error")}
        />
      </Box>
    );
  }


  return (
    <Box padded style={{ flex: 1 }}>
      <ManualContent manualUrl={device?.device_type?.installation_manual_url} languageHeader={resolvedLanguage} />
      <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
        <Button
          containerStyle={{ flex: 1 }}
          title={t("common.cancel")}
          color="grey2"
          onPress={onCancel}
          icon={{
            name: "close-outline",
            type: "ionicon",
            color: theme.colors.white,
          }}
        />
        <Button
          containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
          title={t("common.connect")}
          color="primary"
          onPress={onAddDevice}
          icon={{
            name: "wifi-outline",
            type: "ionicon",
            color: theme.colors.white,
          }}
        />
      </Box>
    </Box>
  );
}
