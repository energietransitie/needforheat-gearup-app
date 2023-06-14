import { NavigationProp, useNavigation } from "@react-navigation/native";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query";
import * as Burnt from "burnt";
import { createContext, PropsWithChildren } from "react";
import { Alert, Platform } from "react-native";
import { URL, URLSearchParams } from "react-native-url-polyfill";

import { setAuthToken } from "@/constants";
import useActivateAccount from "@/hooks/account/useActivateAccount";
import useTranslation from "@/hooks/translation/useTranslation";
import useDynamicLinks from "@/hooks/useDynamicLinks";
import useUser from "@/hooks/user/useUser";
import { Maybe } from "@/types";
import { AccountResponse } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";

type UserContextProps = {
  user: Maybe<AccountResponse>;
  isAuthed: boolean;
  isLoading: boolean;
  refetch: <T>(
    options?: (RefetchOptions & RefetchQueryFilters<T>) | undefined
  ) => Promise<QueryObserverResult<Maybe<AccountResponse>>>;
};

export const UserContext = createContext<UserContextProps>({
  user: null,
  isAuthed: false,
  isLoading: true,
  async refetch<T>(_options?: (RefetchOptions & RefetchQueryFilters<T>) | undefined) {
    return {} as QueryObserverResult<Maybe<AccountResponse>>;
  },
});

export default function UserProvider({ children }: PropsWithChildren<unknown>) {
  const { user, isAuthed, isLoading, refetch } = useUser();
  const { mutateAsync: activateAccount } = useActivateAccount();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  useDynamicLinks(async link => {
    try {
      // Get token out of url (prod_token or test_token query parameter)
      const url = new URL(link.url);
      const urlParams = new URLSearchParams(url.search);
      const accountToken = urlParams.get("prod_token") || urlParams.get("test_token");

      if (!accountToken) {
        throw new Error();
      }

      Burnt.alert({
        title: t("providers.user_provider.activate.title"),
        message: t("providers.user_provider.activate.message"),
        preset: "spinner",
        duration: 10,
      });

      const { authorization_token } = await activateAccount({ accountToken });

      Burnt.dismissAllAlerts();
      Burnt.alert({
        title: t("providers.user_provider.activate_success.title"),
        message: t("providers.user_provider.activate_success.message"),
        preset: "done",
      });

      await setAuthToken(authorization_token);
      await refetch();
      navigation.navigate("HomeScreen");
    } catch (err) {
      Burnt.dismissAllAlerts();

      const alertData = {
        title: t("providers.user_provider.activate_error.title"),
        message: `${t("providers.user_provider.activate_error.message")}${err ? `\n\n${err}` : ""}`,
      };

      if (Platform.OS === "android") {
        Alert.alert(alertData.title, alertData.message);
      } else {
        Burnt.alert({
          title: alertData.title,
          message: alertData.message,
          preset: "error",
          duration: 4,
        });
      }
    }
  });

  return <UserContext.Provider value={{ user, isAuthed, isLoading, refetch }}>{children}</UserContext.Provider>;
}
