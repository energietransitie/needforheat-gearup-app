import { PropsWithChildren, useEffect } from "react";
import BackgroundFetch from "react-native-background-fetch";
import useTranslation from "../hooks/translation/useTranslation";
import useSuperLateDataSourceNotifier from "@/hooks/notification/useNotificationChecker";
import PushNotification from "react-native-push-notification";

export default function NotificationProvider({ children }: PropsWithChildren<unknown>) {
  const { checkDataSources } = useSuperLateDataSourceNotifier();

  useEffect(() => {
    configureBackgroundFetch();
  }, []);

  const configureBackgroundFetch = async () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        requiresBatteryNotLow: false,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresStorageNotLow: false,
      },

      async taskId => {
        console.log(`[BackgroundFetch] Task received: ${taskId} at ${Date.now().toLocaleString()}`);

        try {
          checkDataSources();
        } catch (error) {
          console.error("Error in background task:", error);
        }

        BackgroundFetch.finish(taskId);
      },
      error => {
        console.error("[BackgroundFetch] Error", error);
      }
    );

    BackgroundFetch.start();
  };

  return <>{children}</>;
}
