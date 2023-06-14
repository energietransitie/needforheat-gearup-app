export class MismatchedDeviceNameException extends Error {
  constructor() {
    super("The device name in the QR code does not match the name of the device you are trying to reset.");

    this.name = "MismatchedDeviceNameException";
  }
}
