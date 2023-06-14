import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ListItem, Text } from "@rneui/themed";
import { useContext } from "react";

import useTranslation from "@/hooks/translation/useTranslation";
import { UserContext } from "@/providers/UserProvider";

type BuildingBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  buildingId: number;
  onBuildingSelect: (id: number) => void;
};

export default function BuildingBottomSheet({
  bottomSheetRef,
  buildingId,
  onBuildingSelect,
}: BuildingBottomSheetProps) {
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  const onPress = (id: number) => {
    onBuildingSelect(id);
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
        {user?.buildings?.map(building => (
          <ListItem key={building.id} onPress={() => onPress(building.id)} Component={TouchableOpacity}>
            <Text bold={buildingId === building.id}>
              {t("screens.device_overview.building_list.building_info.name", { id: building.id })}
            </Text>
          </ListItem>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
