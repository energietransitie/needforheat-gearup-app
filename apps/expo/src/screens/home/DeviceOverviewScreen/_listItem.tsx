import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, ListItem, makeStyles, useTheme } from "@rneui/themed";
import { format } from "date-fns";
import { enUS, nl } from "date-fns/locale";
import { useEffect, useState } from "react";
import { TouchableHighlight, TouchableOpacity, View, ToastAndroid } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Progressbar from "./progressBar";

import { MANUAL_URL } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import { BuildingDeviceResponse } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";
import { capitalizeFirstLetter } from "@/utils/tools";

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

  const handleItemClick = () => {
    ToastAndroid.show("Maak het huidige databron af om verder te kunnen", ToastAndroid.SHORT);
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
  return (
    <View style={{ flex: 1 }}>
    <Progressbar />
    <ListItem.Swipeable
      onPress={handleItemClick}
      onSwipeBegin={onSwipeBegin}
      onSwipeEnd={onSwipeEnd}
      leftWidth={0}
      rightContent={item.connected === 2 && !(item.typeCategory === "cloud_feed") ? close => (
        <Button
          title={t("screens.device_overview.device_list.reset_device")}
          onPress={() => onReset(close)}
          buttonStyle={{ minHeight: "100%", backgroundColor: theme.colors.primary }}
        />
      ) : null}
      style={[style.listItem]}
      containerStyle={[
        {
          backgroundColor: item.connected === 0 ? '#45b97c' : 
                          item.connected === 1 ? 'grey' : 
                          item.connected === 2 ? 'white' : 'initial',
        },
        { borderTopLeftRadius: 20 },
        { borderBottomLeftRadius: 20 },
      ]}
      Component={TouchableHighlight}>
      <ListItem.Content>
        <ListItem.Title>
          {item.connected === 2 ? (
            item.latest_upload ? (
              <Icon name="cloud-outline" color="green" size={16} />
            ) : (
              <Icon name="cloud-offline-outline" color="red" size={16} />
            )
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
      </ListItem.Content>
      {item.device_type.info_url !== "" ? (
        <View style={{ flexDirection: "column" }}>
          {item.activated_at ? (
            <Icon name="lock-open-outline" size={30} />
          ) : (
            <Icon name="lock-closed-outline" size={30} />
          )}
          <TouchableOpacity onPress={openHelpUrl}>
            <Icon name="help-circle-outline" size={30} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        </View>
      ) : null}
      {item.connected === 0 ? (
        <TouchableOpacity onPress={openManual}>
          <Icon name="arrow-forward-circle" size={32} />
        </TouchableOpacity>
      ) : null} */}
    </ListItem.Swipeable>
    </View>
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
