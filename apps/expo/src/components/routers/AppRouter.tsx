import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@rneui/themed";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeRouter from "./HomeRouter";
import InfoRouter from "./InfoRouter";
import SettingsRouter from "./SettingsRouter";

import useTranslation from "@/hooks/translation/useTranslation";
import useUser from "@/hooks/user/useUser";
import MeasurementsScreen from "@/screens/MeasurementsScreen";
import { RootStackParamList } from "@/types/navigation";
const Tab = createBottomTabNavigator<RootStackParamList>();

interface AppRouterProps {
  fontsLoaded: boolean;
}

export default function AppRouter({ fontsLoaded }: AppRouterProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isAuthed } = useUser();

  useEffect(() => {
    const checkSplash = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    checkSplash().catch(console.error);
  }, [fontsLoaded, isAuthed]);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: theme.colors.primary }}>
      <Tab.Screen
        name="Home"
        component={HomeRouter}
        options={{
          title: t("screens.home_stack.title") as string,
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="list-outline" size={size} color={color} />;
          },
        }}
      />
      {isAuthed ? (
        <>
          <Tab.Screen
            name="Measurements"
            component={MeasurementsScreen}
            options={{
              title: t("screens.measurements.title") as string,
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
          title: t("screens.info_stack.title") as string,
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="information-outline" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsRouter}
        options={{
          title: t("screens.settings_stack.title") as string,
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="settings-outline" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
