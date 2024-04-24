import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, makeStyles, useTheme } from "@rneui/themed";
import MapView, { Geojson, Marker, Region, UserLocationChangeEvent } from "react-native-maps";
import { latLngToCell, cellToBoundary, cellToLatLng, CoordPair } from "h3-js";
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
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

type WeatherLocationResultScreenProps = NativeStackScreenProps<HomeStackParamList, "WeatherLocationResultScreen">;

export default function WeatherLocationResultScreen({ navigation, route }: WeatherLocationResultScreenProps) {
  const { location } = route.params
  const { theme } = useTheme();
  const { t } = useTranslation();
  const style = useStyles();
  const refMap = useRef<MapView>(null);

  const onContinue = () => {
    navigation.navigate("HomeScreen");
  };

  const onBack = () => {
    navigation.navigate("HomeSelectScreen");
  };

  //H3
  const cell = latLngToCell(location.latitude, location.longitude, 4)
  const resultLocation = cellToLatLng(cell)
  const cellBoundaries = cellToBoundary(cell, true)
  const cellBoundariesGeoJson: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [cellBoundaries]
        }
      }
    ]
  };
  //End H3

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
        const title = t("screens.home_stack.energy_query.location_permission.alert.title");
        const message = t("screens.home_stack.energy_query.location_permission.alert.message");

        Alert.alert(title, message, [
          {
            text: t("screens.home_stack.energy_query.location_permission.alert.button"),
            onPress: async () => {
              try {
                await requestPreciseLocationPermission();
                resolve(null);
                setHasPermission(await checkPreciseLocationPermission());
              } catch (err: unknown) {
                const errorMsg =
                  err instanceof Error ? err.message : t("screens.home_stack.energy_query.location_permission.errors.request_failed");
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
          refMap.current?.animateToRegion({ longitude: position.coords.longitude, latitude: position.coords.latitude, longitudeDelta: 0.0008, latitudeDelta: 0.0008 }, 20)
        }
      }
    } else {
      await askForPreciseLocationPermission()
      onPressMyLocation()
    }
  }

  const getRegionForCoordinates = (coordinates : CoordPair[], paddingPercent = 0.04) => {
    if (!coordinates || coordinates.length === 0) {
      throw new Error("Coordinates array cannot be empty.");
    }
  
    // Get minimum and maximum latitude and longitude from the coordinates
    const latitudes = coordinates.map(coord => coord[1]);
    const longitudes = coordinates.map(coord => coord[0]);
  
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);
  
    const baseLatitudeDelta = maxLat - minLat;
  const baseLongitudeDelta = maxLon - minLon;

  // Apply padding to the deltas
  const latitudeDelta = baseLatitudeDelta + baseLatitudeDelta * paddingPercent;
  const longitudeDelta = baseLongitudeDelta + baseLongitudeDelta * paddingPercent;
  
    const centerLatitude = (minLat + maxLat) / 2;
    const centerLongitude = (minLon + maxLon) / 2;
  
    return {
      latitude: centerLatitude,
      longitude: centerLongitude,
      latitudeDelta,
      longitudeDelta,
    };
  };

  return (
    <>
      <Box padded style={{ flex: 1 }}>
        <View style={style.mapcontainer}>
          <MapView
            ref={refMap}
            region={getRegionForCoordinates(cellBoundaries)}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsBuildings={true}
            showsScale={true}
            pitchEnabled={false}
            style={style.map}
          >
            <Geojson
              geojson={cellBoundariesGeoJson}
              strokeColor="#3388ff"
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
              fillColor="rgba(51, 136, 255, 0.2)"
            />
            <Marker
              title={t("screens.home_stack.energy_query.weather_location_result_screen.marker")}
              coordinate={location}
              draggable={false} />
          </MapView>
          <View style={style.myLocation}>
            <TouchableOpacity onPress={onPressMyLocation}>
              <Icon name="my-location" color="black" size={40} />
            </TouchableOpacity>
          </View>

        </View>
        <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
          <Button
            containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
            title={t("screens.home_stack.energy_query.weather_location_result_screen.back_button")}
            color="primary"
            onPress={onBack}
            icon={{
              name: "arrow-back-circle-outline",
              type: "ionicon",
              color: theme.colors.white,
            }}
          />
          <Button
            containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
            title={t("screens.home_stack.energy_query.weather_location_result_screen.send_button")}
            color="primary"
            onPress={onContinue}
            icon={{
              name: "cloud-upload-outline",
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
}));
