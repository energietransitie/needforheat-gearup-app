/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Text, makeStyles } from "@rneui/themed";
import { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import DeviceGraph from "./_deviceGraph";

import StatusIndicator from "@/components/common/StatusIndicator";
import DeviceBottomSheet from "@/components/common/bottomSheets/DeviceBottomSheet";
import PropertyBottomSheet from "@/components/common/bottomSheets/PropertyBottomSheet";
import Box from "@/components/elements/Box";
import Screen from "@/components/elements/Screen";
import useDevices from "@/hooks/device/useDevices";
import useTranslation from "@/hooks/translation/useTranslation";
import { UserContext } from "@/providers/UserProvider";
import { DataSourceType, Property } from "@/types/api";
import { capitalizeFirstLetter, getManualUrl } from "@/utils/tools";

export default function MeasurementsScreen() {
  const styles = useStyles();
  const { t, resolvedLanguage } = useTranslation();
  const { isLoading } = useContext(UserContext);
  const { user } = useContext(UserContext);

  const deviceBottomSheetRef = useRef<BottomSheetModal>(null);
  const propertyBottomSheetRef = useRef<BottomSheetModal>(null);

  const { data: devices } = useDevices();
  const [deviceIdentifierName, setDeviceIdentifierName] = useState<string | undefined>();
  const [fetchedData, setFetchedData] = useState(null);

  const [displayName, setDisplayName] = useState<string | null>(null);

  const hasMultipleDevices = (devices?.length ?? 0) > 1;

  const foundDataSource = user?.campaign.data_source_list?.items.find(data_source => {
    return devices && data_source.item.Name === devices[0].type;
  });

  const CompleteURL = devices && devices.length > 0 ? getManualUrl(foundDataSource as DataSourceType) : "";
  const deviceDropdownDisabled = !hasMultipleDevices;

  const [property, setProperty] = useState<Property | undefined>();

  useEffect(() => {
    if (devices?.length) {
      setDeviceIdentifierName(devices[0].name);
    }
  }, []);

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
          console.error(`Error fetching data measurementsscreen: ${CompleteURL}:`, error);
        });
    }
  }, [CompleteURL, resolvedLanguage]);

  if (isLoading) {
    return (
      <Screen>
        <Box style={{ flex: 1 }} padded center>
          <StatusIndicator isLoading />
        </Box>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView>
        <Box style={{ flex: 1 }} padded>
          <TouchableOpacity
            disabled={deviceDropdownDisabled}
            style={{
              ...styles.dropdown,
              ...(deviceDropdownDisabled ? { opacity: 0.5 } : null),
              marginBottom: 2,
            }}
            onPress={() => deviceBottomSheetRef.current?.present()}
          >
            <Text>
              {displayName === null
                ? capitalizeFirstLetter(fetchedData?.[resolvedLanguage]) || t("screens.measurements.graph.no_devices")
                : capitalizeFirstLetter(displayName) || t("screens.measurements.graph.no_devices")}
            </Text>
            <Icon name="chevron-down" size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={deviceDropdownDisabled}
            style={[styles.dropdown, deviceDropdownDisabled ? { opacity: 0.5 } : null]}
            onPress={() => propertyBottomSheetRef.current?.present()}
          >
            <Text style={{ fontStyle: "italic" }}>
              {property !== undefined
                ? t(`hooks.property_translation.${property.name}`, { defaultValue: property.name })
                : null}
            </Text>
            <Icon name="chevron-down" size={16} />
          </TouchableOpacity>

          {/* Data of last 14, 30 & 90 days */}
          {deviceIdentifierName ? (
            <>
              <DeviceGraph deviceName={deviceIdentifierName} property={property} />
              <DeviceGraph deviceName={deviceIdentifierName} property={property} dayRange={30} />
              <DeviceGraph deviceName={deviceIdentifierName} property={property} dayRange={90} />
            </>
          ) : null}
          <DeviceBottomSheet
            bottomSheetRef={deviceBottomSheetRef}
            deviceName={deviceIdentifierName}
            onDeviceIdentifier={setDisplayName}
            onDisplayName={setDeviceIdentifierName}
          />

          {deviceIdentifierName ? (
            <>
              <PropertyBottomSheet
                bottomSheetRef={propertyBottomSheetRef}
                deviceName={deviceIdentifierName}
                propertyId={property?.id}
                onPropertySelect={setProperty}
              />
            </>
          ) : null}
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
    backgroundColor: "#ebebeb",
    borderRadius: 8,
  },
}));
