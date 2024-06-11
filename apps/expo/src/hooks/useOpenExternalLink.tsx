import { Alert, Linking } from "react-native";

import useTranslation from "./translation/useTranslation";

export function useOpenExternalLink() {
  const { t } = useTranslation();

  const openUrl = async (url: string, confirmation = true) => {
    if (!(await Linking.canOpenURL(url))) {
      Alert.alert(t("common.error"), t("hooks.external_links.not_supported") as string);
      return;
    }

    if (!confirmation) {
      await Linking.openURL(url);
      return;
    }

    // Confirmation dialog for external links
    Alert.alert(
      t("hooks.external_links.confirmation.title"),
      t("hooks.external_links.confirmation.description", { url }),
      [
        {
          text: t("common.cancel") as string,
          style: "cancel",
        },
        {
          text: t("hooks.external_links.confirmation.confirm") as string,
          onPress: async () => await Linking.openURL(url),
        },
      ]
    );
  };

  return {
    openUrl,
  };
}
