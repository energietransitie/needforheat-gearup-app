import { t } from "i18next";
import { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

import DeviceListItem from "./_listItem";
import ProgressBar from "./progressBar";

import StatusIndicator from "@/components/common/StatusIndicator";
import useCloudFeeds from "@/hooks/cloud-feed/useCloudFeeds";
import useDevices from "@/hooks/device/useDevices";
import { UserContext } from "@/providers/UserProvider";
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
  const { user } = useContext(UserContext);
  const [allItemsDone, setAllItemsDone] = useState(true);
  const connectedState: number[] = [];

  function checkStatus(
    dataSource: {
      id: number;
      type: { name: string };
      item: { id: number; name: string; installation_manual_url: string; info_url: string };
      precedes: { id: number }[];
      uploadschedule: string;
    },
    oldSource: BuildingDeviceResponse
  ) {
    const activated_at = oldSource?.activated_at ?? null;
    if (
      (dataSource.type.name === "cloud_feed" &&
        cloudFeedData?.find(item => item.cloud_feed.name === dataSource.item.name)?.connected) ||
      !(activated_at === null)
    ) {
      return 2;
    }
    return 1;
  }

  useEffect(() => {
    if (dataSourcesList) {
      let connectedCount = 0;
      const newData: BuildingDeviceResponse[] = [];

      dataSourcesList.items.forEach(dataSource => {
        let connectStatus = 1;
        const oldSource = data?.find(item => item.device_type.name === dataSource.item.name);
        const activated_at = oldSource?.activated_at ?? null;
        const latest_upload = oldSource?.latest_upload ?? null;
        const upload_schedule = dataSource.uploadschedule;

        if (oldSource) {
          connectStatus = checkStatus(dataSource, oldSource);
          if (connectStatus === 2) connectedState.push(dataSource.id);
        }

        //Check if all precedes are completed
        const itemsNotPrecedingCurrent = dataSourcesList.items.filter(otherItem => {
          const precedesMatch = otherItem.precedes.some(precede => precede.id === dataSource.id);
          return otherItem.id !== dataSource.id && precedesMatch;
        });

        let allPrecedesDone = true;
        if (itemsNotPrecedingCurrent.length > 0) {
          itemsNotPrecedingCurrent.forEach(otherItem => {
            const otherOldSource = data?.find(item => item.device_type.name === otherItem.item.name);
            if (otherOldSource) {
              if (checkStatus(otherItem, otherOldSource) === 1) {
                allPrecedesDone = false;
              }
            } else {
              allPrecedesDone = false;
            }
          });
        }

        connectStatus = connectStatus === 2 ? connectStatus : allPrecedesDone ? 0 : 1;

        //Progressbar
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
          upload_schedule,
          typeCategory: dataSource.type.name,
          connected: connectStatus,
          notification_threshold_duration: dataSource.notificationThresholdDuration,
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
