import { API_URL } from "@env";

import { FETCH_HEADERS } from "@/constants";
import { APIKeySchema } from "@/types/api";
import { handleRequestErrors } from "@/utils/handleRequestErrors";

export async function fetchAPIKey(APIName: string) {
  const response = await fetch(`${API_URL}/api_key/${APIName}`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return APIKeySchema.parse(jsonData);
}
