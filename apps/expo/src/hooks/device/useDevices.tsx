import { useQuery } from "@tanstack/react-query";

import { fetchDevices } from "@/api/device";

export default function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: () => fetchDevices(),
  });
}
