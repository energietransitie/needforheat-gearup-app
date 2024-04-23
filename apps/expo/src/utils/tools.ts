import { Maybe } from "@/types";

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
