import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme, makeStyles } from "@rneui/themed";

import ManualContent from "@/components/common/ManualContent";
import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import useDevice from "@/hooks/device/useDevice";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { useState } from "react";
import ExternalProviderListItem from "../settings/ExternalProviderScreen/_externalProviderListItem";
import { setAuthState, MANUAL_URL, getAuthState } from "@/constants";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import * as Burnt from "burnt";
import { Alert, FlatList, Platform } from "react-native";
import { URL, URLSearchParams } from "react-native-url-polyfill";
import { z } from "zod";
import useActivateCloudFeed from "@/hooks/cloud-feed/useActivateCloudFeed";
import useCloudFeeds from "@/hooks/cloud-feed/useCloudFeeds";
import useDeepLinks from "@/hooks/useDeepLinks";

export type ExternalProviderItem = { name: string; icon: string; description: string; is_connected: boolean };

type AddOnlineDataSourceScreen = NativeStackScreenProps<HomeStackParamList, "AddOnlineDataSourceScreen">;

export default function AddOnlineDataSourceScreen({ navigation, route }: AddOnlineDataSourceScreen) {
    const { t, resolvedLanguage } = useTranslation();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const { openUrl } = useOpenExternalLink();
    const { data, isFetching } = useCloudFeeds();
    const { mutate: activate } = useActivateCloudFeed();

    const onCancel = () => {
        navigation.goBack();
    }

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

            const providerName = data?.find(item => item.cloud_feed.id === cloudFeedId)?.cloud_feed?.name;

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
            const errorMsg = `${t("common.unknown_error")}${(error as Error)?.message ? `\n\n${(error as Error).message}` : ""
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


    return (
        <Box padded style={{ flex: 1 }}>
            <ManualContent manualUrl={MANUAL_URL + "enelogic/installation/generic/"} languageHeader={resolvedLanguage} />
            <Box style={{ flexDirection: "column", marginTop: 16, width: "100%", justifyContent: 'center' }}>
                {data?.some((item) => !item.connected) && (
                    <Button
                        title={t("common.cancel")}
                        color="grey2"
                        onPress={onCancel}
                        icon={{
                            name: "close-outline",
                            type: "ionicon",
                            color: theme.colors.white,
                        }}
                        buttonStyle={{ width: "100%" }}
                        containerStyle={{ width: "100%" }}
                    />
                )}
                {isFetching ? (
                    <Box padded center>
                        <StatusIndicator isLoading />
                    </Box>
                ) : (
                    data?.map((item) => (
                        <ExternalProviderListItem key={item.cloud_feed.id} item={item} />
                    ))
                )}
            </Box>
        </Box>
    );
}
