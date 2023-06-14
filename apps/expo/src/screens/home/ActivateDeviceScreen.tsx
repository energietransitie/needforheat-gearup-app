import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import useDevice from "@/hooks/device/useDevice";
import useDeviceActivate from "@/hooks/device/useDeviceActivate";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { UserContext } from "@/providers/UserProvider";
import { HomeStackParamList } from "@/types/navigation";

type ActivateDeviceScreenProps = NativeStackScreenProps<HomeStackParamList, "ActivateDeviceScreen">;

export default function ActivateDeviceScreen({ navigation, route }: ActivateDeviceScreenProps) {
  const { qrData } = route.params;
  const { theme } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const focused = useIsFocused();
  const { user } = useContext(UserContext);
  const [isActivated, setIsActivated] = useState(false);

  const errorAlert = (message: string, title = "Error") => {
    Alert.alert(title, message, [
      {
        text: t("common.back_to_home"),
        onPress: () => navigation.navigate("HomeScreen"),
        style: "cancel",
      },
    ]);
  };

  const onError = (error: unknown) =>
    errorAlert(`${t("screens.home_stack.activate_device.alert.unknown_error")}${error ? `\n\n${error}` : ""}`);

  const onActivated = () => {
    setIsActivated(true);

    setTimeout(() => {
      navigation.navigate("AddDeviceScreen", { qrData });
    }, 500);
  };

  const { mutate: activateDevice, isLoading: isMutating, isError: isMutateError } = useDeviceActivate();

  // Activate the device if it's not activated already
  const onFetchError = (error: Error) => {
    const errorMsg = (error as Error)?.message?.toLowerCase();
    const buildingId = user?.buildings?.[0]?.id;

    if (!buildingId) {
      errorAlert(t("screens.home_stack.activate_device.alert.no_building"));
      return;
    }

    if (errorMsg !== "device not found") {
      errorAlert(t("screens.home_stack.activate_device.alert.already_activated"));
      return;
    }

    activateDevice(
      { name: qrData.name, activationSecret: qrData.pop, buildingId },
      { onSuccess: onActivated, onError }
    );
  };

  const { isFetching, isError, refetch } = useDevice(qrData.name, onActivated, onFetchError);
  const isLoading = isFetching || isMutating;

  // Disable going back while the device is being activated
  useDisableBackButton(isLoading);

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
                ? t("screens.home_stack.activate_device.status_indicator.loading")
                : t("screens.home_stack.activate_device.status_indicator.working")
            }
            errorText={t("screens.home_stack.activate_device.status_indicator.error")}
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
