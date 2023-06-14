import { useQuery } from "@tanstack/react-query";

import { fetchEspNetworks } from "./fetchEspNetworks";

import { WifiEntry } from "@/types";

// Remove duplicates by SSID and sort by highest signal strength,
// put the networks (without rssi) first sorted by name
// and hide the hidden networks.
const sortNetworks = (networks: WifiEntry[]) => {
  return networks
    .filter(network => network.name !== "(hidden SSID)")
    .filter((network, index, self) => {
      return index === self.findIndex(t => t.name === network.name);
    })
    .sort((a, b) => {
      if (a.rssi && b.rssi) {
        return b.rssi - a.rssi;
      } else if (a.rssi && !b.rssi) {
        return -1;
      } else if (!a.rssi && b.rssi) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
};

export default function useWifiNetworks(deviceName: string) {
  return useQuery<WifiEntry[]>({
    queryKey: ["wifiNetworks", deviceName],
    queryFn: async () => sortNetworks(await fetchEspNetworks()),
    retryDelay: 3000,
    refetchOnMount: true,
  });
}
