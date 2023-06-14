import { useQuery } from "@tanstack/react-query";

import { fetchDevice } from "@/api/device";

export default function useDevice(deviceName: string, onSuccess?: any, onError?: any) {
  return useQuery({
    queryKey: ["devices", deviceName],
    queryFn: () => fetchDevice(deviceName),
    retry: false,
    onSuccess,
    onError,
  });
}
