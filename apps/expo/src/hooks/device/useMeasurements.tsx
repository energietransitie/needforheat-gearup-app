import { useQuery } from "@tanstack/react-query";

import { FetchDeviceMeasurementsOptions, fetchDeviceMeasurements } from "@/api/device";

export default function useMeasurements(deviceName: string, fetchOptions: FetchDeviceMeasurementsOptions) {
  return useQuery({
    queryKey: ["measurements", deviceName, fetchOptions],
    queryFn: () => fetchDeviceMeasurements(deviceName, fetchOptions),
    enabled: !!fetchOptions.property,
  });
}
