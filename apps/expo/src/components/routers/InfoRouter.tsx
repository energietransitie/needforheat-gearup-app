import { createNativeStackNavigator } from "@react-navigation/native-stack";

import useTranslation from "@/hooks/translation/useTranslation";
import AboutScreen from "@/screens/info/AboutScreen";
import FAQScreen from "@/screens/info/FAQScreen";
import InfoScreen from "@/screens/info/InfoScreen";
import PrivacyScreen from "@/screens/info/PrivacyScreen";
import { InfoStackParamList } from "@/types/navigation";

const InfoStack = createNativeStackNavigator<InfoStackParamList>();

export default function InfoStackScreen() {
  const { t } = useTranslation();

  return (
    <InfoStack.Navigator initialRouteName="InfoScreen">
      <InfoStack.Screen
        name="InfoScreen"
        options={{ title: t("screens.info_stack.info.title") as string }}
        component={InfoScreen}
      />
      <InfoStack.Screen
        name="AboutScreen"
        options={{ title: t("screens.info_stack.about.title") as string }}
        component={AboutScreen}
      />
      <InfoStack.Screen name="FAQScreen" options={{ title: t("screens.info_stack.faq.title") as string }} component={FAQScreen} />
      <InfoStack.Screen
        name="PrivacyScreen"
        options={{ title: t("screens.info_stack.privacy.title") as string }}
        component={PrivacyScreen}
      />
    </InfoStack.Navigator>
  );
}
