//import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { registerRootComponent } from "expo";
import PushNotification from "react-native-push-notification";

import App from "./App";
PushNotification.configure({
  onRegister(token) {
    console.log("TOKEN:", token);
  },

  onNotification(notification) {
    console.log("NOTIFICATION:", notification);
    //notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction(notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },

  onRegistrationError(err) {
    console.error(err.message, err);
  },

  // IOS ONLY
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: "777", // (required), every ASCII in NFH starts with 7
    channelName: "NeedForHeat", // (required)
    channelDescription: "Notifications for DataSources",
  },
  created => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
