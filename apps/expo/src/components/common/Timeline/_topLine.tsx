import { makeStyles, useTheme } from "@rneui/themed";
import { View } from "react-native";

import { TimelineItem } from ".";

type TopLineProps = {
  item: TimelineItem;
  index: number;
};

export default function TopLine(props: TopLineProps) {
  const { item, index } = props;
  const { theme } = useTheme();
  const bgColor = item.error ? theme.colors.error : item.finished ? theme.colors.success : theme.colors.grey4;
  const styles = useStyles();

  if (index === 0) return null;

  return <View style={[styles.topLine, { backgroundColor: bgColor }]} />;
}

const useStyles = makeStyles(theme => ({
  topLine: {
    position: "absolute",
    top: 0,
    width: 2,

    // if it's the first item or last item, make the height 50%, otherwise 100%
    height: "50%",
  },
}));
