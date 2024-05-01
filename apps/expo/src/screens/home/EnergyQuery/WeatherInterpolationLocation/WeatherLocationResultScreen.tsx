import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, makeStyles, useTheme } from "@rneui/themed";
import MapView, { Geojson, Marker, Region, UserLocationChangeEvent } from "react-native-maps";
import { latLngToCell, cellToBoundary, cellToLatLng, CoordPair } from "h3-js";
import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { Alert, Platform, Text, Touchable, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { UserLocation } from "@/types/energyquery";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Burnt from "burnt";
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
  const [locationState, setLocationState] = useState<UserLocation>(location);
  const onSend = () => {
    Burnt.alert({
      title: t("screens.home_stack.energy_query.weather_location_result_screen.alert.sending.title"),
      message: t("screens.home_stack.energy_query.weather_location_result_screen.alert.sending.message"),
      preset: "spinner",
      duration: 10,
    });

    //TODO: POST
    Burnt.dismissAllAlerts();

    Burnt.alert({
      title: t("screens.home_stack.energy_query.weather_location_result_screen.alert.success.title"),
      message: t("screens.home_stack.energy_query.weather_location_result_screen.alert.success.message"),
      preset: "done",
    });

    setTimeout(() => {
      navigation.navigate("HomeScreen");
    }, 5000);
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

  const handleZoomIn = () => {
    setLocationState((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const handleZoomOut = () => {
    setLocationState((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  const getRegionForCoordinates = (coordinates: CoordPair[], paddingPercent = 0.04) => {
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

  useEffect(() => {
    setLocationState(getRegionForCoordinates(cellBoundaries))
  }, [])

  return (
    <>
      <Box padded style={{ flex: 1 }}>
        <View>
          <Text style={style.subtitle}>{t("screens.home_stack.energy_query.weather_location_result_screen.subtitle")}</Text>
        </View>
        <View style={style.mapcontainer}>
          <MapView
            ref={refMap}
            region={locationState}
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
          </MapView>
          <View style={style.zoomControls}>
            <TouchableOpacity onPress={handleZoomIn} style={style.zoomButton}>
              <Icon name="add" color="white" size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomOut} style={style.zoomButton}>
              <Icon name="remove" color="white" size={30} />
            </TouchableOpacity>
          </View>
        </View>
        <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
          <Button
            containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
            title={t("screens.home_stack.energy_query.weather_location_result_screen.back_button")}
            color="grey2"
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
            onPress={onSend}
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
  zoomControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
  },
  zoomButton: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  myLocation: {
    position: "absolute",
    bottom: 30,
    left: 10,
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  subtitle: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  }
}));
