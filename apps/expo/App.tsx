import NetInfo from "@react-native-community/netinfo";
import { makeStyles } from "@rneui/themed";
import { onlineManager } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import i18n from "i18next";
import { useEffect, useState } from "react";
import { initReactI18next } from "react-i18next";
import { Dimensions, View } from "react-native";
import PushNotification from "react-native-push-notification";
import Ionicons from "react-native-vector-icons/Ionicons";

import AppRouter from "./src/components/routers/AppRouter";
import Providers from "./src/providers";

import { useOnAppStateChange } from "@/hooks/useOnAppStateChange";
import LANG_EN_US from "@/lang/en-US.json";
import LANG_NL_NL from "@/lang/nl-NL.json";
import { LanguageDetector } from "@/lib/languageDetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "en-US",
    resources: {
      "en-US": { translation: { ...LANG_EN_US } },
      "nl-NL": { translation: { ...LANG_NL_NL } },
    },
    react: {
      useSuspense: false,
    },
  });

SplashScreen.preventAutoHideAsync();

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

export default function App() {
  useOnAppStateChange();
  const styles = useStyles();
  const [networkConnected, setNetworkConnected] = useState(false);
  const [fontsLoaded] = useFonts({
    RobotoThin: require("./assets/fonts/Roboto-Thin.ttf"),
    RobotoLight: require("./assets/fonts/Roboto-Light.ttf"),
    RobotoRegular: require("./assets/fonts/Roboto-Regular.ttf"),
    RobotoMedium: require("./assets/fonts/Roboto-Medium.ttf"),
    RobotoBold: require("./assets/fonts/Roboto-Bold.ttf"),
    RobotoBlack: require("./assets/fonts/Roboto-Black.ttf"),
  });

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      setNetworkConnected(Boolean(state.isInternetReachable));
    });
    return () => removeNetInfoSubscription();
  }, []);

  if (!fontsLoaded) return null;

  PushNotification.setApplicationIconBadgeNumber(0);

  return (
    <Providers>
      <StatusBar style="dark" />

      {!networkConnected && (
        <View style={styles.networkAlert}>
          <Ionicons name="wifi" size={24} color="black" />
          <View style={styles.lineThrough} />
        </View>
      )}

      <AppRouter fontsLoaded={fontsLoaded} />
    </Providers>
  );
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const useStyles = makeStyles(theme => ({
  networkAlert: {
    position: "absolute",
    top: windowHeight * 0.04,
    right: windowWidth * 0.05,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  lineThrough: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "red",
    transform: [{ translateY: -1 }, { rotate: "-45deg" }],
  },
}));
