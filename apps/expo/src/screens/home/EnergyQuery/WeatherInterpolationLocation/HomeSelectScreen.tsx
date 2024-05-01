import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, makeStyles, useTheme } from "@rneui/themed";
import { openSettings } from "expo-linking";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Region } from "react-native-maps";

import Box from "@/components/elements/Box";
import usePreciseLocationPermission from "@/hooks/location/usePreciseLocationPermission";
import useTranslation from "@/hooks/translation/useTranslation";
import { UserLocation } from "@/types/energyquery";
import { HomeStackParamList } from "@/types/navigation";

type HomeSelectScreenProps = NativeStackScreenProps<HomeStackParamList, "HomeSelectScreen">;

export default function HomeSelectScreen({ navigation, route }: HomeSelectScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const style = useStyles();
  const refMap = useRef<MapView>(null);
  const [hasLocationPermission, setLocationPermission] = useState<boolean>(false);
  const [location, setLocation] = useState<UserLocation>({
    latitude: 52.501076707906,
    longitude: 6.079587294142308,
    latitudeDelta: 4,
    longitudeDelta: 4,
  });

  useEffect(() => {
    const checkPermission = async () => {
      const permission = await checkPreciseLocationPermission();
      setLocationPermission(permission);
    };
    checkPermission();
  }, []);

  const onContinue = () => {
    navigation.navigate("WeatherLocationResultScreen", { location });
  };

  //Location permission
  const { requestPreciseLocationPermission, checkPreciseLocationPermission } = usePreciseLocationPermission();

  const onRequestPreciseLocationError = (err: string) => {
    console.log("onRequestPermissionError", err);
    Alert.alert("Error", err, [
      {
        text: t("screens.home_stack.search_device.open_settings"),
        onPress: () => {
          // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-empty-function
          openSettings().catch(e => {});
        },
      },
    ]);
  };

  const askForPreciseLocationPermission = async (): Promise<null> => {
    let permission = await checkPreciseLocationPermission();
    setLocationPermission(permission);
    return new Promise((resolve, reject) => {
      if (!permission) {
        const title = t("screens.home_stack.energy_query.location_permission.alert.title");
        const message = t("screens.home_stack.energy_query.location_permission.alert.message");

        Alert.alert(title, message, [
          {
            text: t("screens.home_stack.energy_query.location_permission.alert.button"),
            onPress: async () => {
              try {
                await requestPreciseLocationPermission();
                permission = await checkPreciseLocationPermission();
                setLocationPermission(permission);
                resolve(null);
              } catch (err: unknown) {
                const errorMsg =
                  err instanceof Error
                    ? err.message
                    : t("screens.home_stack.energy_query.location_permission.errors.request_failed");
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
      Geolocation.getCurrentPosition(pos => succes(pos));
      const succes = (position: GeolocationResponse) => {
        if (position) {
          setLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            longitudeDelta: location.longitude,
            latitudeDelta: location.latitudeDelta,
          });
          refMap.current?.animateToRegion(
            {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              longitudeDelta: 0.0008,
              latitudeDelta: 0.0008,
            },
            20
          );
        }
      };
    } else {
      await askForPreciseLocationPermission();
      onPressMyLocation();
    }
  };

  const handleRegionChangeCompleted = (newRegion: Region) => {
    setLocation(newRegion);
  };

  const handleZoomIn = useCallback(() => {
    setLocation(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setLocation(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  }, []);

  return (
    <>
      <Box padded style={{ flex: 1 }}>
        <View>
          <Text style={style.subtitle}>{t("screens.home_stack.energy_query.homeselect_screen.subtitle")}</Text>
        </View>
        <View style={style.mapcontainer}>
          <MapView
            ref={refMap}
            region={location}
            showsUserLocation
            showsMyLocationButton
            showsBuildings
            showsScale
            pitchEnabled={false}
            style={style.map}
            onRegionChangeComplete={handleRegionChangeCompleted}
            zoomControlEnabled
          />
          {Platform.OS === "ios" ? (
            <View style={style.zoomControlsiOS}>
              <TouchableOpacity onPress={handleZoomIn} style={style.zoomButton}>
                <Icon name="add" color="white" size={30} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleZoomOut} style={style.zoomButton}>
                <Icon name="remove" color="white" size={30} />
              </TouchableOpacity>
            </View>
          ) : null}
          <View pointerEvents="none">
            <Icon name="location-pin" color="red" size={40} style={{ marginBottom: 30 }} />
          </View>
          {Platform.OS === "ios" || !hasLocationPermission ? (
            <View style={Platform.OS === "ios" ? style.myLocationiOS : style.myLocationAndroid}>
              <TouchableOpacity onPress={onPressMyLocation}>
                <Icon name="my-location" color="white" size={Platform.OS === "ios" ? 40 : 30} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
          <Button
            containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
            title={t("screens.home_stack.energy_query.homeselect_screen.button")}
            color="primary"
            onPress={onContinue}
            icon={{
              name: "location-outline",
              type: "ionicon",
              color: theme.colors.white,
            }}
          />
        </Box>
      </Box>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  mapcontainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  zoomControlsiOS: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "column",
  },
  zoomButton: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  myLocationiOS: {
    position: "absolute",
    bottom: 30,
    left: 10,
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  myLocationAndroid: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  subtitle: {
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
}));
