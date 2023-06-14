import "i18next";
import LANG_EN from "@/lang/en.json";
import LANG_NL from "@/lang/nl.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      en: typeof LANG_EN;
      nl: typeof LANG_NL;
    };
  }
}
