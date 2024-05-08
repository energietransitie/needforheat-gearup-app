import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, ListItem, makeStyles, useTheme } from "@rneui/themed";
import * as Burnt from "burnt";
import cronParser from "cron-parser";
import { format } from "date-fns";
import { enUS, nl } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Platform, ToastAndroid, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import TimeProgressBar from "./timeProgressBar";

import useTranslation from "@/hooks/translation/useTranslation";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import { AllDataSourcesResponse, DataSourceType } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";
import { capitalizeFirstLetter, checkMissedUpload, getManualUrl, toLocalDateTime } from "@/utils/tools";
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
  const CompleteURL = getManualUrl(item.data_source as DataSourceType);

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

    if (!name && item.data_source?.item?.Name) {
      name = capitalizeFirstLetter(item.data_source.item.Name) || name;
    }

    return name;
  };

  const onReset = (close: () => void) => {
    if (item.data_source?.category === "device_type") {
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
      ToastAndroid.show(t("screens.device_overview.toast_message"), ToastAndroid.LONG);
    } else {
      Burnt.toast({
        title: t("screens.device_overview.toast_title"),
        message: t("screens.device_overview.toast_message"),
        preset: "error",
      });
    }
  };

  const openManual = () => {
    if (item.data_source?.category === "device_type") {
      navigate("QrScannerScreen", {
        expectedDeviceName: undefined,
        device_TypeName: "",
        dataSource: item,
        normalName: getNormalName(),
      });
    } else if (item.data_source?.category === "cloud_feed_type") {
      navigate("AddOnlineDataSourceScreen");
    } else if (item.data_source?.category === "energy_query_type") {
      if (item.name === "weather-interpolation-location") {
        navigate("InformationScreen", { dataSource: item.data_source });
      }
    }
  };

  const openResult = () => {
    if (item.data_source?.category === "energy_query_type") {
      if (item.name === "weather-interpolation-location") {
        navigate("InformationScreen", { device: item.device_type });
      } else if (item.name === "building-profile") {
        navigate("WeatherLocationPostedScreen");
      }
    }
  };

  const openHelpUrl = () => {
    if (item.data_source?.faq_url) {
      openUrl(item.data_source.faq_url, false);
    }
  };

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
      console.error("Error fetching data listitem:", error);
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
    const latestUpload = toLocalDateTime(item.latest_upload) ?? toLocalDateTime(item.activated_at) ?? new Date();
    const timeNow = new Date();
    let cronExpression = item.data_source?.upload_schedule ?? "";

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

  function updateMonitoring() {
    setTimeToUpload(checkNextUpload(item));
    setMissed(checkMissedUpload(item));
  }

  useEffect(() => {
    if (item.latest_upload || item.activated_at) {
      updateMonitoring();
    }
  }, [item, timeToUpload, missed]);

  const handleTimePassedByMinute = () => {
    if (item.latest_upload || item.activated_at) {
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
        testID="device-list-item"
        onPress={() => {
          if (item.connected === 1) {
            handleItemClick();
          }
          if (item.connected === 0) {
            openManual();
          }
          if (item.connected === 2) {
            openResult();
          }
        }}
        onSwipeBegin={onSwipeBegin}
        onSwipeEnd={onSwipeEnd}
        leftWidth={0}
        rightContent={
          item.connected === 2 &&
          !(item.data_source?.category === "cloud_feed_type") &&
          !(item.data_source?.category === "energy_query_type")
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
                ? "white"
                : item.connected === 1
                ? "#e3e3e3"
                : item.connected === 2 && allItemsDone
                ? "white"
                : item.connected === 2
                ? "#aef2b7"
                : "initial",
          },
          { borderTopLeftRadius: 0 },
          { borderBottomLeftRadius: 0 },
          { borderBottomWidth: 1 },
          { borderBottomColor: "#dbdbd9" },
        ]}
        Component={TouchableHighlight}
      >
        <ListItem.Content>
          <ListItem.Title style={{ color: item.connected === 1 ? "#cccccc" : "black" }}>
            {item.connected === 2 ? (
              <>
                {item.data_source?.category === "device_type" && (
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
                {item.data_source?.category === "energy_query_type" && (
                  <>
                    {item.connected === 2 ? (
                      <Icon name="flash" color="green" size={16} />
                    ) : (
                      <Icon name="flash" color="red" size={16} />
                    )}
                  </>
                )}
                {item.data_source?.category === "cloud_feed_type" && (
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
              </> //changes the colors of the icons if the item is enabled or disabled
            ) : item.connected === 0 ? (
              <>
                {item.data_source?.category === "device_type" && <Icon name="layers" color="black" size={16} />}
                {item.data_source?.category === "energy_query_type" && <Icon name="flash" color="black" size={16} />}
                {item.data_source?.category === "cloud_feed_type" && <Icon name="cloud" color="black" size={16} />}
              </>
            ) : item.connected === 1 ? (
              <>
                {item.data_source?.category === "device_type" && <Icon name="layers" color="#cccccc" size={16} />}
                {item.data_source?.category === "energy_query_type" && <Icon name="flash" color="#cccccc" size={16} />}
                {item.data_source?.category === "cloud_feedType" && <Icon name="cloud" color="#cccccc" size={16} />}
              </>
            ) : null}
            {" " + getNormalName()}
          </ListItem.Title>
          {item.connected === 2 && item.data_source?.category !== "energy_query_type" ? (
            <ListItem.Subtitle style={[style.listItemSubtitle]}>
              {item.latest_upload || item.activated_at
                ? t("screens.device_overview.device_list.device_info.last_seen", {
                    date: formatDateAndTime(
                      toLocalDateTime(
                        item.latest_upload && item.latest_upload > 0 ? item.latest_upload : item.activated_at
                      )
                    ),
                  })
                : t("screens.device_overview.device_list.device_info.no_data")}
            </ListItem.Subtitle>
          ) : null}
          {timeToUpload && item.connected === 2 && item.data_source?.category !== "energy_query_type" ? (
            <TimeProgressBar
              progress={timeToUpload}
              onTimePassedByMinute={handleTimePassedByMinute}
              notificationSent={missed === -2}
            />
          ) : null}
        </ListItem.Content>
        <View style={{ flexDirection: "column" }}>
          {item.data_source?.faq_url !== "" ? (
            <TouchableOpacity onPress={openHelpUrl}>
              <Icon name="help-circle-outline" size={32} />
            </TouchableOpacity>
          ) : null}
        </View>
        {item.connected === 2 &&
        item.data_source?.category !== "cloud_feed_type" &&
        item.data_source?.category !== "energy_query_type" ? (
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
  listItemSubtitle: {
    marginRight: 24,
  },
}));
