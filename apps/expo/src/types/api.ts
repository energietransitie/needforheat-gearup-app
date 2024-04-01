import { z } from "zod";

const stringToDate = z.string().transform(v => new Date(v));

// error
export const validationErrorSchema = z.object({
  message: z.array(z.object({ loc: z.array(z.string()), msg: z.string(), type: z.string() })),
});

// GET: /device/{id}
export const deviceTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  installation_manual_url: z.string(),
  info_url: z.string(),
});

export type DeviceTypeResponse = z.infer<typeof deviceTypeSchema>;

export const deviceProperty = z.object({
  id: z.number(),
  name: z.string(),
});

export type DeviceProperty = z.infer<typeof deviceProperty>;

// GET: /device/{id}/properties
export const devicePropertiesSchema = z.array(deviceProperty);

export type DevicePropertiesResponse = z.infer<typeof devicePropertiesSchema>;

export const deviceMeasurement = z.object({
  id: z.number(),
  upload_id: z.number(),
  property: deviceProperty,
  value: z.string(),
  time: stringToDate,
});

export type DeviceMeasurement = z.infer<typeof deviceMeasurement>;

// GET: /device/{id}/measurements
export const deviceMeasurementSchema = z.array(deviceMeasurement);

export type deviceMeasurementsResponse = z.infer<typeof deviceMeasurementSchema>;

// POST: /account
export const accountSchema = z.object({
  id: z.number(),
  activated_at: stringToDate,
  buildings: z.array(
    z.object({
      id: z.number(),
    })
  ),
  campaign: z.object({
    name: z.string(),
    info_url: z.string(),
  }),
});

export type AccountResponse = z.infer<typeof accountSchema>;

// POST: /account/activate
export const activateAccountSchema = z.object({
  authorization_token: z.string(),
});

export type ActivateAccountResponse = z.infer<typeof activateAccountSchema>;

export const cloudFeed = z.object({
  cloud_feed: z.object({
    id: z.number(),
    name: z.string(),
    authorization_url: z.string(),
    token_url: z.string(),
    client_id: z.string(),
    scope: z.string(),
    redirect_url: z.string(),
  }),
  connected: z.boolean(),
});

export type CloudFeed = z.infer<typeof cloudFeed>;

// GET: /account/{id}/cloud_feed_auth
export const cloudFeedSchema = z.array(cloudFeed);

export type cloudFeedsResponse = z.infer<typeof cloudFeedSchema>;

// POST: /device
export const activateAccountDeviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  device_type: deviceTypeSchema,
  building_id: z.number(),
  activated_at: stringToDate.nullable(),
});

export type ActivateAccountDeviceResponse = z.infer<typeof activateAccountDeviceSchema>;

// GET: /device
export const deviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  device_type: deviceTypeSchema.merge(
    z.object({
      properties: z.array(z.object({ id: z.number(), name: z.string(), unit: z.string() })),
    })
  ),
  activation_token: z.string(),
  created_on: stringToDate,
  activated_on: stringToDate,
});

export type DeviceResponse = z.infer<typeof deviceSchema>;

// POST: /device
export const createDeviceSchema = activateAccountDeviceSchema;

export type CreateDeviceResponse = z.infer<typeof createDeviceSchema>;

// GET: /device/{id}
export const deviceReadSchema = activateAccountDeviceSchema.merge(z.object({ latest_upload: stringToDate.nullable() }));

export type DeviceReadResponse = z.infer<typeof deviceReadSchema>;

// POST /device/activate
export const activateDeviceSchema = z.object({ session_token: z.string() });

export type ActivateDeviceResponse = z.infer<typeof activateDeviceSchema>;

// GET /building/{id}
export const buildingDeviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  building_id: z.number(),
  activated_at: stringToDate.nullable(),
  latest_upload: stringToDate.nullable(),
  device_type: deviceTypeSchema,
});

export type BuildingDeviceResponse = z.infer<typeof buildingDeviceSchema>;

// GET /building/{id}
export const buildingSchema = z.object({
  id: z.number(),
  account_id: z.number(),
  longtitude: z.number(),
  latitude: z.number(),
  tz_name: z.string(),
  devices: z.array(buildingDeviceSchema).optional(),
});

export type BuildingResponse = z.infer<typeof buildingSchema>;
