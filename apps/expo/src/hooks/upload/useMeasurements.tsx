import { QueryKey, useQuery } from "@tanstack/react-query";

import { fetchDeviceMeasurements } from "@/api/device";
import { fetchEnergyQueryMeasurements } from "@/api/energyquery";
import { FetchMeasurementsOptions, Measurement } from "@/types/api";

export default function useMeasurements(name: string, type: string, fetchOptions: FetchMeasurementsOptions) {
  let fetchFn: (deviceName: string, fetchOptions: FetchMeasurementsOptions) => Promise<Measurement[]>;

  if (type === "device") {
    fetchFn = fetchDeviceMeasurements;
  } else if (type === "energy_query") {
    fetchFn = fetchEnergyQueryMeasurements;
  } else {
    throw new Error("Unsupported type: " + type);
  }

  return useQuery({
    queryKey: ["measurementsSchema", name, fetchOptions] as QueryKey,
    queryFn: () => fetchFn(name, fetchOptions),
  });
}
