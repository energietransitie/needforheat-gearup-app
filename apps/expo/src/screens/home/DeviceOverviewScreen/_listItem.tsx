import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, ListItem, makeStyles, useTheme } from "@rneui/themed";
import { format } from "date-fns";
import { enUS, nl } from "date-fns/locale";
import { useEffect, useState } from "react";
import { ToastAndroid, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { MANUAL_URL } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import { BuildingDeviceResponse } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";
import { capitalizeFirstLetter } from "@/utils/tools";
import cronParser from 'cron-parser';
import "intl";
//import { Platform } from "react-native";
import "intl/locale-data/jsonp/en";
import TimeProgressBar from "./timeProgressBar";

type WifiNetworkListItemProps = {
  item: BuildingDeviceResponse;
  onSwipeBegin?: () => void;
  onSwipeEnd?: () => void;
};

export default function DeviceListItem(props: WifiNetworkListItemProps) {
  const { item, onSwipeBegin, onSwipeEnd } = props;
  const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
  const { openUrl } = useOpenExternalLink();
  const { theme } = useTheme();
  const style = useStyles();
  const { t, resolvedLanguage } = useTranslation();
  const [data, setData] = useState(null); // Initialize data state variable
  const CompleteURL = MANUAL_URL + item.device_type.name;

  const [missed, setMissed] = useState(0);
  const [timeToUpload, setTimeToUpload] = useState<string>();

  const onReset = (close: () => void) => {
    if (item.typeCategory === "device_type") {
      navigate("QrScannerScreen", { expectedDeviceName: item.name, device_TypeName: item.name });
    }
    close();
  };

  const handleItemClick = () => {
    ToastAndroid.show(t("screens.device_overview.toast_message"), ToastAndroid.SHORT);
  };

  const openManual = () => {
    if (item.typeCategory === "device_type") {
      navigate("AddDeviceScreen", { device: item.device_type });
    } else if (item.typeCategory === "cloud_feed") {
      navigate("AddOnlineDataSourceScreen");
    }
  };
  // false so it won't open the pop-up but it will open the URL
  const openHelpUrl = () => openUrl(item.device_type.info_url, false);

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

  const locales: Record<string, Locale> = {
    "en-US": enUS,
    "nl-NL": nl,
  };

  function formatDateAndTime(date?: Date) {
    const inputDate = date || new Date();
    const locale = locales[resolvedLanguage] || enUS;

    let formatString = "cccccc, LLL d, yyy HH:mm";

    if (resolvedLanguage === "nl-NL") {
      formatString = "cccccc d LLL yyy HH:mm";
    }

    return format(inputDate, formatString, { locale });
  }
  function checkNextUpload() {
    const latestUpload: Date = item.latest_upload ? item.latest_upload : new Date();
    const timeNow = new Date();
    const cronExpression: string = item.upload_schedule ? item.upload_schedule : "";
    const intervalIterator = cronParser.parseExpression(cronExpression, { currentDate: latestUpload });
    const scheduledTime = intervalIterator.next();
    const timeToUpload = Math.round((scheduledTime.getTime() - timeNow.getTime()) / 60000);
    const timeTotal = Math.round((scheduledTime.getTime() - latestUpload.getTime()) / 60000);
    if (timeToUpload < 0) {
      return "0/0";
    } else {
      return timeToUpload + "/" + timeTotal;
    }
  }

  function checkMissedUpload() {
    const latestUpload: string = item.latest_upload ? item.latest_upload.toISOString() : "";
    const timeNow = new Date();
    const cronExpression: string = item.upload_schedule ? item.upload_schedule : "";
    const interval = item.upload_schedule;

    let missedIntervals = 0;
    var upToDate = false;

    try {
      const intervalIterator = cronParser.parseExpression(cronExpression, { currentDate: latestUpload });

      while (!upToDate && intervalIterator.hasNext() && missedIntervals < 10) {
        const nextInterval = intervalIterator.next();
        if (nextInterval.getTime() < timeNow.getTime()) {
          missedIntervals++;
        } else {
          upToDate = true;
        }
      }
    } catch (error) {
      console.error(error);
      return -1;
    }

    //console.log('Missed intervals:', missedIntervals);
    return missedIntervals;
  }

  useEffect(() => {
    if (data) {
      setTimeToUpload(checkNextUpload());
      setMissed(checkMissedUpload());
    }
  }, [data, item]);

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
          item.connected === 2 && !(item.typeCategory === "cloud_feed")
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
                ? "#45b97c"
                : item.connected === 1
                  ? "grey"
                  : item.connected === 2
                    ? "white"
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
                {item.typeCategory === "device_type" && (
                  <>
                    {missed === 0 ? (
                      <Icon name="layers" color="green" size={16} />
                    ) : (
                      <Icon name="layers" color="orange" size={16} />
                    )}
                  </>
                )}
                {item.typeCategory === "energy_query_type" && (
                  <>
                    {missed === 0 ? (
                      <Icon name="flash" color="green" size={16} />
                    ) : (
                      <Icon name="flash" color="orange" size={16} />
                    )}
                  </>
                )}
                {item.typeCategory === "cloud_feed" && (
                  <>
                    {missed === 0 ? (
                      <Icon name="cloud" color="green" size={16} />
                    ) : (
                      <Icon name="cloud" color="orange" size={16} />
                    )}
                  </>
                )}
              </>
            ) : null}

            {resolvedLanguage === "nl-NL"
              ? data?.["nl-NL"]
                ? " " + capitalizeFirstLetter(data["nl-NL"])
                : ""
              : data?.["en-US"]
                ? " " + capitalizeFirstLetter(data["en-US"])
                : ""}
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
          {timeToUpload ? (
            <TimeProgressBar progress={timeToUpload} />
          ) : null}
        </ListItem.Content>
        <View style={{ flexDirection: "column" }}>
          {item.connected === 0 ? (
            <Icon name="lock-open-outline" size={32} />
          ) : item.connected === 1 ? (
            <Icon name="lock-closed-outline" size={32} />
          ) : item.connected === 2 ? null : null}

          {item.device_type.info_url !== "" ? (
            <TouchableOpacity onPress={openHelpUrl}>
              <Icon name="help-circle-outline" size={32} />
            </TouchableOpacity>
          ) : null}

        </View>
        {item.connected === 2 && item.typeCategory !== "cloud_feed" ? (
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
