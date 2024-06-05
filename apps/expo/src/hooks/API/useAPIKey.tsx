import { useQuery } from "@tanstack/react-query";

import { fetchAPIKey } from "@/api/key";

export default function useAPIKey(name: string) {
  return useQuery({
    queryKey: ["apikey", name],
    queryFn: () => fetchAPIKey(name),
  });
}
