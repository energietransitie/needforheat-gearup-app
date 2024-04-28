import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { View } from "react-native";

import DataSourceList from "./_datasourcelist";

import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import Screen from "@/components/elements/Screen";
import { UserContext } from "@/providers/UserProvider";
import { DataSourceListType } from "@/types/api";

export default function DeviceOverviewScreen() {
  const { user, isLoading } = useContext(UserContext);
  const [refreshDeviceList, setRefreshDeviceList] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setRefreshDeviceList(true);
    }, [])
  );

  const onDeviceListRefreshed = () => {
    setRefreshDeviceList(false);
  };

  return (
    <Screen>
      <Box style={{ flex: 1, justifyContent: "center", alignItems: "center" }} padded>
        {isLoading ? (
          <StatusIndicator isLoading />
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <DataSourceList
                  refresh={refreshDeviceList}
                  onRefresh={onDeviceListRefreshed}
                  dataSourceList={user?.campaign.data_source_list as DataSourceListType}
                />
              </View>
            </View>
          </>
        )}
      </Box>
    </Screen>
  );
}
