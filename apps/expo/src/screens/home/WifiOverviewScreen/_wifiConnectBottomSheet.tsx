import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Button, Text, useTheme } from "@rneui/themed";
import { useMemo, useState } from "react";

import WifiPasswordEyeIcon from "./_wifiPasswordEyeIcon";

import { BottomSheetTextInput } from "@/components/common/BottomSheetTextInput";
import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { Maybe, WifiEntry } from "@/types";

type Props = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  network: Maybe<WifiEntry>;
  onProvision: (network: WifiEntry, password?: string) => void;
};

export default function WifiConnectBottomSheet(props: Props) {
  const { bottomSheetRef, network, onProvision } = props;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <BottomSheetModal
      onDismiss={() => setPassword("")}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      animateOnMount={false}
      enablePanDownToClose
      ref={bottomSheetRef}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      backdropComponent={props => <BottomSheetBackdrop {...props} pressBehavior="close" disappearsOnIndex={-1} />}
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <Box padded>
          <Text fontWeight={500}>
            {t("screens.home_stack.wifi_overview.alerts.connect.connect_to_network", { name: network?.name ?? "" })}
          </Text>
          <BottomSheetTextInput
            containerStyle={{ marginVertical: theme.spacing.md }}
            autoFocus
            placeholder={t("common.password")}
            onChangeText={(text: string) => setPassword(text)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="off"
            rightIcon={<WifiPasswordEyeIcon visible={showPassword} setVisible={setShowPassword} />}
          />
          {network && <Button fullWidth title={t("common.connect")} onPress={() => onProvision(network, password)} />}
        </Box>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
