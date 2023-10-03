import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import useTranslation from "@/hooks/translation/useTranslation";
import ActivateDeviceScreen from "@/screens/home/ActivateDeviceScreen";
import AddDeviceScreen from "@/screens/home/AddDeviceScreen";
import AlreadyInvitedScreen from "@/screens/home/AlreadyInvitedScreen";
import ConnectScreen from "@/screens/home/ConnectScreen";
import HomeScreen from "@/screens/home/HomeScreen";
import ProvisionScreen from "@/screens/home/ProvisionScreen";
import QrScannerScreen from "@/screens/home/QrScannerScreen";
import SearchDeviceScreen from "@/screens/home/SearchDeviceScreen";
import WifiOverviewScreen from "@/screens/home/WifiOverviewScreen";
import { HomeStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { HeaderBackButton } from '@react-navigation/elements'
import { Platform } from "react-native";

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const disableNavigation: Partial<NativeStackNavigationOptions> = {
  gestureEnabled: false,
  headerBackVisible: false,
};

export default function HomeRouter() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <HomeStack.Navigator initialRouteName="HomeScreen">
      <HomeStack.Screen
        name="HomeScreen"
        options={{ title: t("screens.home_stack.home.title") }}
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="AlreadyInvitedScreen"
        options={{ title: t("screens.home_stack.already_invited.title") }}
        component={AlreadyInvitedScreen}
      />
      <HomeStack.Screen
        name="QrScannerScreen"
        options={{ title: t("screens.home_stack.qr_scanner.title") }}
        component={QrScannerScreen}
      />
      <HomeStack.Screen
        name="AddDeviceScreen"
        options={{ title: t("screens.home_stack.add_device.title"), ...disableNavigation }}
        component={AddDeviceScreen}
      />
      <HomeStack.Screen
        name="SearchDeviceScreen"
        options={{ title: t("screens.home_stack.search_device.title") }}
        component={SearchDeviceScreen}
      />
      <HomeStack.Screen
        name="ActivateDeviceScreen"
        options={{
          title: t("screens.home_stack.activate_device.title"),
          ...disableNavigation,
        }}
        component={ActivateDeviceScreen}
      />
      <HomeStack.Screen
        name="ConnectScreen"
        options={{
          title: t("screens.home_stack.connect.title"),
          ...disableNavigation,
        }}
        component={ConnectScreen}
      />
      <HomeStack.Screen
        name="WifiOverviewScreen"
        options={{
          title: t("screens.home_stack.wifi_overview.title"),
          ...disableNavigation,
          headerLeft: Platform.OS === 'ios' ? (
            () => (
              <HeaderBackButton
                labelVisible={true}
                onPress={() => {
                  navigation.goBack();
                  navigation.goBack();
                  navigation.goBack();
                }}
              />
            )
          ) : undefined,
        }}
        component={WifiOverviewScreen}
      />
      <HomeStack.Screen
        name="ProvisionScreen"
        options={{
          title: t("screens.home_stack.provision.title"),
          ...disableNavigation,
        }}
        component={ProvisionScreen}
      />
    </HomeStack.Navigator>
  );
}
