import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";

import ManualContent from "@/components/common/ManualContent";
import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import useDevice from "@/hooks/device/useDevice";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";

type AddDeviceScreenProps = NativeStackScreenProps<HomeStackParamList, "AddDeviceScreen">;

export default function AddDeviceScreen({ navigation, route }: AddDeviceScreenProps) {
  const { qrData } = route.params;
  const { theme } = useTheme();

  const { data: device, isFetching, isError } = useDevice(qrData.name);
  const { t } = useTranslation();

  const onAddDevice = () => {
    navigation.navigate("SearchDeviceScreen", {
      deviceName: qrData.name,
      proofOfPossession: qrData.pop,
    });
  };

  const onCancel = () => navigation.navigate("HomeScreen");

  if (isFetching || isError) {
    return (
      <Box center padded>
        <StatusIndicator
          isError={isError}
          isLoading={isFetching}
          loadingText={t("screens.home_stack.add_device.status_indicator.working")}
          errorText={t("screens.home_stack.add_device.status_indicator.error")}
        />
      </Box>
    );
  }

  return (
    <Box padded style={{ flex: 1 }}>
      <ManualContent manualUrl={device?.device_type?.installation_manual_url} />
      <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
        <Button containerStyle={{ flex: 1 }} title={t("common.cancel")} color="grey2" onPress={onCancel} />
        <Button
          containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
          title={t("common.add")}
          color="primary"
          onPress={onAddDevice}
        />
      </Box>
    </Box>
  );
}
