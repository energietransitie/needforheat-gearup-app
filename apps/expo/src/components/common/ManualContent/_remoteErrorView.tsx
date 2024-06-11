import StatusIndicator from "../StatusIndicator";

import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";

export default function RemoteErrorView() {
  const { t } = useTranslation();

  return (
    <Box center>
      <StatusIndicator isError errorText={t("components.manual_content.error") as string} />
    </Box>
  );
}
