import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, ListItem, makeStyles, useTheme } from "@rneui/themed";
import * as Burnt from "burnt";
import cronParser from "cron-parser";
import { format } from "date-fns";
import { enUS, nl } from "date-fns/locale";
import { DateTime, Duration } from "luxon";
import { useEffect, useState } from "react";
import { Platform, ToastAndroid, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import TimeProgressBar from "./timeProgressBar";

import { MANUAL_URL } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import { AllDataSourcesResponse } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";
import { capitalizeFirstLetter } from "@/utils/tools";
import "intl";
import "intl/locale-data/jsonp/en";

type WifiNetworkListItemProps = {
  item: AllDataSourcesResponse;
  onSwipeBegin?: () => void;
  onSwipeEnd?: () => void;
  allItemsDone: boolean;
  refreshAfter20Seconds: () => void;
};

export default function DeviceListItem(props: WifiNetworkListItemProps) {
  const { item, onSwipeBegin, onSwipeEnd, allItemsDone, refreshAfter20Seconds } = props;
  const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
  const { openUrl } = useOpenExternalLink();
  const { theme } = useTheme();
  const style = useStyles();
  const { t, resolvedLanguage } = useTranslation();
  const [data, setData] = useState(null); // Initialize data state variable
  const CompleteURL = MANUAL_URL + item.data_source.item.name;

  const [missed, setMissed] = useState(0);
  const [timeToUpload, setTimeToUpload] = useState<string>();

  const locales: Record<string, Locale> = {
    "en-US": enUS,
    "nl-NL": nl,
  };

  const getNormalName = (): string => {
    let name = "";

    if (data?.["nl-NL"] && resolvedLanguage === "nl-NL") {
      name = capitalizeFirstLetter(data["nl-NL"]) || name;
    }

    if (!name && data?.["en-US"] && resolvedLanguage === "en-US") {
      name = capitalizeFirstLetter(data["en-US"]) || name;
    }

    if (!name && item.data_source.item?.name) {
      name = capitalizeFirstLetter(item.data_source.item.name) || name;
    }

    return name;
  };

  const onReset = (close: () => void) => {
    if (item.data_source.item.name === "device_type") {
      navigate("QrScannerScreen", {
        expectedDeviceName: item.name,
        device_TypeName: item.name,
        dataSource: item,
        normalName: getNormalName(),
      });
    }
    close();
  };

  const handleItemClick = () => {
    if (Platform.OS === "android") {
      ToastAndroid.show(t("screens.device_overview.toast_message"), ToastAndroid.SHORT);
    } else {
      Burnt.toast({
        title: t("screens.device_overview.toast_title"),
        message: t("screens.device_overview.toast_message"),
        preset: "error",
      });
    }
  };

  const openManual = () => {
    if (item.data_source.item.name === "device_type") {
      navigate("QrScannerScreen", {
        expectedDeviceName: undefined,
        device_TypeName: "",
        dataSource: item,
        normalName: getNormalName(),
      });
    } else if (item.data_source.item.name === "cloud_feed_type") {
      navigate("AddOnlineDataSourceScreen");
    }
  };

  //Used for when we start the item
  const openHelpUrl = () => openUrl(item.data_source.FAQ_url, false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${CompleteURL}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // End region

  function formatDateAndTime(date?: Date) {
    const inputDate = date || new Date();
    const locale = locales[resolvedLanguage] || enUS;

    let formatString = "cccccc, LLL d, yyy HH:mm";

    if (resolvedLanguage === "nl-NL") {
      formatString = "cccccc d LLL yyy HH:mm";
    }

    return format(inputDate, formatString, { locale });
  }

  function checkNextUpload(item: AllDataSourcesResponse): string {
    const latestUpload = item.latest_upload ?? new Date();
    const timeNow = new Date();
    let cronExpression = item.data_source.uploadschedule ?? "";

    // Replace '0' in cron expression with corresponding value from latestUpload
    const parts = cronExpression.split(" ");
    if (parts.includes("0")) {
      const [minute, hour, daym, month, dayw] = parts;
      cronExpression = [
        minute === "0" ? latestUpload.getMinutes().toString() : minute,
        hour === "0" ? latestUpload.getHours().toString() : hour,
        daym === "0" ? latestUpload.getDate().toString() : daym, // Day of the month
        month === "0" ? (latestUpload.getMonth() + 1).toString() : month, // Month (0-11, so we add 1)
        dayw === "0" ? latestUpload.getDay().toString() : dayw, // Day of the week
      ].join(" ");
    }

    try {
      const intervalIterator = cronParser.parseExpression(cronExpression, { currentDate: latestUpload });
      const scheduledTime = intervalIterator.next().toDate();
      // Calculate minutes until the next upload
      const timeToUpload = Math.ceil((scheduledTime.getTime() - timeNow.getTime()) / (1000 * 60));
      if (timeToUpload < 0) {
        return "0/0";
      } else {
        const timeTotal = Math.ceil((scheduledTime.getTime() - latestUpload.getTime()) / (1000 * 60));
        return `${timeToUpload}/${timeTotal}`;
      }
    } catch (error) {
      console.error("Error parsing cron expression:", error);
      return "0/0";
    }
  }

  function checkMissedUpload(item: AllDataSourcesResponse): number {
    const latestUploadString = item.latest_upload ? item.latest_upload.toLocaleString() : "";
    const timeNow = new Date();
    const cronExpression = item.data_source.uploadschedule ? item.data_source.uploadschedule : "";
    const notificationThresholdDurationISO = item.data_source.notificationThresholdDuration;
    try {
      const intervalIterator = cronParser.parseExpression(cronExpression, { currentDate: latestUploadString });
      let missedIntervals = 0;
      let upToDate = false;

      // Convert ISO 8601 duration to Luxon Duration
      if (notificationThresholdDurationISO) {
        const thresholdTime = DateTime.fromISO(latestUploadString).plus(
          Duration.fromISO(notificationThresholdDurationISO)
        );

        // Check if the current time has passed the threshold time
        if (DateTime.now() >= thresholdTime) return -2;
      }

      while (!upToDate && intervalIterator.hasNext() && missedIntervals < 10) {
        const nextInterval = intervalIterator.next().toDate();
        if (nextInterval.getTime() === timeNow.getTime()) break;
        if (nextInterval.getTime() < timeNow.getTime()) {
          missedIntervals++;
        } else {
          upToDate = true;
        }
      }
      return missedIntervals;
    } catch (error) {
      console.error("Error parsing cron expression:", error);
      return -1;
    }
  }

  function updateMonitoring() {
    setTimeToUpload(checkNextUpload(item));
    setMissed(checkMissedUpload(item));
  }
  useEffect(() => {
    if (item.latest_upload) {
      updateMonitoring();
    }
  }, [item]);

  const handleTimePassedByMinute = () => {
    if (item.latest_upload) {
      updateMonitoring();

      if (timeToUpload) {
        const [elapsedTime, totalTime] = timeToUpload.split("/").map(Number);
        if (elapsedTime === 0 && totalTime >= 0) {
          refreshAfter20Seconds();
        }
      }
    }
  };

  return (
    <>
      <ListItem.Swipeable
        onPress={() => {
          if (item.connected === 1) {
            handleItemClick();
          }
          if (item.connected === 0) {
            openManual();
          }
        }}
        onSwipeBegin={onSwipeBegin}
        onSwipeEnd={onSwipeEnd}
        leftWidth={0}
        rightContent={
          item.connected === 2 && !(item.data_source.item.name === "cloud_feed_type")
            ? close => (
                <Button
                  title={t("screens.device_overview.device_list.reset_device")}
                  onPress={() => onReset(close)}
                  buttonStyle={{ minHeight: "100%", backgroundColor: theme.colors.primary }}
                />
              )
            : null
        }
        style={[style.listItem]}
        containerStyle={[
          {
            backgroundColor:
              item.connected === 0
                ? "#d3eaf9"
                : item.connected === 1
                ? "#d9dadb"
                : item.connected === 2 && allItemsDone
                ? "white"
                : item.connected === 2
                ? "#aef2b7"
                : "initial",
          },
          { borderTopLeftRadius: 0 },
          { borderBottomLeftRadius: 0 },
        ]}
        Component={TouchableHighlight}
      >
        <ListItem.Content>
          <ListItem.Title>
            {item.connected === 2 ? (
              <>
                {item.data_source.item.name === "device_type" && (
                  <>
                    {missed === 0 ? (
                      <Icon name="layers" color="green" size={16} />
                    ) : missed === -1 || missed >= 1 ? (
                      <Icon name="layers" color="orange" size={16} />
                    ) : (
                      <Icon name="layers" color="red" size={16} />
                    )}
                  </>
                )}
                {item.data_source.item.name === "energy_query_type" && (
                  <>
                    {missed === 0 ? (
                      <Icon name="flash" color="green" size={16} />
                    ) : missed === -1 || missed >= 1 ? (
                      <Icon name="flash" color="orange" size={16} />
                    ) : (
                      <Icon name="flash" color="red" size={16} />
                    )}
                  </>
                )}
                {item.data_source.item.name === "cloud_feed_type" && (
                  <>
                    {missed === 0 ? (
                      <Icon name="cloud" color="green" size={16} />
                    ) : missed === -1 || missed >= 1 ? (
                      <Icon name="cloud" color="orange" size={16} />
                    ) : (
                      <Icon name="cloud" color="red" size={16} />
                    )}
                  </>
                )}
              </>
            ) : null}

            {" " + getNormalName()}
          </ListItem.Title>
          {item.connected === 2 ? (
            <ListItem.Subtitle>
              {item.latest_upload
                ? t("screens.device_overview.device_list.device_info.last_seen", {
                    date: formatDateAndTime(item.latest_upload),
                  })
                : t("screens.device_overview.device_list.device_info.no_data")}
            </ListItem.Subtitle>
          ) : null}
          {timeToUpload && item.connected === 2 ? (
            <TimeProgressBar
              progress={timeToUpload}
              onTimePassedByMinute={handleTimePassedByMinute}
              notificationSent={missed === -2}
            />
          ) : null}
        </ListItem.Content>
        <View style={{ flexDirection: "column" }}>
          {item.connected === 0 ? (
            <Icon name="lock-open-outline" size={32} />
          ) : item.connected === 1 ? (
            <Icon name="lock-closed-outline" size={32} />
          ) : item.connected === 2 ? null : null}

          {item.data_source.FAQ_url !== "" ? (
            <TouchableOpacity onPress={openHelpUrl}>
              <Icon name="help-circle-outline" size={32} />
            </TouchableOpacity>
          ) : null}
        </View>
        {item.connected === 2 && item.data_source.item.name !== "cloud_feed_type" ? (
          <Icon
            name="reorder-three-outline"
            size={10}
            color="gray"
            style={{ transform: [{ rotate: "90deg" }, { scaleX: 2 }, { scaleY: 2 }], marginLeft: -10 }}
          />
        ) : null}
      </ListItem.Swipeable>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  listItem: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));
