import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";

import ManualContent from "@/components/common/ManualContent";
import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";

type InformationScreenProps = NativeStackScreenProps<HomeStackParamList, "InformationScreen">;

export default function InformationScreen({ navigation, route }: InformationScreenProps) {
  const { device } = route.params;
  const { theme } = useTheme();
  const { t, resolvedLanguage } = useTranslation();

  const onAddDevice = () => {
    navigation.navigate("HomeSelectScreen");
  };

  const onCancel = () => navigation.navigate("HomeScreen");

  return (
    <Box padded style={{ flex: 1 }}>
      <ManualContent manualUrl={device.installation_manual_url} languageHeader={resolvedLanguage} />
      <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
        <Button
          containerStyle={{ flex: 1 }}
          title={t("common.cancel")}
          color="grey2"
          onPress={onCancel}
          icon={{
            name: "close-outline",
            type: "ionicon",
            color: theme.colors.white,
          }}
        />
        <Button
          containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
          title={t("common.connect")}
          color="primary"
          onPress={onAddDevice}
          icon={{
            name: "wifi-outline",
            type: "ionicon",
            color: theme.colors.white,
          }}
        />
      </Box>
    </Box>
  );
}
