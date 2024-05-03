import { QueryKey, useQuery } from "@tanstack/react-query";

import { fetchDeviceMeasurements } from "@/api/device";
import { fetchEnergyQueryMeasurements } from "@/api/energyquery";
import { FetchMeasurementsOptions } from "@/types/api";

export default function useMeasurements(name: string, type: string, fetchOptions: FetchMeasurementsOptions) {
  let fetchFn;
  if (type === "device") {
    fetchFn = fetchDeviceMeasurements;
  } else if (type === "energy_query") {
    fetchFn = fetchEnergyQueryMeasurements;
  } else {
    throw new Error("Unsupported type: " + type);
  }

  return useQuery({
    //Ignore this error, it works but complains for no reason over never
    queryKey: ["measurementsSchema", name, fetchOptions] as QueryKey,
    queryFn: () => fetchFn(name, fetchOptions),
    enabled: !!fetchOptions.property,
  });
}
