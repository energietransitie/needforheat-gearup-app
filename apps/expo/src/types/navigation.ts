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
  AddOnlineDataSourceScreen: undefined;
  SearchDeviceScreen: { deviceName: string; proofOfPossession: string; device_TypeName: any };
  ActivateDeviceScreen: { qrData: SensorQrCode };
  ConnectScreen: { device: BleDeviceType; proofOfPossession: string; device_TypeName: any };
  WifiOverviewScreen: { device: BleDeviceType; proofOfPossession: string; device_TypeName: any };
  ProvisionScreen: {
    device: BleDeviceType;
    network: WifiEntry;
    proofOfPossession: string;
    password?: string;
    device_TypeName: any
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
