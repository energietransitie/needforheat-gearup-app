import { makeStyles, useTheme } from "@rneui/themed";
import { ActivityIndicator, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import useTranslation from "@/hooks/translation/useTranslation";

export type StatusIndicatorProps = {
  isLoading?: boolean;
  isError?: boolean;
  loadingText?: string;
  errorText?: string;
};

export default function StatusIndicator(props: StatusIndicatorProps) {
  const { t } = useTranslation();
  const {
    isLoading,
    isError,
    loadingText = t("components.status_indicator.loading"),
    errorText = t("components.status_indicator.error"),
  } = props;
  const { theme } = useTheme();
  const styles = useStyles();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.defaultText}>{loadingText}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={32} color={theme.colors.error} />
        <Text style={styles.defaultText}>{errorText}</Text>
      </View>
    );
  }

  return null;
}

const useStyles = makeStyles({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "50%",
  },
  defaultText: {
    marginTop: 16,
    textAlign: "center",
  },
});
