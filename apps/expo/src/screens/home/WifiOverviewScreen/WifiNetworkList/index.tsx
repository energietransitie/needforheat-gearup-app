import { FlatList, FlatListProps } from "react-native";

import WifiNetworkListItem from "./_listItem";

import StatusIndicator from "@/components/common/StatusIndicator";
import useTranslation from "@/hooks/translation/useTranslation";
import { WifiEntry } from "@/types";
export { default as WifiNetworkListItem } from "./_listItem";

type WifiNetworkListProps = {
  networks: WifiEntry[];
  onConnect: (network: WifiEntry) => void;
} & Pick<FlatListProps<WifiEntry>, "onRefresh" | "refreshing">;

export default function WifiNetworkList(props: WifiNetworkListProps) {
  const { networks, onConnect, refreshing, onRefresh } = props;
  const { t } = useTranslation();

  return (
    <FlatList<WifiEntry>
      data={networks}
      keyExtractor={item => item.name}
      renderItem={({ item }) => <WifiNetworkListItem item={item} onConnect={onConnect} />}
      ListEmptyComponent={<StatusIndicator isError errorText={t("components.wifi_network_list.empty_collection")} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
