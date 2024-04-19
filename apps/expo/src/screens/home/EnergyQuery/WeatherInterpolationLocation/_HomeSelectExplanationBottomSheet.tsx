import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheet, Text, makeStyles, useTheme } from "@rneui/themed";
import { useTranslation } from "react-i18next";

import { View } from "react-native";

type HomeSelectExplanationBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
};

export default function HomeSelectExplanationBottomSheet({ bottomSheetRef }: HomeSelectExplanationBottomSheetProps) {
  const { theme } = useTheme();
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
          <Text style={style.title}>Lorum Ipsum</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque finibus, libero ac ullamcorper ornare, lectus nisi fermentum libero, vel efficitur. </Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  }
}));
