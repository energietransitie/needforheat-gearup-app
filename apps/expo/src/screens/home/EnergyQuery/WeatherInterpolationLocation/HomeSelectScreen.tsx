import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, makeStyles, useTheme } from "@rneui/themed";
import MapView, { Marker, Region, UserLocationChangeEvent } from "react-native-maps";

import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { Alert, Platform, Touchable, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { UserLocation } from "@/types/energyquery";
import { TouchableOpacity } from "react-native-gesture-handler";
import { openSettings } from "expo-linking";
import usePreciseLocationPermission from "@/hooks/location/usePreciseLocationPermission";
import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation";
import HomeSelectExplanationBottomSheet from "./_HomeSelectExplanationBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type HomeSelectScreenProps = NativeStackScreenProps<HomeStackParamList, "HomeSelectScreen">;

export default function HomeSelectScreen({ navigation, route }: HomeSelectScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const style = useStyles();
  const refMap = useRef<MapView>(null);
  const refExplanationSheet = useRef<BottomSheetModal>(null);
  const [userLocationReceivedOnce, setUserLocationReceiveOnce] = useState(false);
  const [location, setLocation] = useState<UserLocation>({
    latitude: 52.501076707906,
    longitude: 6.079587294142308,
    latitudeDelta: 0.0008,
    longitudeDelta: 0.0008
  });

  const onAddDevice = () => {
    navigation.navigate("HomeScreen");
  };

  //Location permission
  const [hasPermission, setHasPermission] = useState(false);
  const { requestPreciseLocationPermission, checkPreciseLocationPermission } = usePreciseLocationPermission();

  const onRequestPreciseLocationError = (err: string) => {
    console.log("onRequestPermissionError", err);
    Alert.alert("Error", err, [
      {
        text: t("screens.home_stack.search_device.open_settings"),
        onPress: () => {
          // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-empty-function
          openSettings().catch(e => { });
        },
      },
    ]);
  };

  const askForPreciseLocationPermission = async (): Promise<null> => {
    const permission = await checkPreciseLocationPermission();
    setHasPermission(permission);

    return new Promise((resolve, reject) => {
      if (!permission) {
        const title = t("screens.home_stack.qr_scanner.camera.alert.title");
        const message = t("screens.home_stack.qr_scanner.camera.alert.message");

        Alert.alert(title, message, [
          {
            text: t("screens.home_stack.qr_scanner.camera.alert.button"),
            onPress: async () => {
              try {
                console.log("?")
                await requestPreciseLocationPermission();
                resolve(null);
                setHasPermission(await checkPreciseLocationPermission());
              } catch (err: unknown) {
                console.log("o")
                const errorMsg =
                  err instanceof Error ? err.message : t("screens.home_stack.qr_scanner.errors.camera_request_failed");
                onRequestPreciseLocationError(errorMsg);
                reject(err);
              }
            },
          },
        ]);
      }
    });
  };

  //Location permission END

  const onPressMyLocation = async () => {
    if (await checkPreciseLocationPermission()) {
      Geolocation.getCurrentPosition((pos) => succes(pos))
      const succes = (position: GeolocationResponse) => {
        if (position) {
          setLocation({ longitude: position.coords.longitude, latitude: position.coords.latitude, longitudeDelta: location.longitude, latitudeDelta: location.latitudeDelta });
          refMap.current?.animateToRegion({ longitude: position.coords.longitude, latitude: position.coords.latitude, longitudeDelta: 0.0008, latitudeDelta: 0.0008 }, 20)
        }
      }
    } else {
      await askForPreciseLocationPermission()
      onPressMyLocation()
    }
  }

  const handleRegionChangeCompleted = (newRegion: Region) => {
    setLocation(newRegion)
  }

  useEffect(() => {
    refExplanationSheet.current?.present()
  }, [])
  return (
    <>
      <Box padded style={{ flex: 1 }}>
        <View style={style.mapcontainer}>
          <MapView
            ref={refMap}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsBuildings={true}
            showsScale={true}
            pitchEnabled={false}
            style={style.map}
            onRegionChangeComplete={handleRegionChangeCompleted}
          >
          </MapView>
          <View pointerEvents="none">
            <Icon name="location-pin" color="red" size={40} style={{ marginBottom: 30 }} />
          </View>
          <View style={style.myLocation}>
            <TouchableOpacity onPress={onPressMyLocation}>
              <Icon name="my-location" color="black" size={40} />
            </TouchableOpacity>
          </View>
          <View style={style.help}>
            <TouchableOpacity onPress={() => { refExplanationSheet.current?.present() }}>
              <Icon name="help-outline" color="black" size={40} />
            </TouchableOpacity>
          </View>

        </View>
        <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
          <Button
            containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
            title={t("common.connect")}
            color="primary"
            onPress={onAddDevice}
            icon={{
              name: "wifi-outline",
              type: "ionicon",
              color: theme.colors.white,
            }}
          />
        </Box>
      </Box>
      <View style={{marginBottom: -50}}>
      <HomeSelectExplanationBottomSheet
        bottomSheetRef={refExplanationSheet}
      />
      </View>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  mapcontainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  myLocation: {
    position: "absolute",
    bottom: 30,
    left: 10
  },
  help: {
    position: "absolute",
    bottom: 70,
    left: 10
  }
}));
