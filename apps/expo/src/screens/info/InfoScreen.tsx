import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListItem, makeStyles, Text, useTheme } from "@rneui/themed";
import { Alert, FlatList, Linking, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { InfoStackParamList } from "@/types/navigation";
import useUser from "@/hooks/user/useUser";

type InfoItemBase = { title: string; icon: string };
type InfoItemURI = InfoItemBase & { uri: string };
type InfoItemRoute = InfoItemBase & { route: keyof InfoStackParamList };
type InfoItem = InfoItemURI | InfoItemRoute;

type InfoItemProps = {
  item: InfoItem;
  onPress: () => void;
};

function InfoListItem({ item, onPress }: InfoItemProps) {
  const { theme } = useTheme();
  const styles = useStyles();

  return (
    <ListItem Component={TouchableOpacity} onPress={onPress} style={styles.item}>
      <Ionicons style={styles.icon} name={item.icon} size={theme.spacing.xl} />
      <ListItem.Content>
        <Text h4>{item.title}</Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
}

type InfoScreenProps = NativeStackScreenProps<InfoStackParamList, "InfoScreen">;

export default function InfoScreen({ navigation }: InfoScreenProps) {
  const { t, resolvedLanguage } = useTranslation();
  const { user } = useUser();

  function getFaqUri() {
    if (user?.campaign) {
      return user.campaign.info_url + "/" + resolvedLanguage;
    } else {
      return "https://manuals.tst.energietransitiewindesheim.nl/campaigns/generic/info/" + resolvedLanguage;
    }
  }

  const data: InfoItem[] = [
    {
      title: t("screens.info_stack.about.title"),
      uri: "https://manuals.tst.energietransitiewindesheim.nl/campaigns/reducedheatcarb2023/info/" + resolvedLanguage,
      icon: "book-outline",
    },
    {
      title: t("screens.info_stack.faq.title"),
      uri: getFaqUri(),
      icon: "help-circle-outline",
    },
    {
      title: t("screens.info_stack.privacy.title"),
      uri: "https://manuals.tst.energietransitiewindesheim.nl/campaigns/reducedheatcarb2023/privacy",
      icon: "shield",
    },
  ];

  const onPress = async (item: InfoItem) => {
    if ("uri" in item) {
      try {
        await Linking.openURL(item.uri);
      } catch {
        Alert.alert(
          t("screens.info_stack.info.unsuported_url_alert.title"),
          t("screens.info_stack.info.unsuported_url_alert.message", { url: item.uri })
        );
      }
    } else {
      navigation.navigate(item.route);
    }
  };
  return (
    <Box style={{ flex: 1 }}>
      <FlatList data={data} renderItem={({ item }) => <InfoListItem item={item} onPress={() => onPress(item)} />} />
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    paddingRight: theme.spacing.lg,
  },
}));