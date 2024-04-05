import StatusIndicator from "@/components/common/StatusIndicator";
import useDevices from "@/hooks/device/useDevices";
import { UserContext } from "@/providers/UserProvider";
import { BuildingDeviceResponse } from "@/types/api";
import { t } from "i18next";
import { useContext, useState } from "react";
import { FlatList, Text } from "react-native";
import DeviceListItem from "./_listItem";

export default function DeviceList({ buildingId, refresh, onRefresh }: { buildingId: number, refresh: boolean; onRefresh: () => void }) {
  const { data, isLoading, refetch, isRefetching } = useDevices(buildingId);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const { user } = useContext(UserContext);
  const onSwipeBegin = () => setScrollEnabled(false);
  const onSwipeEnd = () => setScrollEnabled(true);

  let shouldLoad: boolean = true;
  if (!isLoading || Boolean(user)) {
    shouldLoad = false;
  }

  if (shouldLoad) {
    return <>
      <StatusIndicator isLoading={shouldLoad} />;
    </>
  }

  if (refresh) {
    refetch();
    onRefresh();
  }

  return (
    <FlatList<BuildingDeviceResponse>
      data={data}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ width: "100%" }}
      keyExtractor={item => item.name}
      renderItem={({ item }) => <DeviceListItem {...{ item, onSwipeBegin, onSwipeEnd }} />}
      ListEmptyComponent={
        <StatusIndicator isError errorText={t("screens.device_overview.device_list.empty_collection")} />
      }
      onRefresh={refetch}
      refreshing={isRefetching}
      scrollEnabled={scrollEnabled}
    />
  );
}
