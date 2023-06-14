import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ListItem, Text } from "@rneui/themed";

import useDevices from "@/hooks/device/useDevices";
import useTranslation from "@/hooks/translation/useTranslation";

type DeviceBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  deviceName?: string;
  buildingId: number;
  onDeviceSelect: (name: string) => void;
};

export default function DeviceBottomSheet({
  bottomSheetRef,
  deviceName,
  buildingId,
  onDeviceSelect,
}: DeviceBottomSheetProps) {
  const { data: devices } = useDevices(buildingId);
  const { t } = useTranslation();

  const onPress = (name: string) => {
    onDeviceSelect(name);
    bottomSheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      snapPoints={["25%", "70%"]}
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={props => <BottomSheetBackdrop {...props} pressBehavior="close" disappearsOnIndex={-1} />}
    >
      <BottomSheetScrollView>
        {devices?.map(device => (
          <ListItem key={device.id} onPress={() => onPress(device.name)} Component={TouchableOpacity}>
            <Text bold={deviceName === device.name}>{device.name}</Text>
          </ListItem>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
