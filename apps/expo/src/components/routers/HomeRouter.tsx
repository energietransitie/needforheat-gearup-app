import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Platform } from "react-native";

import useTranslation from "@/hooks/translation/useTranslation";
import ActivateDeviceScreen from "@/screens/home/ActivateDeviceScreen";
import AddDeviceScreen from "@/screens/home/AddDeviceScreen";
import AddOnlineDataSourceScreen from "@/screens/home/AddOnlineDataSourceScreen";
import AlreadyInvitedScreen from "@/screens/home/AlreadyInvitedScreen";
import ConnectScreen from "@/screens/home/ConnectScreen";
import BuildingProfileProgressScreen from "@/screens/home/EnergyQuery/BuildingProfile/BuildingProfileProgressScreen";
import HomeAddressSelectScreen from "@/screens/home/EnergyQuery/BuildingProfile/HomeAddressSelectScreen";
import InformationScreen from "@/screens/home/EnergyQuery/InformationScreen";
import HomeSelectScreen from "@/screens/home/EnergyQuery/WeatherInterpolationLocation/HomeSelectScreen";
import WeatherLocationPostedScreen from "@/screens/home/EnergyQuery/WeatherInterpolationLocation/WeatherLocationPostedScreen";
import WeatherLocationResultScreen from "@/screens/home/EnergyQuery/WeatherInterpolationLocation/WeatherLocationResultScreen";
import HomeScreen from "@/screens/home/HomeScreen";
import ProvisionScreen from "@/screens/home/ProvisionScreen";
import QrScannerScreen from "@/screens/home/QrScannerScreen";
import SearchDeviceScreen from "@/screens/home/SearchDeviceScreen";
import WifiOverviewScreen from "@/screens/home/WifiOverviewScreen";
import { HomeStackParamList } from "@/types/navigation";

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
        options={{ title: t("screens.device_overview.title") as string }}
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="AlreadyInvitedScreen"
        options={{ title: t("screens.home_stack.already_invited.title") as string }}
        component={AlreadyInvitedScreen}
      />
      <HomeStack.Screen
        name="QrScannerScreen"
        options={{ title: t("screens.home_stack.qr_scanner.title") as string }}
        component={QrScannerScreen}
      />
      <HomeStack.Screen
        name="AddDeviceScreen"
        options={{ title: t("screens.home_stack.add_device.title") as string, ...disableNavigation }}
        component={AddDeviceScreen}
      />
      <HomeStack.Screen
        name="SearchDeviceScreen"
        options={{ title: t("screens.home_stack.search_device.title") as string }}
        component={SearchDeviceScreen}
      />
      <HomeStack.Screen
        name="ActivateDeviceScreen"
        options={{
          title: t("screens.home_stack.activate_device.title") as string,
          ...disableNavigation,
        }}
        component={ActivateDeviceScreen}
      />
      <HomeStack.Screen
        name="ConnectScreen"
        options={{
          title: t("screens.home_stack.connect.title") as string,
        }}
        component={ConnectScreen}
      />
      <HomeStack.Screen
        name="WifiOverviewScreen"
        options={{
          title: t("screens.home_stack.wifi_overview.title") as string,
          ...disableNavigation,
          headerLeft:
            Platform.OS === "ios"
              ? () => (
                  <HeaderBackButton
                    labelVisible
                    onPress={() => {
                      navigation.goBack();
                      navigation.goBack();
                      navigation.goBack();
                    }}
                  />
                )
              : undefined,
        }}
        component={WifiOverviewScreen}
      />
      <HomeStack.Screen
        name="ProvisionScreen"
        options={{
          title: t("screens.home_stack.provision.title") as string,
          ...disableNavigation,
        }}
        component={ProvisionScreen}
      />
      <HomeStack.Screen
        name="AddOnlineDataSourceScreen"
        options={{
          title: t("screens.home_stack.provision.enelogic") as string,
        }}
        component={AddOnlineDataSourceScreen}
      />

      {/* EnergyQuery */}
      <HomeStack.Screen
        name="InformationScreen"
        options={{ title: t("screens.home_stack.energy_query.information_screen.title") as string, ...disableNavigation }}
        component={InformationScreen}
      />
      <HomeStack.Screen
        name="HomeSelectScreen"
        options={{ title: t("screens.home_stack.energy_query.homeselect_screen.title") as string, ...disableNavigation }}
        component={HomeSelectScreen}
      />
      <HomeStack.Screen
        name="HomeAddressSelectScreen"
        options={{ title: t("screens.home_stack.energy_query.homeaddress_screen.title") as string, ...disableNavigation }}
        component={HomeAddressSelectScreen}
      />
      <HomeStack.Screen
        name="WeatherLocationResultScreen"
        options={{
          title: t("screens.home_stack.energy_query.weather_location_result_screen.title") as string,
          ...disableNavigation,
        }}
        component={WeatherLocationResultScreen}
      />
      <HomeStack.Screen
        name="WeatherLocationPostedScreen"
        options={{
          title: t("screens.home_stack.energy_query.weather_location_posted_screen.title") as string,
          ...disableNavigation,
        }}
        component={WeatherLocationPostedScreen}
      />
      <HomeStack.Screen
        name="BuildingProfileProgressScreen"
        options={{
          title: t("screens.home_stack.energy_query.building_profile_progress.title") as string,
          ...disableNavigation,
        }}
        component={BuildingProfileProgressScreen}
      />
    </HomeStack.Navigator>
  );
}
