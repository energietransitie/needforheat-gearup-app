import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListItem, makeStyles, Text, useTheme } from "@rneui/themed";
import { Alert, FlatList, Linking, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { fetchUser } from "@/api/user"; 

import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { InfoStackParamList } from "@/types/navigation";

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

//This function gets the url from the backend. This is done to prevent the url from being hardcoded in the app.
function getFaqUri() {
  console.log(fetchUser()); //fetch backend url

  return ""; //return url
}

type InfoScreenProps = NativeStackScreenProps<InfoStackParamList, "InfoScreen">;

export default function InfoScreen({ navigation }: InfoScreenProps) {
  const { t } = useTranslation();

  const data: InfoItem[] = [
    {
      title: t("screens.info_stack.about.title"),
      uri: "https://manuals.tst.energietransitiewindesheim.nl/campaigns/info",
      icon: "book-outline",
    },
    {
      title: t("screens.info_stack.faq.title"),
      uri: "FAQ_PLACEHOLDER", //This is a placeholder, the real url is fetched from the backend. This is done to prevent the url from being hardcoded in the app.
      icon: "help-circle-outline",
    },
    {
      title: t("screens.info_stack.privacy.title"),
      uri: "https://manuals.tst.energietransitiewindesheim.nl/campaigns/privacy",
      icon: "shield",
    },
  ];

  const onPress = async (item: InfoItem) => {
    if ("uri" in item) {
      const uri = item.uri === "FAQ_PLACEHOLDER" ? getFaqUri() : item.uri; //I check if the uri is the placeholder, if so, I fetch the real url from the backend. If not, I use the uri as is.
      try {
        await Linking.openURL(uri);
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