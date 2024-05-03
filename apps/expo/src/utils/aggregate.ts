import dayjs from "dayjs";

import { toLocalDateTime } from "./tools";

import { Measurement } from "@/types/api";

function sortFn(a: number | string, b: number | string): 1 | -1 | 0 {
  const [dateA, dateB] = [dayjs(a), dayjs(b)];

  if (dateA.isBefore(dateB)) {
    return -1;
  }

  if (dateA.isAfter(dateB)) {
    return 1;
  }

  return 0;
}

// Aggregate all measurements per day and return the average value per day.
export const getAverageValuePerDay = (data: Measurement[]): { [key: string]: number } => {
  const aggregatedData: { [key: string]: { count: number; value: number } } = {};

  for (const measurement of data) {
    const date = toLocalDateTime(measurement.time);
    if (!date) continue;
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    if (!aggregatedData[key]) {
      aggregatedData[key] = {
        value: parseInt(measurement.value, 10),
        count: 1,
      };
    } else {
      aggregatedData[key].value += parseInt(measurement.value, 10);
      aggregatedData[key].count++;
    }
  }

  const formattedData: { [key: string]: number } = {};

  Object.keys(aggregatedData).forEach(key => {
    formattedData[key] = aggregatedData[key].value / aggregatedData[key].count;
  });

  // Sort formattedData by keys (dates) in ascending order
  const sortedKeys = Object.keys(formattedData).sort(sortFn);

  // Create a new object with sorted keys
  const sortedFormattedData = sortedKeys.reduce<{ [key: string]: number }>((result, key) => {
    result[key] = formattedData[key];
    return result;
  }, {});

  return sortedFormattedData;
};
