import { ListItem, makeStyles, Text } from "@rneui/themed";
import { TouchableOpacity } from "react-native";

import Box from "../../../components/elements/Box";

export type SettingItem = {
  title: string;
  value: string;
  onPress: () => void;
  isDangerous?: boolean;
};

type SettingItemProps = {
  item: SettingItem;
};

export default function SettingListItem({ item }: SettingItemProps) {
  const styles = useStyles(item);

  return (
    <ListItem Component={TouchableOpacity} onPress={item.onPress} style={styles.item}>
      <ListItem.Content>
        <Box fullWidth style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </Box>
      </ListItem.Content>
    </ListItem>
  );
}

const useStyles = makeStyles((theme, props: SettingItem) => ({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: props.isDangerous ? theme.colors.error : theme.colors.black,
  },
  value: {
    color: theme.colors.grey2,
  },
}));
