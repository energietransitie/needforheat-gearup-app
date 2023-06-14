import { makeStyles } from "@rneui/themed";
import { Text, View } from "react-native";

import BottomLine from "./_bottomLine";
import TimelineIcon from "./_timelineIcon";
import TopLine from "./_topLine";

export type TimelineItem = {
  title: string;
  description?: string;
  finished?: boolean;
  error?: boolean;
  loading?: boolean;
};

type TimelineProps = {
  items: TimelineItem[];
};

export default function Timeline(props: TimelineProps) {
  const { items } = props;
  const itemCount = items.length;
  const styles = useStyles();

  return (
    <View>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.nestedItemContainer}>
              <TopLine item={item} index={index} />
              <BottomLine index={index} nextItem={items[index + 1]} itemCount={itemCount} />
              <TimelineIcon item={item} />
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.titleText}>{item.title}</Text>
            {item.description && <Text style={styles.secondaryText}>{item.description}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "85%",
  },
  iconContainer: {
    paddingHorizontal: 16,
    height: "100%",
  },
  nestedItemContainer: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingVertical: 10,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  secondaryText: {
    marginBottom: 4,
  },
  mutedText: {
    fontSize: 12,
    color: theme.colors.disabled,
  },
}));
