import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { enUS, nl } from 'date-fns/locale';
import { format } from 'date-fns';
import DelayedButton from "@/components/common/DelayedButton";
import Timeline from "@/components/common/Timeline";
import Box from "@/components/elements/Box";
import useReceivingMeasurements from "@/hooks/device/useReceivingMeasurements";
import useProvisionDevice from "@/hooks/provision/useProvisionDevice";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import useStoredWifiNetworks from "@/hooks/wifi/useStoredWifiNetworks";
import { HomeStackParamList } from "@/types/navigation";

type ProvisionScreenProps = NativeStackScreenProps<HomeStackParamList, "ProvisionScreen">;

export default function ProvisionScreen({ navigation, route }: ProvisionScreenProps) {
  const { theme } = useTheme();
  const { device, network, password, proofOfPossession, device_TypeName } = route.params;
  const { t, resolvedLanguage } = useTranslation();
  const {
    provisionDevice,
    isLoading: isProvisioning,
    isError: isProvisioningError,
    isSuccess: isProvisioningSuccess,
    isWifiError,
  } = useProvisionDevice();

  const {
    latestMeasurement,
    fetchData: fetchMeasuringData,
    isSuccess: isReceivingMeasurements,
    isError: isReceivingMeasurementsError,
    isLoading: isReceivingMeasurementsLoading,
  } = useReceivingMeasurements(device.deviceName, 15);

  const { storeWifiNetwork } = useStoredWifiNetworks();

  const showBackButton = isReceivingMeasurementsError || isProvisioningError || isReceivingMeasurements;

  const timelineData = [
    {
      title: t("screens.home_stack.provision.timeline.steps.connecting.title"),
      description: t("screens.home_stack.provision.timeline.steps.connecting.description", {
        device_name: device_TypeName,
      }),
      finished: true,
    },
    {
      title: t("screens.home_stack.provision.timeline.steps.activating.title"),
      description: t("screens.home_stack.provision.timeline.steps.activating.description", {
        device_name: device_TypeName,
      }),
      finished: true,
    },
    {
      title: t("screens.home_stack.provision.timeline.steps.provisioning.title"),
      description: t("screens.home_stack.provision.timeline.steps.provisioning.description", {
        network_name: network.name,
      }),
      finished: isProvisioningSuccess,
      loading: isProvisioning,
      error: isProvisioningError,
    },
    {
      title: t("screens.home_stack.provision.timeline.steps.receiving.title"),
      description: t("screens.home_stack.provision.timeline.steps.receiving.description", {
        device_name: device_TypeName,
      }),
      finished: isReceivingMeasurements,
      loading: isReceivingMeasurementsLoading,
      error: isReceivingMeasurementsError,
    },
  ];

  const onLeave = () => navigation.navigate("HomeScreen");

  const onRetry = () => {
    navigation.navigate("SearchDeviceScreen", {
      deviceName: device.deviceName,
      proofOfPossession,
      device_TypeName,
    });
  };

  const locales: Record<string, Locale> = {
    'en-US': enUS,
    'nl-NL': nl,
  };


  function formatDateAndTime(date?: Date) {
    const inputDate = date || new Date();
    const locale = locales[resolvedLanguage] || enUS;

    let formatString = 'cccccc, LLL d, yyy HH:mm';

    if (resolvedLanguage === 'nl-NL') {
      formatString = 'cccccc d LLL yyy HH:mm';
    }

    return format(inputDate, formatString, { locale });
  }

  useEffect(() => {
    if (isProvisioningSuccess) {
      storeWifiNetwork({ ...network, password });
      fetchMeasuringData();
    }
  }, [isProvisioningSuccess]);

  useEffect(() => {
    provisionDevice(network.name, password);
  }, []);

  // Disable going back to force the user to use the buttons
  useDisableBackButton(true);

  return (
    <Box padded style={{ flex: 1, justifyContent: "space-between" }}>
      <Box>
        <Timeline items={timelineData} />

        <Box padded>
          {isReceivingMeasurements ? (
            <StatusMessage
              label={t("screens.home_stack.provision.success.title")}
              message={t("screens.home_stack.provision.success.message", {
                date: latestMeasurement ? formatDateAndTime(latestMeasurement) : formatDateAndTime(),
              })}
            />
          ) : isWifiError ? (
            <StatusMessage
              label={t("screens.home_stack.provision.wifi_error.title")}
              message={t("screens.home_stack.provision.wifi_error.message")}
            />
          ) : isProvisioningError ? (
            <StatusMessage
              label={t("screens.home_stack.provision.provisioning_error.title")}
              message={t("screens.home_stack.provision.provisioning_error.message")}
            />
          ) : isReceivingMeasurementsError ? (
            <StatusMessage
              label={t("screens.home_stack.provision.measurements_error.title")}
              message={t("screens.home_stack.provision.measurements_error.message")}
            />
          ) : null}
        </Box>
      </Box>
      <Box style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
        {showBackButton && (
          <>
            {isProvisioningError && (
              <DelayedButton
                containerStyle={{ width: "100%" }}
                timeout={10}
                title={t("common.retry")}
                onPress={onRetry}
              />
            )}
            <Button
              title={t("common.back_to_home")}
              containerStyle={{ width: "100%", marginTop: theme.spacing.md }}
              onPress={onLeave}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

type StatusMessageProps = {
  label: string;
  message: string;
};

function StatusMessage({ label, message }: StatusMessageProps) {
  return (
    <Box>
      <Text bold style={{ marginBottom: 6 }}>
        {label}
      </Text>
      <Text>{message}</Text>
    </Box>
  );
}
