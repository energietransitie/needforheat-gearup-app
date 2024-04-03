import { t, use } from "i18next";
import { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";

import DeviceListItem from "./_listItem";

import StatusIndicator from "@/components/common/StatusIndicator";
import useDevices from "@/hooks/device/useDevices";
import { BuildingDeviceResponse, DataSourcesListType } from "@/types/api";

export default function DeviceList({ buildingId, refresh, onRefresh, dataSourcesList }: { buildingId: number, refresh: boolean, dataSourcesList: DataSourcesListType; onRefresh: () => void }) {
  const { data, isLoading, refetch, isRefetching } = useDevices(buildingId);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [itemData, setItemData] = useState<BuildingDeviceResponse[]>([]);

  const onSwipeBegin = useCallback(() => setScrollEnabled(false), []);
  const onSwipeEnd = useCallback(() => setScrollEnabled(true), []);

  useEffect(() => {
    if (dataSourcesList && data) {
      let newData: BuildingDeviceResponse[] = [];
      dataSourcesList.items.forEach((dataSource) => {
        const oldSource = data?.find(item => item.device_type.name === dataSource.item.name);
        
        const activated_at = oldSource?.activated_at ?? null;
        const latest_upload = oldSource?.latest_upload ?? null;
        const newResponse: BuildingDeviceResponse = {
          id: dataSource.id,
          name: dataSource.item.name,
          building_id: buildingId,
          device_type: dataSource.item,
          activated_at: activated_at,
          latest_upload: latest_upload
        };

        newData.push(newResponse);
      });
      setItemData(newData);
    } else {
      setItemData(data ?? []); // Set to original data if no user data sources list
    }
  }, [dataSourcesList, data]);

  useEffect(() => {
    if (refresh) {
      refetch();
      onRefresh();
    }
  }, [refresh, refetch, onRefresh]);

  if (isLoading) {
    return <StatusIndicator isLoading />;
  }

  return (
    <FlatList<BuildingDeviceResponse>
      data={itemData}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ width: "100%" }}
      keyExtractor={item => item.name}
      renderItem={({ item }) => <DeviceListItem {...{
        item,
        onSwipeBegin,
        onSwipeEnd
      }} />}
      ListEmptyComponent={
        <StatusIndicator isError errorText={t("screens.device_overview.device_list.empty_collection")} />
      }
      onRefresh={refetch}
      refreshing={isRefetching}
      scrollEnabled={scrollEnabled}
    />
  );
}
