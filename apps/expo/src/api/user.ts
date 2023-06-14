import { API_URL } from "@env";

import { FETCH_HEADERS, getAuthToken } from "@/constants";
import { accountSchema } from "@/types/api";
import { getJwtPayload } from "@/utils/jwt";
import { handleRequestErrors } from "@/utils/tools";

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
