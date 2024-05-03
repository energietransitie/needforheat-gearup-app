import { useQuery } from "@tanstack/react-query";

import { fetchDeviceProperties } from "@/api/device";
import { fetchEnergyQueryProperties } from "@/api/energyquery";
import { Property } from "@/types/api";

export default function useProperties(name: string, type: string) {
  let fetchFn: (name: string) => Promise<Property[]>;

  if (type === "device") {
    fetchFn = fetchDeviceProperties;
  } else if (type === "energy_query") {
    fetchFn = fetchEnergyQueryProperties;
  } else {
    throw new Error("Unsupported type: " + type);
  }

  return useQuery({
    queryKey: ["properties", name],
    queryFn: () => fetchFn(name),
  });
}
