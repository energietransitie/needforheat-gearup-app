import { t, use } from "i18next";
import { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";

import DeviceListItem from "./_listItem";

import StatusIndicator from "@/components/common/StatusIndicator";
import useDevices from "@/hooks/device/useDevices";
import { BuildingDeviceResponse, CloudFeed, DataSourcesListType } from "@/types/api";
import useCloudFeeds from "@/hooks/cloud-feed/useCloudFeeds";

export default function DeviceList({ buildingId, refresh, onRefresh, dataSourcesList }: { buildingId: number, refresh: boolean, dataSourcesList: DataSourcesListType; onRefresh: () => void }) {
  const { data, isLoading, refetch, isRefetching } = useDevices(buildingId);
  const { data: cloudFeedData, isFetching } = useCloudFeeds();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [itemData, setItemData] = useState<BuildingDeviceResponse[]>([]);

  const onSwipeBegin = useCallback(() => setScrollEnabled(false), []);
  const onSwipeEnd = useCallback(() => setScrollEnabled(true), []);

  useEffect(() => {
    if (dataSourcesList && data) {
      let newData: BuildingDeviceResponse[] = [];
      dataSourcesList.items.forEach((dataSource) => {

        let connectStatus = false;
        const oldSource = data?.find(item => item.device_type.name === dataSource.item.name);
        const activated_at = oldSource?.activated_at ?? null;
        const latest_upload = oldSource?.latest_upload ?? null;

        if((dataSource.type.name === "cloud_feed" && cloudFeedData?.find(item => item.cloud_feed.name === dataSource.item.name)?.connected) || !(activated_at === null)){
          connectStatus = true;
        }

        if(dataSource.type.name === "cloud_feed"){
          dataSource.item.info_url = oldSource?.device_type.info_url ? oldSource.device_type.info_url : ""
          dataSource.item.installation_manual_url = oldSource?.device_type.installation_manual_url ? oldSource.device_type.installation_manual_url : ""
        }

        const newResponse: BuildingDeviceResponse = {
          id: dataSource.id,
          name: dataSource.item.name,
          building_id: buildingId,
          device_type: dataSource.item,
          activated_at: activated_at,
          latest_upload: latest_upload,
          typeCategory: dataSource.type.name,
          connected: connectStatus
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

  if (isLoading || isFetching) {
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
