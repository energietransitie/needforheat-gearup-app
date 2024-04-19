import { PropsWithChildren, useEffect } from "react";
import BackgroundFetch from "react-native-background-fetch";

import useSuperLateDataSourceNotifier from "@/hooks/notification/useNotificationChecker";

export default function NotificationProvider({ children }: PropsWithChildren<unknown>) {
  const { checkDataSources } = useSuperLateDataSourceNotifier();

  useEffect(() => {
    configureBackgroundFetch();
  }, []);

  const configureBackgroundFetch = async () => {
    // Configure background fetch
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 1, // Minimum interval in minutes (Android-only)
        stopOnTerminate: false, // Continue background task even if app terminated (Android-only)
        startOnBoot: true, // Start background task on device boot (Android-only)
        enableHeadless: true, // Enable headless JS task (Android-only)
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Network connection type (Android-only)
        requiresBatteryNotLow: false, // Battery requirements (Android-only)
        requiresCharging: false, // Charging requirements (Android-only)
        requiresDeviceIdle: false, // Idle device requirements (Android-only)
        requiresStorageNotLow: false, // Storage requirements (Android-only)
      },

      async taskId => {
        console.log(`[BackgroundFetch] Task received: ${taskId} at ${Date.now().toLocaleString()}`);

        try {
          checkDataSources();
          console.log(`[BackgroundFetch] Task finished:${taskId} at ${Date.now().toLocaleString()}`);
        } catch (error) {
          console.error("Error in background task:", error);
        }

        BackgroundFetch.finish(taskId);
      },
      error => {
        console.error("[BackgroundFetch] Error", error);
      }
    );

    // Start background fetch
    BackgroundFetch.start();
  };

  return <>{children}</>;
}
