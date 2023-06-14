export * from "./wifi";
export * from "./bluetooth";

export type Maybe<T> = T | null | undefined;

export type SensorQrCode = {
  name: string;
  pop: string;
  transport: "ble" | "softap";
  ver: string;
};
