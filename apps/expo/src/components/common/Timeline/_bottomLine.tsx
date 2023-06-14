import { makeStyles, useTheme } from "@rneui/themed";
import { View } from "react-native";

import { TimelineItem } from ".";

import { Maybe } from "@/types";

type BottomLineProps = {
  index: number;
  nextItem: Maybe<TimelineItem>;
  itemCount: number;
};

export default function BottomLine(props: BottomLineProps) {
  const { index, nextItem, itemCount } = props;
  const { theme } = useTheme();
  const bgColor = nextItem?.error ? theme.colors.error : nextItem?.finished ? theme.colors.success : theme.colors.grey4;
  const style = useStyles();

  if (index === itemCount - 1) return null;

  return <View style={[style.bottomLine, { backgroundColor: bgColor }]} />;
}

const useStyles = makeStyles(theme => ({
  bottomLine: {
    position: "absolute",
    bottom: 0,
    width: 2,
    // if it's the first item or last item, make the height 50%, otherwise 100%
    height: "50%",
  },
}));
