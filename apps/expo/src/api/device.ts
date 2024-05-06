import { API_URL } from "@env";
import { URLSearchParams } from "react-native-url-polyfill";

import { FETCH_HEADERS } from "@/constants";
import {
  allDataSourcesSchema,
  createDeviceSchema,
  propertiesSchema,
  deviceReadSchema,
  deviceTypeSchema,
  FetchMeasurementsOptions,
  measurementsSchema,
} from "@/types/api";
import { handleRequestErrors } from "@/utils/tools";

export async function fetchDeviceType(deviceName: string) {
  const response = await fetch(`${API_URL}/device_type/${deviceName}`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return deviceTypeSchema.parse(jsonData);
}

export async function fetchDeviceMeasurements(deviceName: string, fetchOptions: FetchMeasurementsOptions) {
  const args: [string, string][] = Object.entries(fetchOptions)
    .filter(([, value]) => !!value)
    .map(([key, value]) => [key, String(value)]);

  const params = new URLSearchParams(args);
  const url = `${API_URL}/device/${deviceName}/measurements?${params.toString()}`;

  const response = await fetch(url, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return measurementsSchema.parse(jsonData);
}

export async function fetchDeviceProperties(deviceName: string) {
  const response = await fetch(`${API_URL}/device/${deviceName}/properties`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return propertiesSchema.parse(jsonData);
}

export async function activateDevice({ name, activationSecret }: { name: string; activationSecret: string }) {
  const response = await fetch(`${API_URL}/device`, {
    ...(await FETCH_HEADERS()),
    method: "POST",
    body: JSON.stringify({
      name,
      activation_secret: activationSecret,
    }),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();

  return createDeviceSchema.parse(jsonData);
}

export async function fetchDevice(deviceName: string) {
  const response = await fetch(`${API_URL}/device/${deviceName}`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return deviceReadSchema.parse(jsonData);
}

export async function fetchDevices() {
  try {
    const response = await fetch(`${API_URL}/device/all`, {
      ...(await FETCH_HEADERS()),
    });
    const data = await handleRequestErrors(response);
    const jsonData = await data.json();

    if (!Array.isArray(jsonData)) {
      console.warn("Invalid or null data format received from server");
      return [];
    }

    const parsedDevices = [];
    for (const deviceData of jsonData) {
      try {
        const { device_type } = deviceData;
        if (device_type && device_type.name) {
          // Add a type property based on device_type.name
          deviceData.type = device_type.name;
        }
        const parsedDevice = allDataSourcesSchema.parse(deviceData);
        parsedDevices.push(parsedDevice);
      } catch (error) {
        console.error("Error parsing device data:", error);
      }
    }

    return parsedDevices;
  } catch (error) {
    console.error("Error fetching or parsing devices:", error);
    return [];
  }
}
