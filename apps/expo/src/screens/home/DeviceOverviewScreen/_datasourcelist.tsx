import { t } from "i18next";
import { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

import DeviceListItem from "./_listItem";
import ProgressBar from "./progressBar";

import StatusIndicator from "@/components/common/StatusIndicator";
import useCloudFeeds from "@/hooks/cloud-feed/useCloudFeeds";
import useDevices from "@/hooks/device/useDevices";
import useEnergyQueries from "@/hooks/energyquery/useEnergyQueries";
import { UserContext } from "@/providers/UserProvider";
import { AllDataSourcesResponse, DataSourceType, DataSourceListType } from "@/types/api";

export default function DataSourceList({
  refresh,
  onRefresh,
  dataSourceList,
}: {
  refresh: boolean;
  dataSourceList: DataSourceListType;
  onRefresh: () => void;
}) {
  const { data, isLoading, refetch, isRefetching } = useDevices();
  const { data: cloudFeedData, isFetching } = useCloudFeeds();
  const {
    data: energyQueryData,
    isLoading: isLoadingEnergyQueries,
    refetch: refetchEnergyQueries,
    isRefetching: isRefetchingEnergyQueries,
  } = useEnergyQueries();
  const { user } = useContext(UserContext);

  const [itemData, setItemData] = useState<AllDataSourcesResponse[]>([]);
  const [allItemsDone, setAllItemsDone] = useState(true);
  const [progress, setProgress] = useState("0/0");
  const connectedState: number[] = [];

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const onSwipeBegin = useCallback(() => setScrollEnabled(false), []);
  const onSwipeEnd = useCallback(() => setScrollEnabled(true), []);

  function checkStatus(dataSource: DataSourceType, oldSource: AllDataSourcesResponse) {
    const activated_at = oldSource?.activated_at ?? null;
    if (
      (dataSource.category === "cloud_feed_type" &&
        cloudFeedData?.find(item => item.cloud_feed_type.name === dataSource.item.Name)?.connected) ||
      !(activated_at === null)
    ) {
      return 2;
    }
    return 1;
  }

  useEffect(() => {
    if (dataSourceList) {
      let connectedCount = 0;
      const newData: AllDataSourcesResponse[] = [];

      dataSourceList.items.forEach(dataSource => {
        let connectStatus = 1;

        let oldSource: AllDataSourcesResponse | undefined;
        if (dataSource.category === "energy_query_type") {
          oldSource = energyQueryData?.find(item => item.data_source?.item.Name === dataSource.item.Name);
        } else {
          oldSource = data?.find(item => item.data_source?.item.Name === dataSource.item.Name);
        }

        const activated_at = oldSource?.activated_at ?? null;
        const latest_upload = oldSource?.latest_upload ?? null;

        if (oldSource) {
          connectStatus = checkStatus(dataSource, oldSource);
          if (connectStatus === 2) connectedState.push(dataSource.id);
        }

        //Check if all precedes are completed
        const itemsNotPrecedingCurrent = dataSourceList.items.filter(otherItem => {
          if (!otherItem.precedes) return false;
          const precedesMatch = otherItem.precedes.some(precede => precede.id === dataSource.id);
          return otherItem.id !== dataSource.id && precedesMatch;
        });

        let allPrecedesDone = true;
        if (itemsNotPrecedingCurrent.length > 0) {
          itemsNotPrecedingCurrent.forEach(otherItem => {
            const otherOldSource = data?.find(item => item.data_source?.item.Name === otherItem.item.Name);
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

        const newResponse: AllDataSourcesResponse = {
          id: dataSource.id,
          name: oldSource?.name ? oldSource.name : dataSource.item.Name,
          activated_at,
          latest_upload,
          data_source: dataSource,
          connected: connectStatus,
        };
        newData.push(newResponse);
      });

      newData.sort((a, b) => {
        const orderA = a.data_source?.order;
        const orderB = b.data_source?.order;

        // If either order is null, retain the original order
        if (!orderA || !orderB) {
          return 0;
        } else {
          return orderA - orderB;
        }
      });
      setItemData(newData);

      const progressString = `${connectedCount}/${dataSourceList.items.length}`;
      setProgress(progressString);
    } else {
      setProgress("0/0");
      setItemData(data ?? []);
    }
  }, [dataSourceList, data, cloudFeedData, energyQueryData]);

  useEffect(() => {
    if (refresh) {
      refetch();
      refetchEnergyQueries();
      onRefresh();
    }
  }, [refresh, refetch, onRefresh, refetchEnergyQueries]);

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
  if ((!isLoading && !isLoadingEnergyQueries) || Boolean(user)) {
    shouldLoad = false;
  }

  if (shouldLoad) {
    return <StatusIndicator isLoading={shouldLoad} />;
  }

  if (isLoading || isFetching || isLoadingEnergyQueries || isRefetchingEnergyQueries) {
    return <StatusIndicator isLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar progress={progress} />
      <FlatList<AllDataSourcesResponse>
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
