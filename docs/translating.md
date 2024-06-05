# Translating
The translations in the NeedForHeat app are done using the [react-i18next](https://react.i18next.com/) framework.

The default language is dependant on the device language. If the device language is not supported the app will fall back to English. The users preferred language can be set in the app settings.

Read about how to modify or add new translations in the next chapters.

## Table of contents
- [Modifying a translation](#modifying-a-translation)
- [Adding a new language](#adding-a-new-language)

## Modifying a translation
Modifying a translation can be done very quickly. Navigate to the [lang](../apps/expo/src/lang/) folder and open your language's corresponding translation file (`en-US.json` for English, `nl-NL.json` for Dutch, etc.).

Find the translation key in the code then go to the corresponding key and change the value.

For example, changing the title of the home stack for the English translation can be done like this:
1. Find the translation key in the code. In this case it's: `screens.home_stack.title`.
2. Open `en-US.json`
3. Navigate to `screens`, then to `home_stack` and finally `title`.
4. Change the value behind `title` to the new translation.
5. The translation will update automatically (if hot reloading is enabled).

Before:

```json
{
  "screens": {
    "home_stack": {
      "title": "Home",
      ...
```

After:

```json
{
  "screens": {
    "home_stack": {
      "title": "Dashboard",
      ...
```

> **Note**
> If a translation in a specific language does not exist it will use the English translation instead. If there is also no English translation available it will show the translation key instead.

## Adding a new language
These steps have to be done **only** when adding a new language. To add a new language you must follow these steps:

1. Copy [en-US.json](../apps/expo/src/lang/en.json)
2. Rename the copy to your language. Eg. `de-DE.json`.
3. Update **all** translations.
4. Go to the [useTranslation](../apps/expo/src/hooks/translation/useTranslation.tsx) hook.
5. Add the key and display name to the `LANGUAGES` const:

```ts
const LANGUAGES = {
  "en-US": "English (US)",
  "nl-NL": "Nederlands",
  "de-DE": "Deutsch",
} as const;
```

6. Go to [App.tsx](../apps/expo/App.tsx).
7. Import the json file at the top of [App.tsx](../apps/expo/App.tsx):

```ts
import LANG_DE from "@/lang/de-DE.json";
```

8. And finally add it to the i18n initializer:

```ts
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "en",
    resources: {
      en: { translation: { ...LANG_EN } },
      nl: { translation: { ...LANG_NL } },
      de: { translation: { ...LANG_DE } },
    },
  //...
```

9. Open the app and ensure that all translations are shown correctly.\
You might have to change your app language in the settings screen.
