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
});

export type DeviceTypeResponse = z.infer<typeof deviceTypeSchema>;

export const propertySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type Property = z.infer<typeof propertySchema>;

// GET: /device/{id}/properties & /energy_query/{id}/properties
export const propertiesSchema = z.array(propertySchema);

export type PropertiesResponse = z.infer<typeof propertiesSchema>;

export const measurementSchema = z.object({
  id: z.number(),
  upload_id: z.number(),
  property: propertySchema,
  value: z.string(),
  time: stringToDate,
});

export type Measurement = z.infer<typeof measurementSchema>;

// GET: /device/{id}/measurements &  /energy_query/{id}/measurements
export const measurementsSchema = z.array(measurementSchema);

export type measurementsResponse = z.infer<typeof measurementsSchema>;

// POST: /account
//DataSourceList
export const dataSourceType = z.object({
  id: z.number(),
  category: z.string(),
  item: deviceTypeSchema,
  order: z.number(),
  installation_manual_url: z.string(),
  FAQ_url: z.string(),
  info_url: z.string(),
  precedes: z.array(z.object({ id: z.number() })),
  uploadschedule: z.string(),
  notificationThresholdDuration: z.string(),
});

export type DataSourceType = z.infer<typeof dataSourceType>;

export const dataSourceListSchema = z.object({
  id: z.number(),
  name: z.string(),
  items: z.array(dataSourceType),
});

export type DataSourceListType = z.infer<typeof dataSourceListSchema>;
// Datasourcelist End

export const accountSchema = z.object({
  id: z.number(),
  activated_at: stringToDate,
  campaign: z.object({
    name: z.string(),
    info_url: z.string(),
    data_source_list: dataSourceListSchema,
  }),
});

export type AccountResponse = z.infer<typeof accountSchema>;

// POST: /account/activate
export const activateAccountSchema = z.object({
  authorization_token: z.string(),
});

export type ActivateAccountResponse = z.infer<typeof activateAccountSchema>;

export const cloudFeedType = z.object({
  cloud_feed_type: z.object({
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

export type CloudFeedType = z.infer<typeof cloudFeedType>;

// GET: /account/{id}/cloud_feed_auth
export const cloudFeedSchema = z.array(cloudFeedType);

export type cloudFeedsResponse = z.infer<typeof cloudFeedSchema>;

// POST: /device
export const activateAccountDeviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  device_type: deviceTypeSchema,
  activated_at: stringToDate.nullable(),
});

export type ActivateAccountDeviceResponse = z.infer<typeof activateAccountDeviceSchema>;

// GET: /device
export const deviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  device_type: deviceTypeSchema.merge(
    z.object({
      properties: z.array(z.object({ id: z.number(), name: z.string() })),
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

// GET /device/{all
export const allDataSourcesSchema = z.object({
  id: z.number(),
  name: z.string(),
  activated_at: stringToDate.nullable(),
  latest_upload: stringToDate.nullable(),
  data_source: dataSourceType,
  connected: z.number().default(1),
});

export type AllDataSourcesResponse = z.infer<typeof allDataSourcesSchema>;

export type FetchMeasurementsOptions = { start?: string; end?: string; property: number };

// EnergyQueries
export const uploadSchema = z.object({
  id: z.number(),
  instance_id: z.number(),
  instance_type: z.string(),
  server_time: z.date(),
  device_time: z.date(),
  size: z.number(),
  measurements: measurementsSchema,
});

export type Upload = z.infer<typeof uploadSchema>;

export const uploadsSchema = z.array(uploadSchema);

export const energyQueryScherma = z.object({
  id: z.number(),
  energy_query_type: z.string(),
  activated_at: z.date(),
  uploads: uploadsSchema,
});

export type EnergyQuery = z.infer<typeof energyQueryScherma>;
