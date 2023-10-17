import { Button, ListItem, makeStyles, useTheme } from "@rneui/themed";
import { useState } from "react";

import { setAuthState } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import { CloudFeed } from "@/types/api";

type ExternalProviderListItemProps = {
  item: CloudFeed;
};

export default function ExternalProviderListItem(props: ExternalProviderListItemProps) {
  const { item } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { openUrl } = useOpenExternalLink();
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    setLoading(true);
    const state = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();

    await setAuthState(state);

    const redirectUrl = `${item.cloud_feed.authorization_url}?response_type=code&client_id=${
      item.cloud_feed.client_id
    }&redirect_uri=${encodeURIComponent(item.cloud_feed.redirect_url)}&scope=${encodeURIComponent(
      item.cloud_feed.scope
    )}&state=${state}`;

    console.log("redirectUrl", redirectUrl);

    await openUrl(redirectUrl, false).then(() => setLoading(false));
  };

  return (
    <ListItem style={styles.item}>
      <ListItem.Content>
        <ListItem.Title>{item.cloud_feed.name}</ListItem.Title>
        <ListItem.Subtitle>
          {t(
            `screens.settings_stack.external_provider_screen.description.${
              item.connected ? "connected" : "not_connected"
            }`,
            { name: item.cloud_feed.name }
          )}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Button
        disabled={item.connected || loading}
        title={t(
          `screens.settings_stack.external_provider_screen.state.${item.connected ? "connected" : "not_connected"}`
        )}
        onPress={onPress}
        buttonStyle={{ backgroundColor: theme.colors.primary }}
      />
    </ListItem>
  );
}

const useStyles = makeStyles(theme => ({
  item: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.black,
  },
}));
