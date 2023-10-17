import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";

import ManualContent from "@/components/common/ManualContent";
import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import useDevice from "@/hooks/device/useDevice";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";

type AddOnlineDataSourceScreen = NativeStackScreenProps<HomeStackParamList, "AddOnlineDataSourceScreen">;

export default function AddOnlineDataSourceScreen({ navigation, route }: AddOnlineDataSourceScreen) {

    const { t, resolvedLanguage } = useTranslation();

    return (

        <Box padded style={{ flex: 1 }}>
            <ManualContent manualUrl={"https://manuals.tst.energietransitiewindesheim.nl/devices/enelogic/installation/generic/"} languageHeader={resolvedLanguage} />
        </Box>

    );


}
