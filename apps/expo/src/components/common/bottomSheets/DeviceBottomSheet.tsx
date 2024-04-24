import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ListItem, Text } from "@rneui/themed";

import useDevices from "@/hooks/device/useDevices";
import useTranslation from "@/hooks/translation/useTranslation";
import { MANUAL_URL } from "@/constants";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "@/utils/tools";

type DeviceBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  deviceName?: string;
  buildingId: number;
  onDeviceId?: (id: number) => void;
  onDeviceIdentifier: (name: string) => void;
  onDisplayName: (name: string) => void;
};

interface DeviceDataResponse {
  id: number;
  name: string;
}

export default function DeviceBottomSheet({
  bottomSheetRef,
  deviceName,
  buildingId,
  onDeviceIdentifier,
  onDisplayName,
  onDeviceId,
}: DeviceBottomSheetProps) {
  const { data: devices } = useDevices(buildingId);
  const { t, resolvedLanguage } = useTranslation();
  const [deviceDataResponses, setDeviceDataResponses] = useState<Array<DeviceDataResponse>>([]);
  const [checkId, setCheckId] = useState<number | null>(devices?.[0]?.id ?? null);

  const onPress = (id: number) => {
    const selectedDeviceGlobalName = devices?.find(device => device.id === id);
    setCheckId(id);

    if (onDeviceId) {
      onDeviceId(id);
    }

    if (selectedDeviceGlobalName) {
      const selectedDeviceGlobalNameFunc = selectedDeviceGlobalName.name;
      onDisplayName(selectedDeviceGlobalNameFunc);
    }

    const selectedDevice = deviceDataResponses.find(device => device.id === id);
    if (selectedDevice) {
      const selectedDeviceName = selectedDevice.name;
      onDeviceIdentifier(selectedDeviceName);
      bottomSheetRef.current?.dismiss();
    }

    bottomSheetRef.current?.dismiss();
  };

  const fetchDeviceData = async () => {
    if (devices) {
      try {
        const deviceDataPromises = devices.map(async (device) => {
          const manual_type = device.typeCategory === "device_type" ? "devices" : device.typeCategory === "cloud_feed" ? "cloud_feeds" : "energy_queries"
          const CompleteURL = `${MANUAL_URL + manual_type}/${device.device_type.name}`;
          const response = await fetch(CompleteURL);
          if (response.ok) {
            const data = await response.json();
            return { id: device.id, name: data[resolvedLanguage] };
          } else {
            console.error(`Error fetching device data for ${device.name}: ${response.statusText}`);
            return null;
          }
        });

        const deviceDataResults = await Promise.all(deviceDataPromises);

        const filteredResults: Array<DeviceDataResponse> = deviceDataResults.filter(
          (result): result is DeviceDataResponse => result !== null
        );

        setDeviceDataResponses(filteredResults);

      } catch (error) {
        console.error("Error fetching device data", error);
      }
    }
  };

  useEffect(() => {
    if (devices) {
      fetchDeviceData();
    }
  }, [devices, resolvedLanguage]);

  return (
    <BottomSheetModal
      snapPoints={["25%", "70%"]}
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={props => <BottomSheetBackdrop {...props} pressBehavior="close" disappearsOnIndex={-1} />}
    >
      <BottomSheetScrollView>
        {deviceDataResponses?.map(device => (
          <ListItem key={device.id} onPress={() => onPress(device.id)} Component={TouchableOpacity}>
            <Text bold={checkId === device.id}>{capitalizeFirstLetter(device.name)}</Text>
          </ListItem>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
