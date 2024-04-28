import { useQuery } from "@tanstack/react-query";

import { fetchEnergyQueries } from "@/api/energyquery";

export default function useEnergyQueries() {
  return useQuery({
    queryKey: ["energy_queries"],
    queryFn: () => fetchEnergyQueries(),
  });
}
