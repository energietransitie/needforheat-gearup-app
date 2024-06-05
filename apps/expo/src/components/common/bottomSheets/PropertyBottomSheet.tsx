import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ListItem, Text } from "@rneui/themed";
import { useEffect } from "react";

import { HIDDEN_PROPERTY_NAMES } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import useProperties from "@/hooks/upload/useProperties";
import { Property } from "@/types/api";

type PropertyBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  deviceName: string;
  onPropertySelect: (property: Property | undefined) => void;
  propertyId?: number;
};

export default function PropertyBottomSheet({
  bottomSheetRef,
  deviceName,
  onPropertySelect,
  propertyId,
}: PropertyBottomSheetProps) {
  const { data: properties } = useProperties(deviceName, "device");
  const { t } = useTranslation();

  const onPress = (property: Property) => {
    onPropertySelect(property);
    bottomSheetRef.current?.dismiss();
  };

  useEffect(() => {
    if (properties?.length) {
      onPropertySelect(properties?.filter(property => !HIDDEN_PROPERTY_NAMES.includes(property.name))[0]);
      return;
    }

    onPropertySelect(undefined);
  }, [deviceName, properties]);

  return (
    <BottomSheetModal
      snapPoints={["25%", "70%"]}
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={props => <BottomSheetBackdrop {...props} pressBehavior="close" disappearsOnIndex={-1} />}
    >
      <BottomSheetScrollView>
        <Text style={{ padding: 15, fontWeight: "bold", fontStyle: "italic" }}>
          {t("screens.measurements.property_sheet.title")}
        </Text>
        {properties
          ?.filter(property => !HIDDEN_PROPERTY_NAMES.includes(property.name))
          ?.map(property => (
            <ListItem key={property.id} onPress={() => onPress(property)} Component={TouchableOpacity}>
              <Text bold={propertyId === property.id}>
                {t(`hooks.property_translation.${property.name}`, { defaultValue: property.name })}
              </Text>
            </ListItem>
          ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
