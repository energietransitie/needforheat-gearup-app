import { API_URL } from "@env";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { makeStyles, Text } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "burnt";
import { nativeBuildVersion } from "expo-application";
import Constants from "expo-constants";
import { useContext, useRef } from "react";
import { Alert, FlatList } from "react-native";

import LanguageBottomSheet from "./_languageBottomSheet";
import SettingListItem, { SettingItem } from "./_settingListItem";

import Box from "@/components/elements/Box";
import { deleteWifiNetworks, removeAuthToken } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { UserContext } from "@/providers/UserProvider";
import { HomeStackParamList, SettingsStackParamList } from "@/types/navigation";

export default function SettingsScreen() {
  const styles = useStyles();
  const { t, languages, resolvedLanguage } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { isAuthed, refetch } = useContext(UserContext);
  const settingsNavigation = useNavigation<NavigationProp<SettingsStackParamList>>();
  const homeNavigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const queryClient = useQueryClient();

  const onDeleteWifiPasswords = () => {
    Alert.alert(
      t("screens.settings_stack.settings_screen.wifi_passwords.title"),
      t("screens.settings_stack.settings_screen.wifi_passwords.message"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteWifiNetworks();
            toast({
              title: t("screens.settings_stack.settings_screen.wifi_passwords.toast"),
              from: "bottom",
            });
          },
        },
      ]
    );
  };

  const onResetSessionToken = () => {
    Alert.alert(
      t("screens.settings_stack.settings_screen.session_token.title"),
      t("screens.settings_stack.settings_screen.session_token.message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.reset"),
          style: "destructive",
          onPress: async () => {
            await removeAuthToken();
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            await refetch({ throwOnError: true });

            toast({
              title: t("screens.settings_stack.settings_screen.session_token.toast"),
              from: "bottom",
            });

            homeNavigation.navigate("HomeScreen");
          },
        },
      ]
    );
  };

  const data: SettingItem[] = [
    {
      title: t("screens.settings_stack.settings_screen.app_language"),
      value: languages[resolvedLanguage],
      onPress: () => {
        bottomSheetRef.current?.present();
      },
    },
    {
      title: t("screens.settings_stack.settings_screen.wifi_passwords.title"),
      value: "",
      onPress: onDeleteWifiPasswords,
    },
    {
      title: t("screens.settings_stack.settings_screen.session_token.title"),
      value: "",
      onPress: onResetSessionToken,
      isDangerous: true,
    },
  ];

  return (
    <Box padded style={styles.container}>
      <FlatList data={data} renderItem={({ item }) => <SettingListItem item={item} />} />

      <Box fullWidth style={styles.centerContainer}>
        <Text>
          {t("screens.settings_stack.settings_screen.app_info", {
            version: Constants.manifest?.version ?? "N/A",
            build: nativeBuildVersion,
          })}
        </Text>
        <Text style={{ fontSize: 14 }}>API: {API_URL}</Text>
      </Box>
      <LanguageBottomSheet bottomSheetRef={bottomSheetRef} />
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  centerContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
}));
