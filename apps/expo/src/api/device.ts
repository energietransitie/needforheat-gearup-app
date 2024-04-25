import { API_URL } from "@env";
import { URLSearchParams } from "react-native-url-polyfill";

import { FETCH_HEADERS } from "@/constants";
import {
  buildingSchema,
  createDeviceSchema,
  deviceMeasurementSchema,
  devicePropertiesSchema,
  deviceReadSchema,
  deviceTypeSchema,
} from "@/types/api";
import { handleRequestErrors } from "@/utils/tools";

export async function fetchBuilding(buildingId: number | string) {
  const response = await fetch(`${API_URL}/building/${buildingId}`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();

  return buildingSchema.parse(jsonData);
}

export async function fetchDeviceType(deviceName: string) {
  const response = await fetch(`${API_URL}/device_type/${deviceName}`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return deviceTypeSchema.parse(jsonData);
}

export type FetchDeviceMeasurementsOptions = { start?: string; end?: string; property: number };

export async function fetchDeviceMeasurements(deviceName: string, fetchOptions: FetchDeviceMeasurementsOptions) {
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
  return deviceMeasurementSchema.parse(jsonData);
}

export async function fetchDeviceProperties(deviceName: string) {
  const response = await fetch(`${API_URL}/device/${deviceName}/properties`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return devicePropertiesSchema.parse(jsonData);
}

export async function activateDevice({
  name,
  activationSecret,
  buildingId,
}: {
  name: string;
  activationSecret: string;
  buildingId: number;
}) {
  const response = await fetch(`${API_URL}/device`, {
    ...(await FETCH_HEADERS()),
    method: "POST",
    body: JSON.stringify({
      name,
      activation_secret: activationSecret,
      building_id: buildingId,
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

export async function fetchDevices(buildingId: number) {
  const response = await fetch(`${API_URL}/building/${buildingId}`, {
    ...(await FETCH_HEADERS()),
  });
  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return buildingSchema.parse(jsonData)?.devices ?? [];
}
