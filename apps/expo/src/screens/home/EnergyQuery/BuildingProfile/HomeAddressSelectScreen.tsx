import { GOOGLE_MAPS_API_KEY } from "@env";
import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, makeStyles, useTheme } from "@rneui/themed";
import { openSettings } from "expo-linking";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, View } from "react-native";
import Geocoder from "react-native-geocoding";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Region } from "react-native-maps";

import Box from "@/components/elements/Box";
import { NL_ADDRESS_REGEX } from "@/constants";
import usePreciseLocationPermission from "@/hooks/location/usePreciseLocationPermission";
import useTranslation from "@/hooks/translation/useTranslation";
import { UserLocation } from "@/types/energyquery";
import { HomeStackParamList } from "@/types/navigation";

type HomeAddressSelectScreenProps = NativeStackScreenProps<HomeStackParamList, "HomeAddressSelectScreen">;

export default function HomeAddressSelectScreen({ navigation, route }: HomeAddressSelectScreenProps) {
  const { dataSource } = route.params;
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
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  Geocoder.init(GOOGLE_MAPS_API_KEY);

  const setAdressChange = async (address: string) => {
    setSelectedAddress(address);
    return selectedAddress;
  };

  const updateAddress = async () => {
    try {
      if (selectedAddress !== "") {
        const response = await Geocoder.from(selectedAddress);
        if (response.results.length === 0) {
          console.log("Address not found");
          return;
        }

        // Address found, update the marker's location
        const { lat, lng } = response.results[0].geometry.location;
        getAddressFromCoordinates(lat, lng);
        setLocation({
          latitude: lat,
          longitude: lng,
          latitudeDelta: location.latitudeDelta,
          longitudeDelta: location.longitudeDelta,
        });

        refMap.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: location.latitudeDelta,
            longitudeDelta: location.longitudeDelta,
          },
          500
        );
      } else {
        getAddressFromCoordinates(location.latitude, location.longitude);
      }
    } catch (error) {
      console.error("Error fetching location from address: ", error);
    }
    return selectedAddress;
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;
      setSelectedAddress(address);
    } catch (error) {
      console.error("Error fetching address: ", error);
      setSelectedAddress(""); // Als er een fout optreedt, leeg het adres
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      const permission = await checkPreciseLocationPermission();
      setLocationPermission(permission);
      if (!permission) askForPreciseLocationPermission(false);
      else onPressMyLocation();
    };
    checkPermission();
  }, []);

  const onContinue = () => {
    const match = selectedAddress.match(NL_ADDRESS_REGEX);
    console.log("Matched address:" + match);
    if (match) {
      const houseNumber = match[2];
      const postalCode = match[5];

      if (houseNumber && postalCode) {
        navigation.navigate("BuildingProfileProgressScreen", { location: selectedAddress, dataSource });
      } else {
        Alert.alert(
          t("screens.home_stack.energy_query.homeaddress_screen.error.title"),
          t("screens.home_stack.energy_query.homeaddress_screen.error.message") as string,
          [
            {
              text: t("common.retry") as string,
            },
          ]
        );
      }
    } else {
      console.error("Error: Address does not match the expected format.");
      Alert.alert(
        t("screens.home_stack.energy_query.homeaddress_screen.error.title"),
        t("screens.home_stack.energy_query.homeaddress_screen.error.message") as string,
        [
          {
            text: t("common.retry") as string,
          },
        ]
      );
    }
  };

  //Location permission
  const { requestPreciseLocationPermission, checkPreciseLocationPermission } = usePreciseLocationPermission();

  const onRequestPreciseLocationError = (err: string) => {
    console.log("onRequestPermissionError", err);
    Alert.alert("Error", err, [
      {
        text: t("screens.home_stack.search_device.open_settings") as string,
        onPress: () => {
          // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-empty-function
          openSettings().catch(e => {});
        },
      },
    ]);
  };

  const askForPreciseLocationPermission = async (shouldPester = true): Promise<null> => {
    let permission = await checkPreciseLocationPermission();
    setLocationPermission(permission);

    return new Promise((resolve, reject) => {
      if (!permission) {
        const title = t("screens.home_stack.energy_query.location_permission.alert.title");
        const message = t("screens.home_stack.energy_query.location_permission.alert.message");

        const requestPermission = async () => {
          try {
            await requestPreciseLocationPermission();
            permission = await checkPreciseLocationPermission();
            setLocationPermission(permission);
            if (permission) {
              onPressMyLocation();
            }
            resolve(null);
          } catch (err: unknown) {
            if (shouldPester) {
              const errorMsg =
                err instanceof Error
                  ? err.message
                  : t("screens.home_stack.energy_query.location_permission.errors.request_failed");
              onRequestPreciseLocationError(errorMsg);
            }
            reject(err);
          }
        };

        if (shouldPester) {
          Alert.alert(title, message, [
            {
              text: t("screens.home_stack.energy_query.location_permission.alert.button") as string,
              onPress: requestPermission,
            },
          ]);
        } else {
          requestPermission();
        }
      } else {
        resolve(null);
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
            longitudeDelta: 0.0008,
            latitudeDelta: 0.0008,
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
          getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
        }
      };
    } else {
      await askForPreciseLocationPermission();
      onPressMyLocation();
    }
  };

  const handleRegionChangeCompleted = (newRegion: Region) => {
    //Fixes moving the map on its own
    const threshold = 0.00001;

    const latDifference = Math.abs(newRegion.latitude - location.latitude);
    const lonDifference = Math.abs(newRegion.longitude - location.longitude);

    if (latDifference > threshold || lonDifference > threshold) {
      setLocation(newRegion);
      getAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
    }
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
        <View style={{ width: "100%" }}>
          <Text style={style.subtitle}>{t("screens.home_stack.energy_query.homeaddress_screen.subtitle")}</Text>
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
        <Box style={{ flexDirection: "column", width: "100%" }}>
          <Text style={style.label}>Address</Text>
          <View style={style.inputContainer}>
            <TextInput
              style={style.input}
              value={selectedAddress}
              onChangeText={setAdressChange}
              onSubmitEditing={updateAddress}
            />
          </View>
          <Button
            containerStyle={{ width: "100%" }}
            title={t("screens.home_stack.energy_query.homeaddress_screen.button") as string}
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
  addressContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: 0,
    marginTop: theme.spacing.sm, // Add marginTop for spacing
    alignSelf: "center",
    bottom: -270,
  },
  addressText: {
    fontSize: 14,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    width: "100%",
  },
  input: {
    fontSize: 14,
  },
}));
