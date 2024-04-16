import { BleDeviceType, SensorQrCode, WifiEntry } from ".";
import { DataSourceItemType } from "./api";

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

  //Devices
  QrScannerScreen: { expectedDeviceName: string; device_TypeName: any } | undefined;
  AddDeviceScreen: { expectedDeviceName?: string | undefined; device: DataSourceItemType };
  SearchDeviceScreen: { deviceName: string; proofOfPossession: string; device_TypeName: any };
  ActivateDeviceScreen: { qrData: SensorQrCode; device_TypeName: any };
  ConnectScreen: { device: BleDeviceType; proofOfPossession: string; device_TypeName: any };
  WifiOverviewScreen: { device: BleDeviceType; proofOfPossession: string; device_TypeName: any };
  ProvisionScreen: {
    device: BleDeviceType;
    network: WifiEntry;
    proofOfPossession: string;
    password?: string;
    device_TypeName: any;
  };
  DeviceOverviewScreen: undefined;
  //CloudFeed
  AddOnlineDataSourceScreen: undefined;
  //EnergyQuery
  InformationScreen: { expectedDeviceName?: string | undefined; device: DataSourceItemType };
  //--WeatherInterpolationLocation
  HomeSelectScreen: undefined;
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
