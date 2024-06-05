import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Text, makeStyles } from "@rneui/themed";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type HomeSelectExplanationBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
};

export default function DataSourceExplanationSheet({ bottomSheetRef }: HomeSelectExplanationBottomSheetProps) {
  const { t } = useTranslation();
  const style = useStyles();

  return (
    <View style={style.container}>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["60%", "100%"]}
        enablePanDownToClose
        backdropComponent={props => <BottomSheetBackdrop {...props} pressBehavior="close" disappearsOnIndex={-1} />}
      >
        <BottomSheetView style={style.contentContainer}>
          <Text style={{ fontWeight: "bold" }}>{t("screens.device_overview.explanation_sheet.title")}</Text>
          <Text>{t("screens.device_overview.explanation_sheet.description")}</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
}));
