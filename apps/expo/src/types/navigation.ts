import { BleDeviceType, SensorQrCode, WifiEntry } from ".";
import { DataSourceItemType } from "./api";
import { UserLocation } from "./energyquery";

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
    device_TypeName: any;
    dataSourceType: DataSourceItemType;
    normalName: string;
  };
  AddDeviceScreen: {
    qrData: SensorQrCode;
    expectedDeviceName?: string | undefined;
    device: DataSourceItemType;
    normalName: string;
  };
  SearchDeviceScreen: { deviceName: string; proofOfPossession: string; device_TypeName: any; normalName: string };
  ActivateDeviceScreen: {
    qrData: SensorQrCode;
    device_TypeName: any;
    dataSourceType: DataSourceItemType;
    normalName: string;
  };
  ConnectScreen: { device: BleDeviceType; proofOfPossession: string; device_TypeName: any; normalName: string };
  WifiOverviewScreen: { device: BleDeviceType; proofOfPossession: string; device_TypeName: any; normalName: string };
  ProvisionScreen: {
    device: BleDeviceType;
    network: WifiEntry;
    proofOfPossession: string;
    password?: string;
    device_TypeName: any;
    normalName: string;
  };
  DeviceOverviewScreen: undefined;
  //CloudFeed
  AddOnlineDataSourceScreen: undefined;
  //EnergyQuery
  InformationScreen: { expectedDeviceName?: string | undefined; device: DataSourceItemType };
  HomeSelectScreen: undefined;
  WeatherLocationResultScreen: { location: UserLocation }
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
