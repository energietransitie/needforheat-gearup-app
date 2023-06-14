import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activateDevice } from "@/api/device";

export default function useDeviceActivate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateDevice,
    onSuccess: args => {
      // Invalidate the devices query to trigger a refetch
      queryClient.invalidateQueries(["devices"]);
    },
  });
}
