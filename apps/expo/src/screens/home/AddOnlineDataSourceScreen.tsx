import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";

import ManualContent from "@/components/common/ManualContent";
import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import useDevice from "@/hooks/device/useDevice";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { MANUAL_URL } from "@env";
import { useState } from "react";

import ExternalProviderListItem from "../settings/ExternalProviderScreen/_externalProviderListItem";
import { setAuthState } from "@/constants";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";

type AddOnlineDataSourceScreen = NativeStackScreenProps<HomeStackParamList, "AddOnlineDataSourceScreen">;

export default function AddOnlineDataSourceScreen({ navigation, route }: AddOnlineDataSourceScreen) {
    const { t, resolvedLanguage } = useTranslation();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const { openUrl } = useOpenExternalLink();

    const onCancel = () => {
        navigation.goBack();
    }

    const onConnectEnelogic = async () => {
        //do something
        console.log("connect enelogic");
        setLoading(true);

        const state = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
        const url = "https://enelogic.com/oauth/v2/auth?response_type=code&client_id=10321_iee4evob2rcw4scc4wcwos448ogcwkgocoswwwkkow4wcckk4&redirect_uri=nfh%3A%2F%2Fcallback%3Fprovider%3D1&scope=account&state=";

        await setAuthState(state);

        const redirectUrl = url + state;

        await openUrl(redirectUrl, false).then(() => setLoading(false));
    }


    return (

        <Box padded style={{ flex: 1 }}>
            <ManualContent manualUrl={MANUAL_URL + "enelogic/installation/generic/"} languageHeader={resolvedLanguage} />
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
                    onPress={onConnectEnelogic}
                    icon={{
                        name: "link-outline",
                        type: "ionicon",
                        color: theme.colors.white,
                    }}
                />
            </Box>
        </Box>

    );


}
