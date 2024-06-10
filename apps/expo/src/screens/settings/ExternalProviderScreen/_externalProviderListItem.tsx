import { Button, useTheme } from "@rneui/themed";
import { useState } from "react";

import Box from "@/components/elements/Box";
import { setAuthState } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import { CloudFeedType } from "@/types/api";

type ExternalProviderListItemProps = {
  item: CloudFeedType;
};

export default function ExternalProviderListItem(props: ExternalProviderListItemProps) {
  const { item } = props;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { openUrl } = useOpenExternalLink();
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    setLoading(true);
    const state = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();

    await setAuthState(state);

    const redirectUrl = `${item.cloud_feed_type.authorization_url}?response_type=code&client_id=${
      item.cloud_feed_type.client_id
    }&redirect_uri=${encodeURIComponent(item.cloud_feed_type.redirect_url)}&scope=${encodeURIComponent(
      item.cloud_feed_type.scope
    )}&state=${state}`;

    await openUrl(redirectUrl, false).then(() => setLoading(false));
  };

  return (
    <Box style={{ marginTop: 10, width: "100%", justifyContent: "center" }}>
      <Button
        disabled={item.connected || loading}
        title={t(
          `screens.settings_stack.external_provider_screen.state.${item.connected ? "connected" : "not_connected"}`
        ) as string}
        onPress={onPress}
        buttonStyle={{ backgroundColor: theme.colors.primary, width: "100%" }}
        containerStyle={{ width: "100%" }}
      />
    </Box>
  );
}
