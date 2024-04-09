import { t } from "i18next";
import { useState } from "react";
import { FlatList } from "react-native";

import DeviceListItem from "./_listItem";

import StatusIndicator from "@/components/common/StatusIndicator";
import useDevices from "@/hooks/device/useDevices";
import { BuildingDeviceResponse } from "@/types/api";

export default function DeviceList({
  buildingId,
  refresh,
  onRefresh,
}: {
  buildingId: number;
  refresh: boolean;
  onRefresh: () => void;
}) {
  const { data, isLoading, refetch, isRefetching } = useDevices(buildingId);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const onSwipeBegin = () => setScrollEnabled(false);
  const onSwipeEnd = () => setScrollEnabled(true);

  if (isLoading) {
    return <StatusIndicator isLoading />;
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
