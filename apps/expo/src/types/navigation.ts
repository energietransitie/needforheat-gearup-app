import { BleDeviceType, SensorQrCode, WifiEntry } from ".";
import { BuildingDeviceResponse } from "./api";

export type RootStackParamList = {
  Home: undefined;
  DeviceOverview: undefined;
  Info: undefined;
  Settings: undefined;
  // Temporary
  Measurements: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  AlreadyInvitedScreen: undefined;
  QrScannerScreen: {
    expectedDeviceName: string | undefined;
    device_TypeName: string;
    dataSource: BuildingDeviceResponse;
    normalName: string;
  };
  AddDeviceScreen: {
    qrData: SensorQrCode;
    expectedDeviceName?: string | undefined;
    device: string;
    normalName: string;
    dataSource: BuildingDeviceResponse;
  };
  AddOnlineDataSourceScreen: undefined;
  SearchDeviceScreen: { deviceName: string; proofOfPossession: string; device_TypeName: string; normalName: string };
  ActivateDeviceScreen: {
    qrData: SensorQrCode;
    device_TypeName: string;
    dataSourceType: string;
    normalName: string;
    dataSource: BuildingDeviceResponse;
  };
  ConnectScreen: { device: BleDeviceType; proofOfPossession: string; device_TypeName: string; normalName: string };
  WifiOverviewScreen: { device: BleDeviceType; proofOfPossession: string; device_TypeName: string; normalName: string };
  ProvisionScreen: {
    device: BleDeviceType;
    network: WifiEntry;
    proofOfPossession: string;
    password?: string;
    device_TypeName: string;
    normalName: string;
  };
  DeviceOverviewScreen: undefined;
};

export type InfoStackParamList = {
  InfoScreen: undefined;
  AboutScreen: undefined;
  FAQScreen: undefined;
  PrivacyScreen: undefined;
};

export type SettingsStackParamList = {
  SettingsScreen: undefined;
  ExternalProviderScreen: undefined;
};
