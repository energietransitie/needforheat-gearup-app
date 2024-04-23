import { useQuery } from "@tanstack/react-query";

import { fetchBuilding } from "@/api/device";

type UseBuildingOptions = {
  buildingId: string | number;
};

export default function useBuilding(options: UseBuildingOptions) {
  const { data: building, ...rest } = useQuery({
    queryFn: () => fetchBuilding(options.buildingId),
  });

  return {
    building,
    ...rest,
  };
}
