/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Text, makeStyles } from "@rneui/themed";
import { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { MANUAL_URL } from "@env";
import DeviceGraph from "./_deviceGraph";

import StatusIndicator from "@/components/common/StatusIndicator";
import BuildingBottomSheet from "@/components/common/bottomSheets/BuildingBottomSheet";
import DeviceBottomSheet from "@/components/common/bottomSheets/DeviceBottomSheet";
import Box from "@/components/elements/Box";
import Screen from "@/components/elements/Screen";
import useDevices from "@/hooks/device/useDevices";
import useTranslation from "@/hooks/translation/useTranslation";
import { UserContext } from "@/providers/UserProvider";

export default function MeasurementsScreen() {
  const styles = useStyles();
  const { t, resolvedLanguage } = useTranslation();
  const { user, isLoading } = useContext(UserContext);

  const buildingBottomSheetRef = useRef<BottomSheetModal>(null);
  const deviceBottomSheetRef = useRef<BottomSheetModal>(null);

  const buildings = user?.buildings ?? [];
  const [buildingId, setBuildingId] = useState<number | undefined>(buildings[0]?.id);

  const { data: devices } = useDevices(buildingId ?? 0);
  const [deviceName, setDeviceName] = useState<string | undefined>();
  const [data, setData] = useState(null); // Initialize data state variable

  const hasMultipleBuildings = buildings.length > 1;
  const hasMultipleDevices = (devices?.length ?? 0) > 1;

  const deviceDropdownDisabled = !buildingId || !hasMultipleDevices;
  const ComleteUrl = MANUAL_URL + devices?.[0]?.device_type.name;

  useEffect(() => {
    fetchData();
    // Set device name to first device in list when devices are loaded
    if (devices?.length) {
      setDeviceName(devices[0].name);
    } else {
      setDeviceName(undefined);
    }
  }, [devices]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${ComleteUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      setData(fetchedData); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (isLoading || !buildingId) {
    return (
      <Screen>
        <Box style={{ flex: 1 }} padded center>
          <StatusIndicator isLoading isError={!buildingId} />
        </Box>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView>
        <Box style={{ flex: 1 }} padded>
          <TouchableOpacity
            disabled={!hasMultipleBuildings}
            style={[styles.dropdown, !hasMultipleBuildings ? { opacity: 0.5 } : {}]}
            onPress={() => buildingBottomSheetRef.current?.present()}
          >
            <Text>
              {buildingId
                ? t("screens.device_overview.building_list.building_info.name", { id: buildingId })
                : t("screens.device_overview.building_list.placeholder")}
            </Text>
            <Icon name="chevron-down" size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={deviceDropdownDisabled}
            style={[styles.dropdown, deviceDropdownDisabled ? { opacity: 0.5 } : null]}
            onPress={() => deviceBottomSheetRef.current?.present()}
          >
            <Text>{resolvedLanguage === "nl-NL" ? data?.["nl-NL"] : data?.["en-US"] ?? t("screens.measurements.graph.no_devices")}</Text>
            <Icon name="chevron-down" size={16} />
          </TouchableOpacity>

          {/* Data of last 14, 30 & 90 days */}
          {buildingId && deviceName ? (
            <>
              <DeviceGraph deviceName={deviceName} />
              <DeviceGraph deviceName={deviceName} dayRange={30} />
              <DeviceGraph deviceName={deviceName} dayRange={90} />
            </>
          ) : null}

          <BuildingBottomSheet
            bottomSheetRef={buildingBottomSheetRef}
            buildingId={buildingId}
            onBuildingSelect={setBuildingId}
          />
          <DeviceBottomSheet
            bottomSheetRef={deviceBottomSheetRef}
            buildingId={buildingId}
            deviceName={deviceName}
            onDeviceSelect={setDeviceName}
          />
        </Box>
      </ScrollView>
    </Screen>
  );
}

const useStyles = makeStyles(theme => ({
  dropdown: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
}));
