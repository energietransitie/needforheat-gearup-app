/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Text, makeStyles } from "@rneui/themed";
import { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
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
  const hasMultipleDevices = (devices?.length ?? 0) > 1;
  const CompleteURL = devices && devices.length > 0 ? MANUAL_URL + devices[0].device_type.name : '';
  const deviceDropdownDisabled = !buildingId || !hasMultipleDevices;

  const data = [
    { label: "Day", value: "1" },
    { label: "Week", value: "7" },
    { label: "Month", value: "30" },
  ];

  const [timeValue, setValue] = useState(data[0].value);
  const [isFocus, setIsFocus] = useState(false);
  console.log(timeValue);

  useEffect(() => {
    if (devices?.length) {
      setDeviceIdentifierName(devices[0].name);
      setDeviceId(devices[0].id);
    }
  }, [devices]);

  useEffect(() => {
    if (CompleteURL) {
      fetch(CompleteURL)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setFetchedData(data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
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
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableOpacity
              disabled={deviceDropdownDisabled}
              style={[styles.dropdownDevice, deviceDropdownDisabled ? { opacity: 0.5 } : null]}
              onPress={() => deviceBottomSheetRef.current?.present()}
            >
              <Text>
                {displayName === null
                  ? fetchedData?.[resolvedLanguage] || t("screens.measurements.graph.no_devices")
                  : displayName || t("screens.measurements.graph.no_devices")}
              </Text>
              <Icon name="chevron-down" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={deviceDropdownDisabled}
              style={[styles.dropdownTime, deviceDropdownDisabled ? { opacity: 0.5 } : null]}
              onPress={() => deviceBottomSheetRef.current?.present()}
            >
              <Text>
                {displayName === null
                  ? fetchedData?.[resolvedLanguage] || t("screens.measurements.graph.no_devices")
                  : displayName || t("screens.measurements.graph.no_devices")}
              </Text>
              <Icon name="chevron-down" size={16} />
            </TouchableOpacity>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              value={timeValue}
              onChange={item => {
                setValue(item.value);
              }}
              renderRightIcon={() => <Icon name="chevron-down" size={16} />}
            />
          </View>

          {/* Data of last 14, 30 & 90 days */}
          {buildingId && deviceIdentifierName ? (
            <>
              <DeviceGraph
                deviceName={deviceIdentifierName}
                dayRange={+timeValue}
                graphName="CO2 Concentration"
                property={{ id: 230, name: "CO2concentration" }}
              />
              <DeviceGraph
                deviceName={deviceIdentifierName}
                dayRange={+timeValue}
                graphName="Humidity"
                property={{ id: 232, name: "relativeHumidity" }}
              />
              <DeviceGraph
                deviceName={deviceIdentifierName}
                dayRange={+timeValue}
                graphName="Temperature"
                property={{ id: 231, name: "roomTemp" }}
              />
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
  dropdownDevice: {
    width: "60%",
    backgroundColor: theme.colors.grey4,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  dropdownTime: {
    width: "25%",
    backgroundColor: theme.colors.grey4,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  dropdown: {
    width: "25%",
    height: 35,
    backgroundColor: theme.colors.grey4,
    marginLeft: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
}));