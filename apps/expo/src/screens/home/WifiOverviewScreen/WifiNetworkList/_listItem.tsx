import { ListItem, useTheme, makeStyles } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import useStoredWifiNetworks from "@/hooks/wifi/useStoredWifiNetworks";
import { WifiEntry } from "@/types";

type WifiNetworkListItemProps = {
  item: WifiEntry;
  onConnect: (network: WifiEntry) => void;
};

function convertRSSIToLevel(rssi: Required<WifiEntry>["rssi"]) {
  if (rssi >= -50) {
    return 4;
  } else if (rssi >= -60) {
    return 3;
  } else if (rssi >= -70) {
    return 2;
  }
  return 1;
}

export default function WifiNetworkListItem(props: WifiNetworkListItemProps) {
  const { item, onConnect } = props;
  const { theme } = useTheme();
  const { storedWifiNetworks } = useStoredWifiNetworks();
  const stored = storedWifiNetworks?.some(storedNetwork => storedNetwork.name === item.name);
  const style = useStyles();

  return (
    <ListItem style={style.listItem} onPress={() => onConnect(item)} Component={TouchableOpacity}>
      <MaterialIcon
        name={`wifi-strength-${convertRSSIToLevel(item.rssi ?? -70)}`}
        size={20}
        color={theme.colors.grey3}
      />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem.Content>
      <>
        {stored && <Ionicon style={style.heartIcon} name="heart" size={20} color={theme.colors.grey3} />}
        <Ionicon name={item.security === 0 ? "lock-open" : "lock-closed"} size={20} color={theme.colors.grey3} />
      </>
    </ListItem>
  );
}

const useStyles = makeStyles(theme => ({
  listItem: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heartIcon: {
    paddingRight: theme.spacing.md,
  },
}));
