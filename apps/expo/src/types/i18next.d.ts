import "i18next";
import LANG_EN_US from "@/lang/en-US.json";
import LANG_NL_NL from "@/lang/nl-NL.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      en: typeof LANG_EN_US;
      nl: typeof LANG_NL_NL;
    };
  }
}
