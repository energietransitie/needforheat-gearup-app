import { z } from "zod";

const stringToDate = z.string().transform(v => new Date(v));

// error
export const validationErrorSchema = z.object({
  message: z.array(z.object({ loc: z.array(z.string()), msg: z.string(), type: z.string() })),
});

// GET: /device/{id}
export const deviceTypeSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string().optional().nullable(),
});

export const TypeSchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Formula: z.string().optional().nullable(),
});

export type DeviceTypeResponse = z.infer<typeof deviceTypeSchema>;

export const propertySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

export type Property = z.infer<typeof propertySchema>;

// GET: /device/{id}/properties & /energy_query/{id}/properties
export const propertiesSchema = z.array(propertySchema);

export type PropertiesResponse = z.infer<typeof propertiesSchema>;

export const measurementSchema = z.object({
  id: z.number().optional(),
  upload_id: z.number().optional(),
  property: propertySchema,
  value: z.string(),
  time: z.number(),
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
  item: TypeSchema,
  order: z.number(),
  installation_url: z.string().optional().nullable(),
  faq_url: z.string().optional().nullable(),
  info_url: z.string().optional().nullable(),
  precedes: z
    .array(z.object({ id: z.number() }))
    .optional()
    .nullable(),
  upload_schedule: z.string().optional().nullable(),
  notification_threshold: z.string().optional().nullable(),
});

export type DataSourceType = z.infer<typeof dataSourceType>;

export const dataSourceListSchema = z
  .object({
    id: z.number().optional().nullable(),
    name: z.string().optional().nullable(),
    items: z.array(dataSourceType),
  })
  .optional()
  .nullable();

export type DataSourceListType = z.infer<typeof dataSourceListSchema>;
// Datasourcelist End

export const accountSchema = z.object({
  id: z.number(),
  activated_at: z.number(),
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
  device_type: deviceTypeSchema.optional().nullable(),
  activated_at: z.number().nullable(),
});

export type ActivateAccountDeviceResponse = z.infer<typeof activateAccountDeviceSchema>;

// GET: /device
export const deviceSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string().optional().nullable(),
  device_type: deviceTypeSchema.merge(
    z.object({
      properties: z.array(z.object({ id: z.number().optional().nullable(), name: z.string().optional().nullable() })),
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
export const deviceReadSchema = activateAccountDeviceSchema.merge(
  z.object({ latest_upload: z.number().optional().nullable() })
);

export type DeviceReadResponse = z.infer<typeof deviceReadSchema>;

// POST /device/activate
export const activateDeviceSchema = z.object({ session_token: z.string() });

export type ActivateDeviceResponse = z.infer<typeof activateDeviceSchema>;

// GET /device/{all
export const allDataSourcesSchema = z.object({
  id: z.number(),
  name: z.string(),
  activated_at: z.number().nullable(),
  latest_upload: z.number().optional().nullable(),
  type: z.string(),
  data_source: dataSourceType.optional().nullable(),
  connected: z.number().default(1),
});

export type AllDataSourcesResponse = z.infer<typeof allDataSourcesSchema>;

export type FetchMeasurementsOptions = { start?: string; end?: string; property?: number };

// EnergyQueries
export const uploadSchema = z.object({
  id: z.number().optional(),
  instance_id: z.number(),
  instance_type: z.string(),
  server_time: z.number().optional(),
  device_time: z.number(),
  size: z.number(),
  measurements: measurementsSchema,
});

export type Upload = z.infer<typeof uploadSchema>;

export const uploadsSchema = z.array(uploadSchema);

export const energyQueryScherma = z.object({
  id: z.number().optional(),
  energy_query_type: z.object({
    id: z.number(),
  }),
  activated_at: z.number().optional(),
  uploads: uploadsSchema.optional(),
});

export type EnergyQuery = z.infer<typeof energyQueryScherma>;

export const APIKeySchema = z.object({
  id: z.number().optional().nullable(),
  api_name: z.string().optional().nullable(),
  api_key: z.string().optional().nullable(),
});

export type APIKeyResponse = z.infer<typeof APIKeySchema>;

//BAG, only need identification for 3d bag
export const bagSchema = z.object({
  _embedded: z.object({
    adressen: z.array(
      z.object({
        pandIdentificaties: z.array(z.string()),
      })
    ),
  }),
});

export type BAGSchemaResponse = z.infer<typeof bagSchema>;

//3DBAG, where its all about
export const bag3DSchema = z.object({
  feature: z.object({
    CityObjects: z.record(
      z.string(),
      z.object({
        attributes: z
          .object({
            b3_bag_bag_overlap: z.number().nullable(),
            b3_bouwlagen: z.number().nullable(),
            b3_dak_type: z.string(),
            b3_h_dak_50p: z.number(),
            b3_h_dak_70p: z.number(),
            b3_h_dak_max: z.number(),
            b3_h_dak_min: z.number(),
            b3_h_maaiveld: z.number(),
            b3_kas_warenhuis: z.boolean(),
            b3_mutatie_ahn3_ahn4: z.boolean(),
            b3_nodata_fractie_ahn3: z.number(),
            b3_nodata_fractie_ahn4: z.number(),
            b3_nodata_radius_ahn3: z.number(),
            b3_nodata_radius_ahn4: z.number(),
            b3_opp_buitenmuur: z.number(),
            b3_opp_dak_plat: z.number(),
            b3_opp_dak_schuin: z.number(),
            b3_opp_grond: z.number(),
            b3_opp_scheidingsmuur: z.number(),
            b3_puntdichtheid_ahn3: z.number(),
            b3_puntdichtheid_ahn4: z.number(),
            b3_pw_bron: z.string(),
            b3_pw_datum: z.number(),
            b3_pw_selectie_reden: z.string(),
            b3_reconstructie_onvolledig: z.boolean(),
            b3_rmse_lod12: z.number(),
            b3_rmse_lod13: z.number(),
            b3_rmse_lod22: z.number(),
            b3_val3dity_lod12: z.string(),
            b3_val3dity_lod13: z.string(),
            b3_val3dity_lod22: z.string(),
            b3_volume_lod12: z.number(),
            b3_volume_lod13: z.number(),
            b3_volume_lod22: z.number(),
            begingeldigheid: z.string(),
            documentdatum: z.string(),
            documentnummer: z.string(),
            eindgeldigheid: z.string().nullable(),
            eindregistratie: z.string().nullable(),
            geconstateerd: z.boolean(),
            identificatie: z.string(),
            oorspronkelijkbouwjaar: z.number(),
            status: z.string(),
            tijdstipeindregistratielv: z.string().nullable(),
            tijdstipinactief: z.string().nullable(),
            tijdstipinactieflv: z.string().nullable(),
            tijdstipnietbaglv: z.string().nullable(),
            tijdstipregistratie: z.string(),
            tijdstipregistratielv: z.string(),
            voorkomenidentificatie: z.number(),
          })
          .optional()
          .nullable(),
      })
    ),
  }),
});

export type BAG3DSchemaResponse = z.infer<typeof bag3DSchema>;
