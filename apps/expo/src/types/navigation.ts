import { BleDeviceType, SensorQrCode, WifiEntry } from ".";

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
  QrScannerScreen: { expectedDeviceName: string } | undefined;
  AddDeviceScreen: { qrData: SensorQrCode };
  SearchDeviceScreen: { deviceName: string; proofOfPossession: string };
  ActivateDeviceScreen: { qrData: SensorQrCode };
  ConnectScreen: { device: BleDeviceType; proofOfPossession: string };
  WifiOverviewScreen: { device: BleDeviceType; proofOfPossession: string };
  ProvisionScreen: {
    device: BleDeviceType;
    network: WifiEntry;
    proofOfPossession: string;
    password?: string;
  };
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
