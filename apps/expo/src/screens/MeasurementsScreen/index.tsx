/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Text, makeStyles } from "@rneui/themed";
import { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { MANUAL_URL } from "@/constants";
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
  const [deviceIdentifierName, setDeviceIdentifierName] = useState<string | undefined>();
  const [fetchedData, setFetchedData] = useState(null);

  const [displayName, setDisplayName] = useState<string | null>(null);

  const [deviceId, setDeviceId] = useState<number>();
  const hasMultipleBuildings = buildings.length > 1;
  const hasMultipleDevices = (devices?.length ?? 0) > 1;
  const CompleteURL = devices && devices.length > 0 ? MANUAL_URL + devices[0].device_type.name : '';
  const deviceDropdownDisabled = !buildingId || !hasMultipleDevices;

  useEffect(() => {
    if (devices?.length) {
      setDeviceIdentifierName(devices[0].name);
      setDeviceId(devices[0].id);
    }

  }, [devices]);

  useEffect(() => {
    if (CompleteURL) {
      fetch(CompleteURL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setFetchedData(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [CompleteURL, resolvedLanguage]);

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
            {hasMultipleBuildings &&
              <Icon name="chevron-down" size={16} />
            }
          </TouchableOpacity>
          <TouchableOpacity
            disabled={deviceDropdownDisabled}
            style={[styles.dropdown, deviceDropdownDisabled ? { opacity: 0.5 } : null]}
            onPress={() => deviceBottomSheetRef.current?.present()}
          >
            <Text>
              {displayName === null ? (fetchedData?.[resolvedLanguage] || t("screens.measurements.graph.no_devices")) : displayName || t("screens.measurements.graph.no_devices")}
            </Text>
            <Icon name="chevron-down" size={16} />
          </TouchableOpacity>

          {/* Data of last 14, 30 & 90 days */}
          {buildingId && deviceIdentifierName ? (
            <>
              <DeviceGraph deviceName={deviceIdentifierName} />
              <DeviceGraph deviceName={deviceIdentifierName} dayRange={30} />
              <DeviceGraph deviceName={deviceIdentifierName} dayRange={90} />
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
            deviceName={deviceIdentifierName}
            onDeviceIdentifier={setDisplayName}
            onDisplayName={setDeviceIdentifierName}
            onDeviceId={setDeviceId}
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