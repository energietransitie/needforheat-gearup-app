import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activateCloudFeed } from "@/api/account";

export default function useActivateCloudFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateCloudFeed,
    onSuccess: args => {
      // Invalidate the cloud feeds query cache to trigger a refetch
      queryClient.invalidateQueries(["cloud-feeds"]);
    },
  });
}
