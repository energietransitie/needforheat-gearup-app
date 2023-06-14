export type WifiEntry = {
  name: string;
  rssi?: number;
  security?: WifiSecurity;
  password?: string;
};

// The security type is a number corresponding to the Wi-Fi Alliance's WPA/WPA2 Technical Specification.
// See https://www.wi-fi.org/downloads-registered-guest/Wi-Fi_Protected_Access_WPA_v2p0_TM_Technical_Specification_Rev_D.pdf
export type WifiSecurity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
