import * as SecureStore from "expo-secure-store";
import PushNotification from "react-native-push-notification";

import useTranslation from "../translation/useTranslation";

import { fetchCloudFeeds } from "@/api/account";
import { fetchDevices } from "@/api/device";
import { fetchUser } from "@/api/user";
import { checkMissedUpload, processDataSource } from "@/utils/tools";

//TODO test on iOS
export default function useSuperLateDataSourceNotifier() {
  const { t } = useTranslation();

  const NOTIFICATION_HOUR_START = 22; // Start of silent hours (10 PM)
  const NOTIFICATION_HOUR_END = 7; // End of silent hours (7 AM)

  const notificationSentTodayKey = "notificationSentToday";

  const shouldSendNotification = async () => {
    const lastNotificationSent = await SecureStore.getItemAsync(notificationSentTodayKey);
    const notificationSentToday =
      lastNotificationSent && new Date(lastNotificationSent).getDate() === new Date().getDate();
    return !notificationSentToday;
  };

  const saveNotificationSentToday = async () => {
    await SecureStore.setItemAsync(notificationSentTodayKey, new Date().toString());
  };

  const checkDataSources = async () => {
    console.log("Running background task to fetch devices, check status, and send notification...");
    let sendNotification = false;
    let badgeCounter = 0;

    const user = await fetchUser();
    const buildingID = user?.buildings[0].id ? user?.buildings[0].id : -1;
    const data = await fetchDevices(buildingID);
    const cloudFeedData = await fetchCloudFeeds();
    const dataSourceList = user?.campaign.data_sources_list;

    dataSourceList?.items.forEach(dataSource => {
      if (!buildingID) return;
      const processedDataSource = processDataSource(dataSource, data, cloudFeedData, dataSourceList, buildingID);
      if (checkMissedUpload(processedDataSource) === -2) {
        sendNotification = true;
        badgeCounter += 1;
      }
    });

    if (sendNotification) {
      const currentHour = new Date().getHours();
      let silentNotification = false;

      // Check if current hour is within silent hours (from 10 PM to 7 AM)
      if (currentHour >= NOTIFICATION_HOUR_START || currentHour < NOTIFICATION_HOUR_END) {
        console.log("Silent hours, turning off sound...");
        silentNotification = true;
      }

      const shouldSend = await shouldSendNotification();
      if (!shouldSend) {
        console.log("Notification already sent today.");
        PushNotification.setApplicationIconBadgeNumber(badgeCounter);
        return;
      }

      PushNotification.localNotification({
        channelId: "777",
        ticker: t("notifications.ticker"),
        largeIcon: "ic_launcher",
        largeIconUrl: "./assets/Logo-WH-social-groen-800px.png",
        smallIcon: "ic_notification",
        bigText: t("notifications.bigText"),
        subText: t("notifications.subText"),
        bigPictureUrl: "./assets/Logo-WH-social-groen-800px.png",
        bigLargeIcon: "ic_launcher",
        bigLargeIconUrl: "./assets/Logo-WH-social-groen-800px.png",
        color: "#ee3135",
        vibrate: silentNotification,
        vibration: 300,
        tag: "WindesheimTag",
        group: "WindesheimGroup",
        ongoing: false,
        ignoreInForeground: false,
        onlyAlertOnce: true,

        when: Date.now(),
        showWhen: true,

        /* iOS only properties */
        category: "Windesheim",

        /* iOS and Android properties */
        title: t("notifications.title"),
        message: t("notifications.message"),
        picture: "./assets/Logo-WH-social-groen-800px.png",
        playSound: silentNotification,
        number: badgeCounter,
      });

      await saveNotificationSentToday();
    }
  };

  return { checkDataSources };
}
