import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";

import ManualContent from "@/components/common/ManualContent";
import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { getManualUrl } from "@/utils/tools";

type InformationScreenProps = NativeStackScreenProps<HomeStackParamList, "InformationScreen">;

export default function InformationScreen({ navigation, route }: InformationScreenProps) {
  const { dataSource } = route.params;
  const { theme } = useTheme();
  const { t, resolvedLanguage } = useTranslation();

  const onExecuteQuery = () => {
    if (dataSource.item.Name === "weather-interpolation-location") {
      navigation.navigate("HomeSelectScreen", { dataSource });
    } else if (dataSource.item.Name === "building-profile") {
      navigation.navigate("HomeAddressSelectScreen", { dataSource });
    }
  };

  const onCancel = () => navigation.navigate("HomeScreen");

  return (
    <Box padded style={{ flex: 1 }}>
      <ManualContent manualUrl={getManualUrl(dataSource) + "/installation"} languageHeader={resolvedLanguage} />
      <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
        <Button
          containerStyle={{ flex: 1 }}
          title={t("common.cancel") as string}
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
          title={t("screens.home_stack.energy_query.information_screen.button") as string}
          color="primary"
          onPress={onExecuteQuery}
          icon={{
            name: "flash-outline",
            type: "ionicon",
            color: theme.colors.white,
          }}
        />
      </Box>
    </Box>
  );
}
