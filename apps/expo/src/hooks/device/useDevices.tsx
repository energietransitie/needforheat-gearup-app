import { useQuery } from "@tanstack/react-query";

import { fetchDevices } from "@/api/device";

export default function useDevices(buildingId: number) {
  return useQuery({
    queryKey: ["devices", { buildingId }],
    queryFn: () => fetchDevices(buildingId),
  });
}
