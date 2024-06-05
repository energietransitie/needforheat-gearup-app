import * as SecureStore from "expo-secure-store";

import { fetchEnergyQueryMeasurements, fetchEnergyQueryProperties } from "@/api/energyquery";

let timeZone: string | null = null;

export const fetchTimeZone = async () => {
  timeZone = await SecureStore.getItemAsync("timeZone");

  //If unknown, try to fetch from server
  if (!timeZone) {
    const properties = await fetchEnergyQueryProperties("building-profile");
    const timeZoneProperty = properties.find(property => property.name === "device_timezone__tmz");
    if (timeZoneProperty) {
      const measurements = await fetchEnergyQueryMeasurements("building-profile", { property: timeZoneProperty?.id });
      if (measurements[0]) {
        const timeZoneMeasurement = measurements[0];
        await SecureStore.setItemAsync("timeZone", timeZoneMeasurement.value);
        timeZone = timeZoneMeasurement.value;
      }
    }
  }
};

export const getTimeZone = () => {
  return timeZone;
};
