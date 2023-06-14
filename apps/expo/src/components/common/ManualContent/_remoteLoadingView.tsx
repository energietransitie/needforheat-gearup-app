import StatusIndicator from "../StatusIndicator";

import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";

export default function RemoteLoadingView() {
  const { t } = useTranslation();

  return (
    <Box center>
      <StatusIndicator isLoading loadingText={t("components.manual_content.loading")} />
    </Box>
  );
}
