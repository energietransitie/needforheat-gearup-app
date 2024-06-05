import { useQuery } from "@tanstack/react-query";

import { fetchEnergyQuery } from "@/api/energyquery";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useEnergyQuery(queryType: string, onSuccess?: any, onError?: any) {
  return useQuery({
    queryKey: ["energy_queries", queryType],
    queryFn: () => fetchEnergyQuery(queryType),
    retry: false,
    onSuccess,
    onError,
  });
}
