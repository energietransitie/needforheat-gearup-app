import * as SecureStore from "expo-secure-store";

import { WifiEntry } from "./types";

export const HIDDEN_PROPERTY_NAMES = ["booted_fw", "heartbeat", "batteryVoltage"];

export const AUTH_TOKEN_IDENTIFIER = "auth_token";
export const WIFI_NETWORKS_IDENTIFIER = "wifi_networks";
export const AUTH_STATE_IDENTIFIER = "auth_state";

/**
 * Test if localstorage has a token.
 */
export async function hasAuthToken() {
  return Boolean(await getAuthToken());
}

/**
 * Get the authentication token from the local storage.
 */
export async function getAuthToken() {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_IDENTIFIER);
  } catch (err) {
    console.error(`Unable to get ${AUTH_TOKEN_IDENTIFIER}`, err);
    return null;
  }
}

/**
 * Set the authentication token in the local storage.
 */
export async function setAuthToken(token: string) {
  await SecureStore.setItemAsync(AUTH_TOKEN_IDENTIFIER, token);
}

/**
 * Remove authorization token from the local storage.
 */
export async function removeAuthToken() {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_IDENTIFIER);
}

/**
 * Get the oauth state from the local storage.
 */
export async function getAuthState() {
  try {
    return await SecureStore.getItemAsync(AUTH_STATE_IDENTIFIER);
  } catch (err) {
    console.error(`Unable to get ${AUTH_STATE_IDENTIFIER}`, err);
    return null;
  }
}

/**
 * Set the oauth state in the local storage.
 */
export async function setAuthState(state: string) {
  await SecureStore.setItemAsync(AUTH_STATE_IDENTIFIER, state);
}

/**
 * Remove oauth state from the local storage.
 */
export async function removeAuthState() {
  await SecureStore.deleteItemAsync(AUTH_STATE_IDENTIFIER);
}

/**
 * Get the wifi networks token from the local storage.
 */
export async function getWifiNetworks(): Promise<WifiEntry[]> {
  try {
    const data = await SecureStore.getItemAsync(WIFI_NETWORKS_IDENTIFIER);
    return data ? (JSON.parse(data) as WifiEntry[]) : [];
  } catch (err) {
    console.error(`Unable to get ${WIFI_NETWORKS_IDENTIFIER}`, err);
    return [];
  }
}

/**
 * Add a wifi network to the local storage.
 */
export async function storeWifiNetwork(wifiNetwork: WifiEntry): Promise<void> {
  try {
    const networks = await getWifiNetworks();

    // Remove any existing network with the same SSID and add the new one.
    const filteredNetworks = networks.filter(network => network.name !== wifiNetwork.name);
    filteredNetworks.push(wifiNetwork);

    // Save the new networks.
    await SecureStore.setItemAsync(WIFI_NETWORKS_IDENTIFIER, JSON.stringify(filteredNetworks));
  } catch (err) {
    console.error(`Unable to set ${WIFI_NETWORKS_IDENTIFIER}`, err);
  }
}

/**
 * Delete wifi networks from the local storage.
 */
export async function deleteWifiNetworks(): Promise<void> {
  await SecureStore.deleteItemAsync(WIFI_NETWORKS_IDENTIFIER);
}

/**
 * Get the default fetch headers.
 */
export const BASE_FETCH_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/**
 * Get the default fetch headers with the authorization token.
 */
export async function FETCH_HEADERS() {
  const token = await getAuthToken();

  return {
    headers: {
      ...BASE_FETCH_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  };
}
