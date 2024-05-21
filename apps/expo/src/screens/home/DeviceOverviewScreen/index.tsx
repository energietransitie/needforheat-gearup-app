import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import DataSourceList from "./_datasourcelist";
import CircleMenu from "./circleMenu";

import StatusIndicator from "@/components/common/StatusIndicator";
import DataSourceExplanationSheet from "@/components/common/bottomSheets/DataSourceExplanationSheet";
import Box from "@/components/elements/Box";
import Screen from "@/components/elements/Screen";
import { UserContext } from "@/providers/UserProvider";
import { DataSourceListType } from "@/types/api";

export default function DeviceOverviewScreen() {
  const { user, isLoading } = useContext(UserContext);
  const [refreshDeviceList, setRefreshDeviceList] = useState(false);
  const refExplanationSheet = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const showExplanationIfFirstTime = async () => {
      const seenExplanation = await SecureStore.getItemAsync("seenExplanationFirstTime");
      if (!seenExplanation) {
        showExplanationSheet();
        await SecureStore.setItemAsync("seenExplanationFirstTime", "true");
      }
    };

    showExplanationIfFirstTime();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setRefreshDeviceList(true);
    }, [])
  );

  const showExplanationSheet = () => {
    refExplanationSheet.current?.present();
  };

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
      <View style={{ position: "absolute", bottom: 10, right: 10 }}>
        <CircleMenu onClickEvent={showExplanationSheet} />
      </View>
      <View style={{ marginBottom: -50 }}>
        <DataSourceExplanationSheet bottomSheetRef={refExplanationSheet} />
      </View>
    </Screen>
  );
}
