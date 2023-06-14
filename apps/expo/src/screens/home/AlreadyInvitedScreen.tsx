import { useNavigation, NavigationProp } from "@react-navigation/native";
import { makeStyles, Button, Text } from "@rneui/themed";
import { useTranslation } from "react-i18next";

import Box from "@/components/elements/Box";
import { HomeStackParamList } from "@/types/navigation";

export default function AlreadyInvitedScreen() {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  function onPressGoBack() {
    navigation.goBack();
  }

  return (
    <Box padded style={styles.container}>
      <Box>
        <Text style={styles.title}>{t("screens.home_stack.already_invited.expanded_title")}</Text>
        <Text style={styles.description}>{t("screens.home_stack.already_invited.description")}</Text>
      </Box>
      <Button fullWidth title={t("common.go_back")} onPress={onPressGoBack} />
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "RobotoBold",
    fontSize: 24,
    paddingHorizontal: theme.spacing.lg,
  },
  description: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
}));
