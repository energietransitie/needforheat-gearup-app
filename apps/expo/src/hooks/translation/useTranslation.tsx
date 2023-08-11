/* eslint-disable @typescript-eslint/ban-ts-comment */
import { decode } from "html-entities";
import { useTranslation as useI18nTranslation } from "react-i18next";

const LANGUAGES = {
  "en-US": "English",
  "nl-NL": "Nederlands",
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

type UseTranslationReturnType<TFunction, ChangeLanguageFn> = {
  t: TFunction;
  languages: typeof LANGUAGES;
  resolvedLanguage: LanguageCode;
  changeLanguage: ChangeLanguageFn;
};

export default function useTranslation() {
  // @ts-ignore
  const { t, i18n } = useI18nTranslation();

  return {
    t: (key: string, options: Record<string, string | number | symbol> = {}) => {
      // @ts-ignore
      return decode(t(key, { defaultValue: key, ...options }));
    },
    languages: LANGUAGES,
    resolvedLanguage: i18n.resolvedLanguage,
    changeLanguage: i18n.changeLanguage,
  } as UseTranslationReturnType<typeof t, typeof i18n.changeLanguage>;
}
