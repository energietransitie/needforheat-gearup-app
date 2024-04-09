import useTranslation from "@/hooks/translation/useTranslation";
import { UserContext } from "@/providers/UserProvider";
import MeasurementsScreen from "@/screens/MeasurementsScreen";
import { RootStackParamList } from "@/types/navigation";
import NetInfo from '@react-native-community/netinfo';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@rneui/themed";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeRouter from "./HomeRouter";
import InfoRouter from "./InfoRouter";
import SettingsRouter from "./SettingsRouter";
import { Image } from "react-native";

const Tab = createBottomTabNavigator<RootStackParamList>();

interface AppRouterProps {
  fontsLoaded: boolean;
}

export default function AppRouter({ fontsLoaded }: AppRouterProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isAuthed } = useContext(UserContext);

  useEffect(() => {
    const checkSplash = async () => {
      if (fontsLoaded && isAuthed) {
        await SplashScreen.hideAsync();
      }
    }
    checkSplash().catch(console.error);
  }, [fontsLoaded, isAuthed]);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: theme.colors.primary }}>
      <Tab.Screen
        name="Home"
        component={HomeRouter}
        options={{
          title: t("screens.home_stack.title"),
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
