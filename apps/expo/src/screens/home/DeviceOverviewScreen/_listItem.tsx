import { MANUAL_URL } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import { BuildingDeviceResponse } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";
import { capitalizeFirstLetter } from "@/utils/tools";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, ListItem, makeStyles, useTheme } from "@rneui/themed";
import { format } from 'date-fns';
import { enUS, nl } from 'date-fns/locale';
import { useEffect, useState } from "react";
import { TouchableHighlight, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { CronExpression, ParserOptions } from 'cron-parser';
import { parse, addMinutes } from 'date-fns';
import cronParser from 'cron-parser';
import { string } from "zod";
import "intl";
//import { Platform } from "react-native";
import "intl/locale-data/jsonp/en";

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
  const onReset = (close: () => void) => {
    if (item.typeCategory === "device_type") {
      navigate("QrScannerScreen", { expectedDeviceName: item.name, device_TypeName: item.name });
    }
    close();
  };

  const openManual = () => {
    if (item.typeCategory === "device_type") {
      navigate("AddDeviceScreen", { device: item.device_type });
    } else if (item.typeCategory === "cloud_feed") {
      navigate("AddOnlineDataSourceScreen");
    }
  }
  // false so it won't open the pop-up but it will open the URL
  const openHelpUrl = () => openUrl(item.device_type.info_url, false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${CompleteURL}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const locales: Record<string, Locale> = {
    'en-US': enUS,
    'nl-NL': nl,
  };

  function formatDateAndTime(date?: Date) {
    const inputDate = date || new Date();
    const locale = locales[resolvedLanguage] || enUS;

    let formatString = 'cccccc, LLL d, yyy HH:mm';

    if (resolvedLanguage === 'nl-NL') {
      formatString = 'cccccc d LLL yyy HH:mm';
    }

    return format(inputDate, formatString, { locale });
  }
  function checkNextUpload(){
    
    const latestUpload: Date = item.latest_upload ? item.latest_upload : new Date();
    const timeNow = new Date();
    const cronExpression: string = item.upload_schedule ? item.upload_schedule : "";
    const intervalIterator = cronParser.parseExpression(cronExpression, { currentDate: latestUpload });
    // console.log(item.id);
    // console.log('Latest ',latestUpload.toISOString());
    // console.log('Latest ',latestUpload.getTime());
    // console.log('now    ',timeNow.toISOString());
    // console.log('now    ',timeNow.getTime());
    const scheduledTime = intervalIterator.next();
    // console.log('sched  ',scheduledTime.toISOString());
    // console.log('sched  ',scheduledTime.getTime());
    const diff = Math.round((scheduledTime.getTime() - timeNow.getTime()) /60000);
    console.log('DIFF', diff);
    return diff;
    
  }
  function checkMissedUpload(){
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

  return (
    <ListItem.Swipeable
      onSwipeBegin={onSwipeBegin}
      onSwipeEnd={onSwipeEnd}
      leftWidth={0}
      rightContent={item.connected && !(item.typeCategory === "cloud_feed") ? close => (
        <Button
          title={t("screens.device_overview.device_list.reset_device")}
          onPress={() => onReset(close)}
          buttonStyle={{ minHeight: "100%", backgroundColor: theme.colors.primary }}
        />
      ) : null}
      style={[style.listItem]}
      containerStyle={[
        {
          backgroundColor: (!item.connected) ? '#45b97c' : 'white',
        },
        { borderTopLeftRadius: 20 },
        { borderBottomLeftRadius: 20 }
      ]}
      Component={TouchableHighlight}
    >
      <ListItem.Content>
        <ListItem.Title>
          {item.typeCategory == "device_type" ? (
            <>
            {checkNextUpload()}
            {checkMissedUpload() == 0 ? (
              <Icon name="layers" color="green" size={16}/>
            ) : (
              <Icon name="layers" color="orange" size={16}/>
            )}
            </>
          ) : null}
          {item.typeCategory == "energy_query_type" ? (
            <>
            {checkNextUpload()}
            {checkMissedUpload() == 0 ? (
              <Icon name="flash" color="green" size={16}/>
            ) : (
              <Icon name="flash" color="orange" size={16}/>
            )}
            </>
          ) : null}
          {item.typeCategory == "cloud_feed" ? (
            <>
            {checkMissedUpload() == 0 ? (
              <Icon name="cloud" color="green" size={16}/>
            ) : (
              <Icon name="cloud" color="orange" size={16}/>
            )}
            </>
          ) : null}
          {resolvedLanguage === "nl-NL"
            ? data?.["nl-NL"] ? " " + capitalizeFirstLetter(data["nl-NL"]) : ""
            : data?.["en-US"] ? " " + capitalizeFirstLetter(data["en-US"]) : ""}
        </ListItem.Title>
        {item.connected ? (
          <ListItem.Subtitle>
            {item.latest_upload
              ? t("screens.device_overview.device_list.device_info.last_seen", {
                date: formatDateAndTime(item.latest_upload),
              })
              : t("screens.device_overview.device_list.device_info.no_data")}
          </ListItem.Subtitle>
        ) : null}
      </ListItem.Content>
      {item.device_type.info_url !== "" ? (
        <TouchableOpacity onPress={openHelpUrl}>
          <Icon name="help-circle-outline" size={32} />
        </TouchableOpacity>
      ) : null}
      {!item.connected ? (
        <TouchableOpacity onPress={openManual}>
          <Icon name="arrow-forward-circle" size={32} />
        </TouchableOpacity>
      ) : null}

    </ListItem.Swipeable>
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
