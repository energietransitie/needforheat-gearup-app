import { useQuery } from "@tanstack/react-query";

import { fetchDeviceProperties } from "@/api/device";

export default function useProperties(deviceName: string) {
  return useQuery({
    queryKey: ["properties", deviceName],
    queryFn: () => fetchDeviceProperties(deviceName),
  });
}
