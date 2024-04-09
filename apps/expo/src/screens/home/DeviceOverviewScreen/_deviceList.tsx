import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import DeviceListItem from "./_listItem";
import ProgressBar from "./progressBar";

import StatusIndicator from "@/components/common/StatusIndicator";
import useCloudFeeds from "@/hooks/cloud-feed/useCloudFeeds";
import useDevices from "@/hooks/device/useDevices";
import { BuildingDeviceResponse, DataSourcesList } from "@/types/api";

export default function DeviceList({
  buildingId,
  refresh,
  onRefresh,
  dataSourcesList,
}: {
  buildingId: number;
  refresh: boolean;
  dataSourcesList: DataSourcesList;
  onRefresh: () => void;
}) {
  const { data, isLoading, refetch, isRefetching } = useDevices(buildingId);
  const { data: cloudFeedData, isFetching } = useCloudFeeds();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [itemData, setItemData] = useState<BuildingDeviceResponse[]>([]);
  const [progress, setProgress] = useState("0/0");
  const onSwipeBegin = useCallback(() => setScrollEnabled(false), []);
  const onSwipeEnd = useCallback(() => setScrollEnabled(true), []);

  const connectedState: number[] = [];

  useEffect(() => {
    if (dataSourcesList) {
      let connectedCount = 0;

      const newData: BuildingDeviceResponse[] = [];
      dataSourcesList.items.forEach(dataSource => {
        let connectStatus = 1;
        const oldSource = data?.find(item => item.device_type.name === dataSource.item.name);
        const activated_at = oldSource?.activated_at ?? null;
        const latest_upload = oldSource?.latest_upload ?? null;

        if (
          (dataSource.type.name === "cloud_feed" &&
            cloudFeedData?.find(item => item.cloud_feed.name === dataSource.item.name)?.connected) ||
          !(activated_at === null)
        ) {
          connectStatus = 2;
          connectedState.push(dataSource.id);
        }

        const allPrecedesDone = dataSource.precedes.every((precedeItem: any) =>
          connectedState.includes(precedeItem.id)
        );
        connectStatus = connectStatus === 2 ? connectStatus : allPrecedesDone ? 1 : 0;

        if (dataSource.type.name === "cloud_feed") {
          dataSource.item.info_url = oldSource?.device_type.info_url ? oldSource.device_type.info_url : "";
          dataSource.item.installation_manual_url = oldSource?.device_type.installation_manual_url
            ? oldSource.device_type.installation_manual_url
            : "";
        }

        if (connectStatus === 2) {
          connectedCount++;
        }

        const newResponse: BuildingDeviceResponse = {
          id: dataSource.id,
          name: oldSource?.name ? oldSource.name : dataSource.item.name,
          building_id: buildingId,
          device_type: dataSource.item,
          activated_at,
          latest_upload,
          typeCategory: dataSource.type.name,
          connected: connectStatus,
        };
        newData.push(newResponse);
      });

      setItemData(newData);

      const progressString = `${connectedCount}/${dataSourcesList.items.length}`;
      setProgress(progressString);
    } else {
      setProgress("0/0");
      setItemData(data ?? []);
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
    <View>
      <ProgressBar progress={progress} />
      <FlatList<BuildingDeviceResponse>
        data={itemData || data}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ width: "100%" }}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <DeviceListItem
            {...{
              item,
              onSwipeBegin,
              onSwipeEnd,
            }}
          />
        )}
        ListEmptyComponent={
          <StatusIndicator isError errorText={t("screens.device_overview.device_list.empty_collection")} />
        }
        onRefresh={refetch}
        refreshing={isRefetching}
        scrollEnabled={scrollEnabled}
      />
    </View>
  );
}
