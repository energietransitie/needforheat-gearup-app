import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, makeStyles, useTheme } from "@rneui/themed";
import * as Burnt from "burnt";
import { FeatureCollection } from "geojson";
import { latLngToCell, cellToBoundary, cellToLatLng, CoordPair } from "h3-js";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Geojson } from "react-native-maps";

import { postEnergyQuery } from "@/api/energyquery";
import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { EnergyQuery } from "@/types/api";
import { UserLocation } from "@/types/energyquery";
import { HomeStackParamList } from "@/types/navigation";

type WeatherLocationResultScreenProps = NativeStackScreenProps<HomeStackParamList, "WeatherLocationResultScreen">;

export default function WeatherLocationResultScreen({ navigation, route }: WeatherLocationResultScreenProps) {
  const { location, dataSource } = route.params;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const style = useStyles();
  const refMap = useRef<MapView>(null);
  const [locationState, setLocationState] = useState<UserLocation>(location);
  const [disableButtons, setDisableButtons] = useState<boolean>(false);

  //H3
  const cell = latLngToCell(location.latitude, location.longitude, 4);
  const resultLocation = cellToLatLng(cell);
  const cellBoundaries = cellToBoundary(cell, true);
  const cellBoundariesGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [cellBoundaries],
        },
      },
    ],
  };
  //End H3

  //Region Buttons
  const onSend = async () => {
    setDisableButtons(true);
    Burnt.alert({
      title: t("screens.home_stack.energy_query.weather_location_result_screen.alert.sending.title"),
      message: t("screens.home_stack.energy_query.weather_location_result_screen.alert.sending.message") as string,
      preset: "spinner",
      duration: 10,
    });

    if (!dataSource) {
      console.warn("No datasource available for posting energy query WIL");
      return;
    }

    const currentLocaleTimeInUnix = Math.floor(Date.now() / 1000);

    const energyQuery: EnergyQuery = {
      energy_query_type: {
        id: dataSource.item.ID,
      },
      uploads: [
        {
          measurements: [
            {
              value: resultLocation[0].toString(),
              property: {
                name: "latitude",
              },
              time: currentLocaleTimeInUnix,
            },
            {
              value: resultLocation[1].toString(),
              property: {
                name: "longitude",
              },
              time: currentLocaleTimeInUnix,
            },
          ],
          instance_id: dataSource.item.ID,
          instance_type: "energy_query_type",
          device_time: currentLocaleTimeInUnix,
          size: 2,
        },
      ],
    };

    try {
      await postEnergyQuery(energyQuery);
      Burnt.dismissAllAlerts();

      Burnt.alert({
        title: t("screens.home_stack.energy_query.weather_location_result_screen.alert.success.title"),
        message: t("screens.home_stack.energy_query.weather_location_result_screen.alert.success.message") as string,
        preset: "done",
      });

      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("An error occurred posting Weather Energy Query:", error);
      Burnt.dismissAllAlerts();
      Alert.alert(
        t("screens.home_stack.energy_query.weather_location_result_screen.alert.fail.title"),
        t("screens.home_stack.energy_query.weather_location_result_screen.alert.fail.message") +
          ` ${error ? `\n\n${error}` : ""}`,
        [
          {
            text: t("common.back_to_home") as string,
            onPress: () => navigation.navigate("HomeScreen"),
            style: "cancel",
          },
        ]
      );
    }
  };

  const onBack = () => {
    navigation.navigate("HomeSelectScreen", { dataSource });
  };

  //Map zoom controls
  const handleZoomIn = () => {
    setLocationState(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const handleZoomOut = () => {
    setLocationState(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  //End region

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
    setLocationState(getRegionForCoordinates(cellBoundaries));
  }, []);

  return (
    <>
      <Box padded style={{ flex: 1 }}>
        <View style={{ width: "100%" }}>
          <Text style={style.subtitle}>
            {t("screens.home_stack.energy_query.weather_location_result_screen.subtitle")}
          </Text>
        </View>
        <View style={style.mapcontainer}>
          <MapView
            ref={refMap}
            region={locationState}
            showsBuildings
            showsScale
            pitchEnabled={false}
            style={style.map}
            zoomControlEnabled
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
          {Platform.OS === "ios" ? (
            <View style={style.zoomControls}>
              <TouchableOpacity onPress={handleZoomIn} style={style.zoomButton}>
                <Icon name="add" color="white" size={30} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleZoomOut} style={style.zoomButton}>
                <Icon name="remove" color="white" size={30} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
          <Button
            containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
            disabled={disableButtons}
            title={t("screens.home_stack.energy_query.weather_location_result_screen.back_button") as string}
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
            disabled={disableButtons}
            title={t("screens.home_stack.energy_query.weather_location_result_screen.send_button") as string}
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
  zoomControls: {
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
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
}));
