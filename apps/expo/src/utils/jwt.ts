import { decode } from "base-64";

import { Maybe } from "@/types";

type JwtPayload = {
  sub: string;
};

export function getJwtPayload(token: Maybe<string>) {
  const payload = token?.split(".")[1];

  if (!payload) {
    throw new Error("Invalid JWT token.");
  }

  return JSON.parse(decode(payload)) as JwtPayload;
}
