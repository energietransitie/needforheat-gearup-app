import { makeStyles } from "@rneui/themed";
import * as Burnt from "burnt";
import { Alert, FlatList, Platform } from "react-native";
import { URL, URLSearchParams } from "react-native-url-polyfill";
import { z } from "zod";

import ExternalProviderListItem from "./_externalProviderListItem";

import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import { getAuthState } from "@/constants";
import useActivateCloudFeed from "@/hooks/cloud-feed/useActivateCloudFeed";
import useCloudFeeds from "@/hooks/cloud-feed/useCloudFeeds";
import useTranslation from "@/hooks/translation/useTranslation";
import useDeepLinks from "@/hooks/useDeepLinks";

export type ExternalProviderItem = { name: string; icon: string; description: string; is_connected: boolean };

export default function ExternalProviderScreen() {
  const styles = useStyles();
  const { data, isFetching } = useCloudFeeds();
  const { mutate: activate } = useActivateCloudFeed();
  const { t } = useTranslation();

  useDeepLinks(async link => {
    try {
      const url = new URL(link);
      const urlParams = new URLSearchParams(url.search);
      const [cloudFeedId, state, authCode] = z
        .tuple([z.coerce.number(), z.string(), z.string()])
        .parse([urlParams.get("provider"), urlParams.get("state"), urlParams.get("code")]);

      if (!state || !authCode || !cloudFeedId) {
        throw new Error("Invalid authorization code");
      }

      if (state !== (await getAuthState())) {
        throw new Error("Invalid state");
      }

      await activate({ cloudFeedId, authCode });

      const providerName = data?.find(item => item.cloud_feed_type.id === cloudFeedId)?.cloud_feed_type?.name;

      Burnt.dismissAllAlerts();
      Burnt.alert({
        title: t("screens.settings_stack.external_provider_screen.state.connected"),
        message: providerName
          ? t("screens.settings_stack.external_provider_screen.description.connected", {
              name: providerName,
            })
          : undefined,
        preset: "done",
      });
    } catch (error) {
      const errorMsg = `${t("common.unknown_error")}${
        (error as Error)?.message ? `\n\n${(error as Error).message}` : ""
      }`;

      Burnt.dismissAllAlerts();

      const alertData = {
        title: t("common.error"),
        message: errorMsg,
      };

      if (Platform.OS === "android") {
        Alert.alert(alertData.title, alertData.message);
      } else {
        Burnt.alert({
          title: alertData.title,
          message: alertData.message,
          preset: "error",
          duration: 4,
        });
      }
    }
  });

  if (isFetching) {
    return (
      <Box padded center>
        <StatusIndicator isLoading />
      </Box>
    );
  }

  return (
    <Box padded style={styles.container}>
      <FlatList data={data} renderItem={({ item }) => <ExternalProviderListItem item={item} />} />
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  centerContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
}));
