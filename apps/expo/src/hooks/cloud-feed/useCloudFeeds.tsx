import { useQuery } from "@tanstack/react-query";

import { fetchCloudFeeds } from "@/api/account";

export default function useCloudFeeds() {
  return useQuery({
    queryKey: ["cloud-feeds"],
    queryFn: () => fetchCloudFeeds(),
  });
}
