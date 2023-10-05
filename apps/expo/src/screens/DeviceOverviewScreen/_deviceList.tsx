import { t } from "i18next";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Button } from "react-native"; // Importeer de Button-component
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HomeStackParamList, SettingsStackParamList } from "@/types/navigation";
import DeviceListItem from "./_listItem";
import StatusIndicator from "@/components/common/StatusIndicator";
import useDevices from "@/hooks/device/useDevices";
import { BuildingDeviceResponse } from "@/types/api";
import { color } from "react-native-reanimated";

export default function DeviceList({ buildingId}: { buildingId: number }) {
  const { data, isLoading, refetch, isRefetching } = useDevices(buildingId);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const navigation = useNavigation<NavigationProp<HomeStackParamList | SettingsStackParamList>>();

  const onSwipeBegin = () => setScrollEnabled(false);
  const onSwipeEnd = () => setScrollEnabled(true);

  function onPressAddDevice() {
    navigation.navigate("QrScannerScreen");
  }


  function onPressOtherButton() {
    navigation.navigate("Settings", { screen: "ExternalProviderScreen" });
  }

  if (isLoading) {
    return <StatusIndicator isLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList<BuildingDeviceResponse>
        data={data}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ width: "100%" }}
        keyExtractor={item => item.name}
        renderItem={({ item }) => <DeviceListItem {...{ item, onSwipeBegin, onSwipeEnd }} />}
        ListEmptyComponent={
          <StatusIndicator isError errorText={t("screens.device_overview.device_list.empty_collection")} />
        }
        onRefresh={refetch}
        refreshing={isRefetching}
        scrollEnabled={scrollEnabled}
      />
      <Button
        title={t("screens.home_stack.home.buttons.add_device")}
        onPress={onPressAddDevice}
      />
      <Button
        title="data source" // Voeg de tekst voor de andere knop toe
        onPress={onPressOtherButton} // Koppel de onPress-functie voor de andere knop
        // Voeg andere eigenschappen voor de knop toe zoals gewenst
      />
    </View>
  );
}
