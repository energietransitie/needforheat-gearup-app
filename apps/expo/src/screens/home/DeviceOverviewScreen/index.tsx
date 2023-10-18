import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, useTheme, Button } from "@rneui/themed";
import { useContext, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import DeviceList from "./_deviceList";
import CircleMenu from "./circleMenu";
import BuildingBottomSheet from "../../../components/common/bottomSheets/BuildingBottomSheet";

import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import Screen from "@/components/elements/Screen";
import useTranslation from "@/hooks/translation/useTranslation";
import { UserContext } from "@/providers/UserProvider";
import { RootStackParamList } from "@/types/navigation";

type DeviceOverviewScreenProps = NativeStackScreenProps<RootStackParamList, "DeviceOverview">;

export default function DeviceOverviewScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, isLoading } = useContext(UserContext);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const buildings = user?.buildings ?? [];
  const [buildingId, setBuildingId] = useState<number | undefined>(buildings[0]?.id);

  const hasMultipleBuildings = buildings.length > 1;

  return (
    <Screen>
      <Box style={{ flex: 1, justifyContent: "center", alignItems: "center" }} padded>
        {isLoading || !buildingId ? (
          <StatusIndicator isLoading isError={!buildingId} />
        ) : (
          <>
            <View style={{ flex: 1 }}>
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
              <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <DeviceList buildingId={buildingId} />
              </View>
              {hasMultipleBuildings ? (
                <BuildingBottomSheet
                  bottomSheetRef={bottomSheetRef}
                  buildingId={buildingId}
                  onBuildingSelect={setBuildingId}
                />
              ) : null}
            </View>
          </>
        )}
      </Box>
      <View style={{ position: "absolute", bottom: 10, right: 10 }}>
        <CircleMenu />
      </View>
    </Screen>
  );
}
