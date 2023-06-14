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

export function readableDateTime(date: Maybe<string | Date>) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleString();
}
