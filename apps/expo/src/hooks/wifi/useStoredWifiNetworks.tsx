import { useQuery } from "@tanstack/react-query";

import { storeWifiNetwork, getWifiNetworks } from "@/constants";
import { WifiEntry } from "@/types";

export default function useStoredWifiNetworks() {
  const { data: storedWifiNetworks, ...query } = useQuery<WifiEntry[]>({
    queryKey: ["storedWifiNetworks"],
    queryFn: () => getWifiNetworks(),
    refetchOnMount: true,
  });

  return {
    storedWifiNetworks,
    storeWifiNetwork,
    ...query,
  };
}
