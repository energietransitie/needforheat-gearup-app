import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import i18n from "i18next";
import { useCallback, useEffect } from "react";
import { initReactI18next } from "react-i18next";
import "@total-typescript/ts-reset";

import AppRouter from "./src/components/routers/AppRouter";
import Providers from "./src/providers";

import { useOnAppStateChange } from "@/hooks/useOnAppStateChange";
import LANG_EN_US from "@/lang/en-US.json";
import LANG_NL_NL from "@/lang/nl-NL.json";
import { LanguageDetector } from "@/lib/languageDetector";

import { useContext } from "react";
import { UserContext } from "@/providers/UserProvider";
import useUser from "@/hooks/user/useUser";

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

  const [fontsLoaded] = useFonts({
    RobotoThin: require("./assets/fonts/Roboto-Thin.ttf"),
    RobotoLight: require("./assets/fonts/Roboto-Light.ttf"),
    RobotoRegular: require("./assets/fonts/Roboto-Regular.ttf"),
    RobotoMedium: require("./assets/fonts/Roboto-Medium.ttf"),
    RobotoBold: require("./assets/fonts/Roboto-Bold.ttf"),
    RobotoBlack: require("./assets/fonts/Roboto-Black.ttf"),
  });

  const {isAuthed} = useContext(UserContext);

  useEffect(() => {
    const checkSplash = async () => {
      if (fontsLoaded && isAuthed) {
        //await SplashScreen.hideAsync();
      }
    }
    checkSplash().catch(console.error);
  }, [fontsLoaded, isAuthed]);

  if (!fontsLoaded) return null;

  return (
    <Providers>
      <StatusBar style="dark" />
      <AppRouter fontsLoaded={fontsLoaded} />
    </Providers>
  );
}
