import { useEffect, useState } from "react";
import { NativeEventEmitter, NativeModules } from "react-native";
import EspIdfProvisioning from "react-native-esp-idf-provisioning";

import { BleDeviceType } from "@/types";

type useDeviceConnectOptions = {
  device: BleDeviceType;
  proofOfPossession: string;
};

type onError = (error?: string) => void;

const EspIdfProvisioningModule = NativeModules.EspIdfProvisioning;
const emitter = new NativeEventEmitter(EspIdfProvisioningModule);

export default function useDeviceConnect({ device, proofOfPossession }: useDeviceConnectOptions) {
  const [isConnected, setIsConnected] = useState(false);

  async function connectToDevice(callback: () => void, onError?: onError) {
    console.log("connectToDevice: " + device.deviceName);
    setIsConnected(false);

    emitter.removeAllListeners("DeviceConnectionEvent");

    emitter.addListener("DeviceConnectionEvent", function (status: string) {
      onConnectionEvent(status, callback, onError);
      emitter.removeAllListeners("DeviceConnectionEvent");
    });

    await EspIdfProvisioning.connectBleDevice(device.deviceAddress, proofOfPossession).catch(onError);
  }

  useEffect(() => {
    const connectionEventListener = (status: string) => {
      onConnectionEvent(status, callback);
    };

    emitter.addListener("DeviceConnectionEvent", connectionEventListener);
    return () => {
      emitter.removeAllListeners("DeviceConnectionEvent");
    };
  }, []);

  function onConnectionEvent(status: string, callback: () => void, onError?: onError) {
    // Listen to connection events, only effective on Android (iOS will reject the promise in connectBleDevice)
    if (status === "EVENT_DEVICE_CONNECTION_FAILED") {
      console.log(`onDeviceConnectionFailed: ${device.deviceName} failed to connect (EVENT_DEVICE_CONNECTION_FAILED)`);
      onError?.();
      return;
    }

    // Status can be "connected" (iOS) or "EVENT_DEVICE_CONNECTED" (Android) if it was successful
    if (status !== "connected" && status !== "EVENT_DEVICE_CONNECTED") {
      setIsConnected(true);
      console.log(`onDeviceConnected: ${device.deviceName} connected`);
      return;
    }

    setIsConnected(true);
    console.log(`onDeviceConnected: ${device.deviceName} connected`);

    callback();
  }

  return {
    isConnected,
    connectToDevice,
  };
}
function callback(): void {
  throw new Error("Function not implemented.");
}
