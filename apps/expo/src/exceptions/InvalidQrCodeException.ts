export class InvalidQrCodeException extends Error {
  constructor() {
    super("Invalid QR code.");

    this.name = "InvalidQrCodeException";
  }
}
