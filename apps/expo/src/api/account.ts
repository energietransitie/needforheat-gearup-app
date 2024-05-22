import { API_URL } from "@env";

import { BASE_FETCH_HEADERS, FETCH_HEADERS, getAuthToken } from "@/constants";
import { activateAccountSchema, cloudFeedSchema } from "@/types/api";
import { handleRequestErrors } from "@/utils/handleRequestErrors";
import { getJwtPayload } from "@/utils/jwt";

export async function activateAccount(accountToken: string) {
  const response = await fetch(`${API_URL}/account/activate`, {
    headers: {
      ...BASE_FETCH_HEADERS,
      Authorization: `Bearer ${accountToken}`,
    },
    method: "POST",
    body: JSON.stringify({}),
  });

  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return activateAccountSchema.parse(jsonData);
}

export async function fetchCloudFeeds() {
  const subject = getJwtPayload(await getAuthToken()).sub;
  const response = await fetch(`${API_URL}/account/${subject}/cloud_feed`, {
    ...(await FETCH_HEADERS()),
  });
  const data = await handleRequestErrors(response);
  const jsonData = await data.json();
  return cloudFeedSchema.parse(jsonData);
}

export async function activateCloudFeed({ cloudFeedId, authCode }: { cloudFeedId: number; authCode: string }) {
  const subject = getJwtPayload(await getAuthToken()).sub;
  const response = await fetch(`${API_URL}/account/${subject}/cloud_feed`, {
    ...(await FETCH_HEADERS()),
    method: "POST",
    body: JSON.stringify({ cloud_feed_id: cloudFeedId, auth_grant_token: authCode }),
  });

  // Response does not return a body on 200 OK.
  if (!response.ok) {
    await handleRequestErrors(response);
  }
}
