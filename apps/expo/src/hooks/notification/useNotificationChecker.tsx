import * as SecureStore from "expo-secure-store";
import PushNotification from "react-native-push-notification";

import useCloudFeeds from "../cloud-feed/useCloudFeeds";
import useDevices from "../device/useDevices";
import useUser from "../user/useUser";

import { checkMissedUpload, processDataSource } from "@/utils/tools";

export default function useSuperLateDataSourceNotifier() {
  const { user } = useUser();
  const buildingId = user?.buildings[0]?.id;
  const dataSourceList = user?.campaign.data_sources_list;
  const { data } = useDevices(buildingId ? buildingId : -1); //No issue, there should be an internet connection anyway
  const { data: cloudFeedData } = useCloudFeeds();

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
    dataSourceList?.items.forEach(dataSource => {
      if (!buildingId) return;
      const processedDataSource = processDataSource(dataSource, data, cloudFeedData, dataSourceList, buildingId);
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
        return;
      }

      PushNotification.localNotification({
        channelId: "777",
        ticker: "A DataSource is offline for too long",
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
        largeIconUrl: "./assets/Logo-WH-social-groen-800px.png", // (optional) default: undefined
        smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
        bigText:
          "A DataSource has not been uploading in a long whie and its status has turned RED.\nPlease investigate!", // (optional) default: "message" prop
        subText: "DataSource Warning", // (optional) default: none
        bigPictureUrl: "./assets/Logo-WH-social-groen-800px.png", // (optional) default: undefined
        bigLargeIcon: "ic_launcher", // (optional) default: undefined
        bigLargeIconUrl: "./assets/Logo-WH-social-groen-800px.png", // (optional) default: undefined
        color: "#ee3135", // (optional) default: system default
        vibrate: silentNotification, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: "WindesheimTag", // (optional) add tag to message
        group: "WindesheimGroup", // (optional) add group to message
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: "high", // (optional) set notification priority, default: high
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        onlyAlertOnce: true, // (optional) alert will open only once with sound and notify, default: false

        when: Date.now(), // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
        showWhen: true,

        /* iOS only properties */
        category: "WindesheimCategory", // (optional) default: empty string

        /* iOS and Android properties */
        title: "DataSource Warning", // (optional)
        message:
          "A DataSource has not been uploading in a long whie and its status has turned RED.\nPlease investigate!", // (required)
        picture: "https://www.example.tld/picture.jpg", // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
        playSound: silentNotification, // (optional) default: true
        number: badgeCounter, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      });

      await saveNotificationSentToday();
    }
  };

  return { checkDataSources };
}
