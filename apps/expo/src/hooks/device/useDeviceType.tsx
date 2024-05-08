import { useQuery } from "@tanstack/react-query";

import { fetchDeviceType } from "@/api/device";

export default function useFetchDeviceType(deviceName: string) {
  return useQuery({
    queryKey: ["deviceType", { deviceName }],
    queryFn: () => fetchDeviceType(deviceName),
  });
}
