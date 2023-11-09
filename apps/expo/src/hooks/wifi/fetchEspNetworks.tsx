import EspIdfProvisioning from "react-native-esp-idf-provisioning";

import { WifiEntry } from "@/types";
import { withTimeout } from "@/utils/withTimeout";

export const fetchEspNetworks: () => Promise<WifiEntry[]> = () => withTimeout(30, EspIdfProvisioning.scanWifiList());
