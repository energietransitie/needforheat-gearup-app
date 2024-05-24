import { API_URL } from "@env";

import { FETCH_HEADERS, getAuthToken } from "@/constants";
import { accountSchema } from "@/types/api";
import { handleRequestErrors } from "@/utils/handleRequestErrors";
import { getJwtPayload } from "@/utils/jwt";

export async function fetchUser() {
  const authToken = await getAuthToken();

  if (!authToken) return null;

  const subject = getJwtPayload(authToken).sub;
  const response = await fetch(`${API_URL}/account/${subject}`, {
    ...(await FETCH_HEADERS()),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();

  return accountSchema.parse(jsonData);
}
