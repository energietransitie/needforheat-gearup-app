import { useQuery } from "@tanstack/react-query";

import { fetchDevice } from "@/api/device";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useDevice(deviceName: string, onSuccess?: any, onError?: any) {
  return useQuery({
    queryKey: ["devices", deviceName],
    queryFn: () => fetchDevice(deviceName),
    retry: false,
    onSuccess,
    onError,
  });
}
