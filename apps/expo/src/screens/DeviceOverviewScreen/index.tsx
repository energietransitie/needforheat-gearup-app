import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, useTheme, Button } from "@rneui/themed";
import { useContext, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import BuildingBottomSheet from "../../components/common/bottomSheets/BuildingBottomSheet";
import DeviceList from "./_deviceList";

import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import Screen from "@/components/elements/Screen";
import useTranslation from "@/hooks/translation/useTranslation";
import { UserContext } from "@/providers/UserProvider";
import { RootStackParamList, SettingsStackParamList } from "@/types/navigation";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type DeviceOverviewScreenProps = NativeStackScreenProps<RootStackParamList, "DeviceOverview">;

export default function DeviceOverviewScreen({ navigation, route }: DeviceOverviewScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, isLoading } = useContext(UserContext);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const settingsNavigation = useNavigation<NavigationProp<SettingsStackParamList>>();

  const buildings = user?.buildings ?? [];
  const [buildingId, setBuildingId] = useState<number | undefined>(buildings[0]?.id);

  const hasMultipleBuildings = buildings.length > 1;


  return (
    <Screen>
      <Box style={{ flex: 1 }} padded center>
        {isLoading || !buildingId ? (
          <StatusIndicator isLoading isError={!buildingId} />
        ) : (
          <>
            {hasMultipleBuildings ? (
              <TouchableOpacity
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.sm,
                }}
                onPress={() => bottomSheetRef.current?.present()}
              >
                <Text>
                  {t("screens.device_overview.building_list.building_info.name", { id: buildingId }) ??
                    t("screens.device_overview.building_list.placeholder")}
                </Text>
                <Icon name="chevron-down" size={16} />
              </TouchableOpacity>
            ) : null}
            <DeviceList buildingId={buildingId} />
            {hasMultipleBuildings ? (
              <BuildingBottomSheet
                bottomSheetRef={bottomSheetRef}
                buildingId={buildingId}
                onBuildingSelect={setBuildingId}
              />
            ) : null}
          </>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between", maxWidth: 300, width: "100%", }}>
          <Button title={t("screens.device_overview.buttons.install_device")} onPress={() => navigation.navigate("Home")} />
          <Button title={t("screens.device_overview.buttons.data_sources")} onPress={() => navigation.navigate("Settings")} />
        </View>
      </Box>
    </Screen >
  );
}
