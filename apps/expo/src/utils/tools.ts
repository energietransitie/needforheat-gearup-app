import { MANUAL_URL } from "@env";
import cronParser from "cron-parser";
import { DateTime, Duration } from "luxon";

import { getTimeZone } from "./timezone";

import { Maybe } from "@/types";
import { AllDataSourcesResponse, DataSourceListType, DataSourceType, cloudFeedsResponse } from "@/types/api";

export async function handleRequestErrors(response: Response) {
  if (!response.ok) {
    const responseClone = response.clone();
    let errors;

    // If json response contains "detail", throw that as an Error.
    try {
      errors = await responseClone.json();
      // eslint-disable-next-line no-empty, @typescript-eslint/no-unused-vars
    } catch (error) {}

    throw new Error(
      errors?.message || `An unknown error occurred${responseClone.status ? ` (${responseClone.status})` : ""}.`
    );
  }

  return response;
}

export function readableDateTime(date: Maybe<string | Date>, language: string) {
  if (!date) {
    return "";
  }

  // Convert 'date' parameter to a Date object if it is a string
  const dateObject = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObject.getTime())) {
    // Invalid Date object, return an empty string or an error message
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  };

  return dateObject.toLocaleString(language, options);
}

export function capitalizeFirstLetter(text: string | undefined) {
  if (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text;
}

export const toLocalDateTime = (unixTime: number | undefined | null): Date | undefined => {
  const timeZone = getTimeZone();
  if (unixTime) {
    const dateTime = DateTime.fromSeconds(unixTime);
    if (timeZone) {
      return dateTime.setZone(timeZone).toJSDate();
    }
    return dateTime.toJSDate();
  } else {
    return undefined;
  }
};

export function checkMissedUpload(item: AllDataSourcesResponse): number {
  let latestUploadString =
    item.latest_upload && item.latest_upload > 0
      ? toLocalDateTime(item.latest_upload)
      : toLocalDateTime(item.activated_at) ?? "";
  if (!latestUploadString) latestUploadString = "";

  const timeNow = new Date();
  const cronExpression = item.data_source?.upload_schedule ? item.data_source.upload_schedule : "";
  const notificationThresholdDurationISO = item.data_source?.notification_threshold;

  try {
    const intervalIterator = cronParser.parseExpression(cronExpression, { currentDate: latestUploadString });
    let missedIntervals = 0;
    let upToDate = false;

    // Convert ISO 8601 duration to Luxon Duration
    if (notificationThresholdDurationISO) {
      const thresholdTime = DateTime.fromJSDate(new Date(latestUploadString.toString())).plus(
        Duration.fromISO(notificationThresholdDurationISO)
      );

      // Check if the current time has passed the threshold time
      if (DateTime.now() >= thresholdTime) return -2;
    }

    while (!upToDate && intervalIterator.hasNext() && missedIntervals < 10) {
      const nextInterval = intervalIterator.next().toDate();
      if (nextInterval.getTime() === timeNow.getTime()) break;
      if (nextInterval.getTime() < timeNow.getTime()) {
        missedIntervals++;
      } else {
        upToDate = true;
      }
    }
    return missedIntervals;
  } catch (error) {
    console.error("Error parsing cron expression:", error);
    return -1;
  }
}

export function checkStatus(
  dataSource: DataSourceType,
  oldSource: AllDataSourcesResponse,
  cloudFeedData: cloudFeedsResponse | undefined
) {
  const activated_at = oldSource?.activated_at ?? null;
  if (
    (dataSource.category === "cloud_feed_type" &&
      cloudFeedData?.find(item => item.cloud_feed_type.name === dataSource.item.Name)?.connected) ||
    !(activated_at === null)
  ) {
    return 2;
  }
  return 1;
}

export function getManualUrl(dataSource: DataSourceType | undefined) {
  let manualType = "devices";

  if (dataSource?.category === "cloud_feed_type") manualType = "cloud_feeds";
  if (dataSource?.category === "energy_query_type") manualType = "energy_queries";

  return `${MANUAL_URL}/${manualType}/${dataSource?.item.Name}`;
}

export function processDataSource(
  dataSource: DataSourceType,
  data: AllDataSourcesResponse[] | undefined,
  cloudFeedData: cloudFeedsResponse | undefined,
  energyQueryData: AllDataSourcesResponse[] | undefined,
  dataSourceList: DataSourceListType
): AllDataSourcesResponse {
  let connectStatus = 1;

  const oldSource = getOldSource(dataSource, energyQueryData, data);
  if (oldSource) {
    connectStatus = checkStatus(dataSource, oldSource, cloudFeedData);
  }

  //Check if all precedes are completed
  const itemsNotPrecedingCurrent = dataSourceList?.items.filter(otherItem => {
    if (!otherItem.precedes) return false;
    const precedesMatch = otherItem.precedes.some(precede => precede.id === dataSource.id);
    return otherItem.id !== dataSource.id && precedesMatch;
  });

  let allPrecedesDone = true;
  if (itemsNotPrecedingCurrent && itemsNotPrecedingCurrent.length > 0) {
    itemsNotPrecedingCurrent.forEach(otherItem => {
      const otherOldSource = getOldSource(otherItem, energyQueryData, data);
      if (otherOldSource) {
        if (checkStatus(otherItem, otherOldSource, cloudFeedData) === 1) {
          allPrecedesDone = false;
        }
      } else {
        allPrecedesDone = false;
      }
    });
  }

  connectStatus = connectStatus === 2 ? connectStatus : allPrecedesDone ? 0 : 1;

  const newResponse: AllDataSourcesResponse = {
    id: dataSource.id,
    name: oldSource?.name ? oldSource.name : dataSource.item.Name,
    activated_at: oldSource?.activated_at ? oldSource?.activated_at : null,
    type: oldSource?.type ? oldSource?.type : dataSource.item.Name,
    latest_upload: oldSource?.latest_upload,
    data_source: dataSource,
    connected: connectStatus,
  };

  return newResponse;
}
function getOldSource(
  dataSource: DataSourceType,
  energyQueryData: AllDataSourcesResponse[] | undefined,
  data: AllDataSourcesResponse[] | undefined
) {
  let oldSource: AllDataSourcesResponse | undefined;
  if (dataSource.category === "energy_query_type") {
    oldSource = energyQueryData?.find(item => item.type === dataSource.item.Name);
  } else {
    oldSource = data?.find(item => item.type === dataSource.item.Name);
  }
  return oldSource;
}
