import cronParser from "cron-parser";
import { DateTime, Duration } from "luxon";

import { Maybe } from "@/types";
import { BuildingDeviceResponse, CloudFeed, DataSourceType, DataSourcesList } from "@/types/api";

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

export function checkMissedUpload(item: BuildingDeviceResponse): number {
  const latestUploadString = item.latest_upload ? item.latest_upload.toISOString() : "";
  const timeNow = new Date();
  const cronExpression = item.upload_schedule ? item.upload_schedule : "";
  const notificationThresholdDurationISO = item.notification_threshold_duration;
  try {
    const intervalIterator = cronParser.parseExpression(cronExpression, { currentDate: latestUploadString });
    let missedIntervals = 0;
    let upToDate = false;

    // Convert ISO 8601 duration to Luxon Duration
    if (notificationThresholdDurationISO) {
      const thresholdTime = DateTime.fromISO(latestUploadString).plus(
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
  dataSource: {
    id: number;
    type: { name: string };
    item: { id: number; name: string; installation_manual_url: string; info_url: string };
    precedes: { id: number }[];
    uploadschedule: string;
  },
  oldSource: BuildingDeviceResponse,
  cloudFeedData: CloudFeed[] | undefined
) {
  const activated_at = oldSource?.activated_at ?? null;
  if (
    (dataSource.type.name === "cloud_feed" &&
      cloudFeedData?.find(item => item.cloud_feed.name === dataSource.item.name)?.connected) ||
    !(activated_at === null)
  ) {
    return 2;
  }
  return 1;
}

export function processDataSource(
  dataSource: DataSourceType,
  data: BuildingDeviceResponse[] | undefined,
  cloudFeedData: CloudFeed[] | undefined,
  dataSourcesList: DataSourcesList,
  buildingId: number
): BuildingDeviceResponse {
  let connectStatus = 1;
  const oldSource = data?.find(item => item.device_type.name === dataSource.item.name);
  const activated_at = oldSource?.activated_at ?? null;
  const latest_upload = oldSource?.latest_upload ?? null;
  const upload_schedule = dataSource.uploadschedule;

  if (oldSource) {
    connectStatus = checkStatus(dataSource, oldSource, cloudFeedData);
  }

  // Check if all precedes are completed
  const itemsNotPrecedingCurrent = dataSourcesList.items.filter(otherItem => {
    const precedesMatch = otherItem.precedes.some(precede => precede.id === dataSource.id);
    return otherItem.id !== dataSource.id && precedesMatch;
  });

  let allPrecedesDone = true;
  if (itemsNotPrecedingCurrent.length > 0) {
    itemsNotPrecedingCurrent.forEach(otherItem => {
      const otherOldSource = data?.find(item => item.device_type.name === otherItem.item.name);
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

  return {
    id: dataSource.id,
    name: oldSource?.name ? oldSource.name : dataSource.item.name,
    building_id: buildingId,
    device_type: dataSource.item,
    activated_at,
    latest_upload,
    upload_schedule,
    typeCategory: dataSource.type.name,
    connected: connectStatus,
    notification_threshold_duration: dataSource.notificationThresholdDuration,
  };
}
