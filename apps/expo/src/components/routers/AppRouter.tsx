import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@rneui/themed";
import { useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeRouter from "./HomeRouter";
import InfoRouter from "./InfoRouter";
import SettingsRouter from "./SettingsRouter";

import useTranslation from "@/hooks/translation/useTranslation";
import { UserContext } from "@/providers/UserProvider";
import DeviceOverviewScreen from "@/screens/home/DeviceOverviewScreen";
import MeasurementsScreen from "@/screens/MeasurementsScreen";
import { RootStackParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function AppRouter() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isAuthed } = useContext(UserContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: theme.colors.primary }}>
      <Tab.Screen
        name="Home"
        component={HomeRouter}
        options={{
          title: t("screens.home_stack.title"),
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="home-outline" size={size} color={color} />;
          },
        }}
      />
      {isAuthed ? (
        <>
          <Tab.Screen
            name="DeviceOverview"
            component={DeviceOverviewScreen}
            options={{
              title: t("screens.device_overview.title"),
              headerShown: true,
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="list-outline" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Measurements"
            component={MeasurementsScreen}
            options={{
              title: t("screens.measurements.title"),
              headerShown: true,
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="stats-chart-outline" size={size} color={color} />;
              },
            }}
          />
        </>
      ) : null}
      <Tab.Screen
        name="Info"
        component={InfoRouter}
        options={{
          title: t("screens.info_stack.title"),
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="information-outline" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsRouter}
        options={{
          title: t("screens.settings_stack.title"),
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="settings-outline" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
