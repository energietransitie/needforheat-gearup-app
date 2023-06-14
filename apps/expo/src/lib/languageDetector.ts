import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { LanguageDetectorAsyncModule } from "i18next";

export const STORE_LANGUAGE_KEY = "app_language";

export const LanguageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  detect: (callback: (language: string) => void) => {
    try {
      SecureStore.getItemAsync(STORE_LANGUAGE_KEY).then(language => {
        if (language) {
          callback(language);
        } else {
          const [{ languageCode }] = Localization.getLocales();
          callback(languageCode);
        }
      });
    } catch (error) {
      console.log("Error reading language", error);
    }
  },
  init: async () => null,
  async: true,
};
