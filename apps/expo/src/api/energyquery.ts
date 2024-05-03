import { API_URL } from "@env";
import { URLSearchParams } from "react-native-url-polyfill";

import { FETCH_HEADERS } from "@/constants";
import {
  allDataSourcesSchema,
  propertiesSchema,
  deviceReadSchema,
  deviceTypeSchema,
  EnergyQuery,
  FetchMeasurementsOptions,
  measurementsSchema,
} from "@/types/api";
import { handleRequestErrors } from "@/utils/tools";

export async function fetchEnergyQueryType(queryType: string) {
  const response = await fetch(`${API_URL}/energy_query/${queryType}`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return deviceTypeSchema.parse(jsonData);
}

export async function fetchEnergyQueryMeasurements(queryType: string, fetchOptions: FetchMeasurementsOptions) {
  const args: [string, string][] = Object.entries(fetchOptions)
    .filter(([, value]) => !!value)
    .map(([key, value]) => [key, String(value)]);

  const params = new URLSearchParams(args);
  const url = `${API_URL}/energy_query/${queryType}/measurements?${params.toString()}`;

  const response = await fetch(url, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return measurementsSchema.parse(jsonData);
}

export async function fetchEnergyQueryProperties(queryType: string) {
  const response = await fetch(`${API_URL}/energy_query/${queryType}/properties`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return propertiesSchema.parse(jsonData);
}

export async function fetchEnergyQuery(queryType: string) {
  const response = await fetch(`${API_URL}/energy_query/${queryType}`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return deviceReadSchema.parse(jsonData);
}

export async function fetchEnergyQueries() {
  try {
    const response = await fetch(`${API_URL}/energy_query/all`, {
      ...(await FETCH_HEADERS()),
    });

    const data = await handleRequestErrors(response);
    const jsonData = await data.json();

    if (!Array.isArray(jsonData)) {
      console.error("Invalid data format received from server for energy queries");
      return [];
    }

    const parsedEnergyQueries = [];
    for (const energyQueryData of jsonData) {
      try {
        //TODO: rename allDevicesSchema
        const parsedEnergyQuery = allDataSourcesSchema.parse(energyQueryData);
        parsedEnergyQueries.push(parsedEnergyQuery);
      } catch (error) {
        console.error("Error parsing energy query data:", error);
      }
    }

    return parsedEnergyQueries;
  } catch (error) {
    console.warn("Error fetching or parsing energy query:", error);
    return [];
  }
}

export async function postEnergyQuery(energyQuery: EnergyQuery) {
  try {
    const response = await fetch(`${API_URL}/energy_query`, {
      ...(await FETCH_HEADERS()),
      method: "POST",
      body: JSON.stringify(energyQuery),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const jsonData = await response.json();
    return deviceReadSchema.parse(jsonData);
  } catch (error) {
    console.error("Error posting energy query:", error);
    throw error;
  }
}
