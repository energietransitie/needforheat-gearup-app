import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, makeStyles, Text, useTheme } from "@rneui/themed";
import { Image } from "react-native";

import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";

export default function AuthenticatedHomeScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  /**
   * Navigate to QrScannerScreen
   */
  function onPressAddDevice() {
    navigation.navigate("QrScannerScreen");
  }

  return (
    <Box padded style={styles.container}>
      <Text style={styles.title}>{t("screens.home_stack.home.authenticated.title")}</Text>
      <Text style={styles.description}>{t("screens.home_stack.home.authenticated.description")}</Text>
      <Box center padded style={styles.animationContainer}>
        <Image style={styles.image} source={require("../../../../assets/animation_640_lg21ea3p.gif")} />
      </Box>
      <Button
        fullWidth
        title={t("screens.home_stack.home.buttons.add_device")}
        onPress={onPressAddDevice}
        icon={{
          name: "camera-outline",
          type: "ionicon",
          color: theme.colors.white,
        }}
      />
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
  button: {
    marginTop: theme.spacing.xl,
  },
  animationContainer: {
    paddingVertical: 150,
    width: "100%",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    aspectRatio: 1 / 1,
  },
}));
