import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, makeStyles, useTheme } from "@rneui/themed";
import { FeatureCollection } from "geojson";
import { latLngToCell, cellToBoundary, CoordPair } from "h3-js";
import { useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Geojson } from "react-native-maps";

import Box from "@/components/elements/Box";
import useEnergyQuery from "@/hooks/energyquery/useEnergyQuery";
import useTranslation from "@/hooks/translation/useTranslation";
import useMeasurements from "@/hooks/upload/useMeasurements";
import { UserLocation } from "@/types/energyquery";
import { HomeStackParamList } from "@/types/navigation";
import { readableDateTime, toLocalDateTime } from "@/utils/tools";

type WeatherLocationPostedScreenProps = NativeStackScreenProps<HomeStackParamList, "WeatherLocationPostedScreen">;

export default function WeatherLocationPostedScreen({ navigation }: WeatherLocationPostedScreenProps) {
  const { data: query } = useEnergyQuery("weather-interpolation-location");
  const { data: measurements } = useMeasurements("weather-interpolation-location", "energy_query", {});
  const { theme } = useTheme();
  const { t, resolvedLanguage } = useTranslation();
  const style = useStyles();
  const refMap = useRef<MapView>(null);
  const [locationState, setLocationState] = useState<UserLocation>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });

  const [h3Cell, setH3Cell] = useState<FeatureCollection>();

  useEffect(() => {
    //Set location to measurements
    if (measurements && measurements.length >= 2) {
      const latitudeMeasurement = measurements.find(measurement => measurement.property.name === "latitude");
      const longitudeMeasurement = measurements.find(measurement => measurement.property.name === "longitude");

      if (latitudeMeasurement && longitudeMeasurement) {
        const latitude = parseFloat(latitudeMeasurement.value);
        const longitude = parseFloat(longitudeMeasurement.value);

        //H3
        const cell = latLngToCell(latitude, longitude, 4);
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
        setH3Cell(cellBoundariesGeoJson);
        setLocationState(getRegionForCoordinates(cellBoundaries));
      }
    }
  }, [measurements]);

  const onBack = () => {
    navigation.navigate("HomeScreen");
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

  return (
    <>
      <Box padded style={{ flex: 1 }}>
        <View style={{ width: "100%" }}>
          <Text style={style.subtitle}>
            {`${t("screens.home_stack.energy_query.weather_location_posted_screen.subtitle")}\n${readableDateTime(
              toLocalDateTime(query?.activated_at),
              resolvedLanguage === "nl-NL" ? "nl-NL" : "en-US"
            )}`}
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
            {h3Cell ? (
              <Geojson
                geojson={h3Cell}
                strokeColor="#3388ff"
                strokeWidth={3}
                lineCap="round"
                lineJoin="round"
                fillColor="rgba(51, 136, 255, 0.2)"
              />
            ) : null}
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
            title={t("screens.home_stack.energy_query.weather_location_posted_screen.back_button")}
            color="grey2"
            onPress={onBack}
            icon={{
              name: "arrow-back-circle-outline",
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
  subtitle: {
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
  },
}));
