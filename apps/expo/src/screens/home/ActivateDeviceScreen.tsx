import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import useDevice from "@/hooks/device/useDevice";
import useDeviceActivate from "@/hooks/device/useDeviceActivate";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { HomeStackParamList } from "@/types/navigation";

type ActivateDeviceScreenProps = NativeStackScreenProps<HomeStackParamList, "ActivateDeviceScreen">;

export default function ActivateDeviceScreen({ navigation, route }: ActivateDeviceScreenProps) {
  const { qrData, device_TypeName, dataSourceType, normalName, dataSource } = route.params;
  const { theme } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const focused = useIsFocused();
  const [isActivated, setIsActivated] = useState(false);
  const { mutate: activateDevice, isLoading: isMutating, isError: isMutateError } = useDeviceActivate();

  const errorAlert = (message: string, title = "Error") => {
    Alert.alert(title, message, [
      {
        text: t("common.back_to_home") as string,
        onPress: () => navigation.navigate("HomeScreen"),
        style: "cancel",
      },
    ]);
  };

  const onError = (error: unknown) => {
    console.log(error);
    errorAlert(`${t("screens.home_stack.activate_device.alert.unknown_error")}${error ? `\n\n${error}` : ""}`);
  };

  type Device = {
    activated_at: Date | null;
    device_type: {
      id: number;
      name: string;
    };
    id: number;
    name: string;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onActivated = (data: any) => {
    const device = data as Device;

    if (!dataSource.data_source || device.device_type.name !== dataSource.data_source.item.Name) {
      errorAlert(
        t("screens.home_stack.activate_device.alert.mismatched_device_name"),
        t("screens.home_stack.activate_device.alert.unknown_error") as string
      );
      return;
    }

    setIsActivated(true);

    setTimeout(() => {
      navigation.navigate("AddDeviceScreen", {
        qrData,
        expectedDeviceName: device_TypeName,
        device: dataSourceType,
        normalName,
        dataSource,
      });
    }, 500);
  };

  // Activate the device if it's not activated already
  const onFetchError = (error: Error) => {
    const errorMsg = (error as Error)?.message?.toLowerCase();
    if (errorMsg !== "device not found") {
      errorAlert(t("screens.home_stack.activate_device.alert.already_activated"));
      return;
    }

    activateDevice({ name: qrData.name, activationSecret: qrData.pop }, { onSuccess: onActivated, onError });
  };

  const { isFetching, isError, refetch } = useDevice(qrData.name, onActivated, onFetchError);
  const isLoading = isFetching || isMutating;

  // Disable going back while the device is being activated
  useDisableBackButton(true);

  // Refetch device information when the screen is focused again
  useEffect(() => {
    if (focused && !isLoading) {
      refetch();
    }
  }, [focused]);

  return (
    <Box center padded>
      <Box center>
        {!isActivated ? (
          <StatusIndicator
            isError={isError || isMutateError}
            isLoading={isLoading}
            loadingText={
              isFetching
                ? t("screens.home_stack.activate_device.status_indicator.loading") as string
                : t("screens.home_stack.activate_device.status_indicator.working") as string
            }
            errorText={t("screens.home_stack.activate_device.status_indicator.error") as string}
          />
        ) : (
          <>
            <Ionicons name="checkmark" size={32} color={theme.colors.success} />
            <Text style={styles.activatedText}>{t("screens.home_stack.activate_device.activated")}</Text>
          </>
        )}
      </Box>
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  activatedText: {
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
}));
