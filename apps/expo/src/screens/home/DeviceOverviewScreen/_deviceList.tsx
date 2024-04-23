import { t } from "i18next";
import { useCallback, useContext, useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

import DeviceListItem from "./_listItem";
import ProgressBar from "./progressBar";

import StatusIndicator from "@/components/common/StatusIndicator";
import useCloudFeeds from "@/hooks/cloud-feed/useCloudFeeds";
import useDevices from "@/hooks/device/useDevices";
import useNotificationPermission from "@/hooks/useNotificationPermission/useNotificationPermission";
import { UserContext } from "@/providers/UserProvider";
import { BuildingDeviceResponse, DataSourcesList } from "@/types/api";
import { processDataSource } from "@/utils/tools";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

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
  const { user } = useContext(UserContext);
  const [allItemsDone, setAllItemsDone] = useState(true);
  const connectedState: number[] = [];
  const { requestNotificationPermission } = useNotificationPermission();

  useEffect(() => {
    if (dataSourcesList) {
      let connectedCount = 0;
      const newData: BuildingDeviceResponse[] = [];

      dataSourcesList.items.forEach(dataSource => {
        const newResponse = processDataSource(dataSource, data, cloudFeedData, dataSourcesList, buildingId);
        newData.push(newResponse);

        //Progressbar
        if (newResponse.connected === 2) {
          connectedState.push(dataSource.id);
          connectedCount++;
        }
      });

      if (connectedCount > 0) {
        requestNotificationPermission();
      }
      setItemData(newData);

      const progressString = `${connectedCount}/${dataSourcesList.items.length}`;
      setProgress(progressString);
    } else {
      setProgress("0/0");
      setItemData(data ?? []);
    }
  }, [dataSourcesList, data, cloudFeedData]);

  useEffect(() => {
    if (refresh) {
      refetch();
      onRefresh();
    }
  }, [refresh, refetch, onRefresh]);

  useEffect(() => {
    let itemDone = true;
    itemData.forEach(source => {
      if (source.connected !== 2) {
        itemDone = false;
      }
    });

    if (itemDone) {
      setAllItemsDone(true);
    } else {
      setAllItemsDone(false);
    }
  }, [itemData]);

  const refreshAfter20Seconds = () => {
    setTimeout(() => {
      refetch();
    }, 20000); // 10000 milliseconds = 10 seconds
  };

  let shouldLoad = true;
  if (!isLoading || Boolean(user)) {
    shouldLoad = false;
  }

  if (shouldLoad) {
    return <StatusIndicator isLoading={shouldLoad} />;
  }

  if (isLoading || isFetching) {
    return <StatusIndicator isLoading />;
  }
  return (
    <View style={{ flex: 1 }}>
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
              allItemsDone,
              refreshAfter20Seconds,
            }}
          />
        )}
        ListEmptyComponent={
          <StatusIndicator isError errorText={t("screens.device_overview.device_list.empty_collection")} />
        }
        refreshControl={<RefreshControl enabled onRefresh={refetch} refreshing={refresh} />}
        refreshing={isRefetching}
        scrollEnabled={scrollEnabled}
      />
    </View>
  );
}
