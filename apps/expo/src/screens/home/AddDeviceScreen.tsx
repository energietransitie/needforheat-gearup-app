import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";

import ManualContent from "@/components/common/ManualContent";
import Box from "@/components/elements/Box";
import { MANUAL_URL } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { useEffect, useState } from "react";

type AddDeviceScreenProps = NativeStackScreenProps<HomeStackParamList, "AddDeviceScreen">;

export default function AddDeviceScreen({ navigation, route }: AddDeviceScreenProps) {
  const { expectedDeviceName, device } = route.params;
  const { theme } = useTheme();
  const { t, resolvedLanguage } = useTranslation();
  const [fetchedData, setFetchedData] = useState(null);
  const ComleteUrl = MANUAL_URL + device.name;

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
    navigation.navigate("QrScannerScreen")
  };

  const onCancel = () => navigation.navigate("HomeScreen");


  return (
    <Box padded style={{ flex: 1 }}>
      <ManualContent manualUrl={device.installation_manual_url} languageHeader={resolvedLanguage} />
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
