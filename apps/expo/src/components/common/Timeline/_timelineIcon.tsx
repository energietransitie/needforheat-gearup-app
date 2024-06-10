import { makeStyles, useTheme } from "@rneui/themed";
import { ActivityIndicator, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { TimelineItem } from ".";

type IconProps = {
  item: TimelineItem;
};

export default function TimelineIcon(props: IconProps) {
  const { item } = props;
  const { theme } = useTheme();
  const bgColor = item.error ? theme.colors.error : item.finished ? theme.colors.success : theme.colors.grey4;
  const iconName = item.error ? "close-circle-outline" : "checkmark";
  const iconColor = item.error || item.finished ? theme.colors.white : theme.colors.black;
  const styles = useStyles();

  return (
    <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
      {item.loading && !item.error ? (
        <ActivityIndicator size="small" style={styles.loadingIndicator} color={theme.colors.black} />
      ) : (
        <Ionicons name={iconName} size={18} color={iconColor} />
      )}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
  },
}));
