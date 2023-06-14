import { useQuery } from "@tanstack/react-query";

import { fetchUser } from "@/api/user";

export default function useUser() {
  const { data: user, isFetching, refetch } = useQuery({ queryKey: ["user"], queryFn: () => fetchUser(), retry: 0 });

  return {
    user,
    isAuthed: Boolean(user),
    isLoading: isFetching,
    refetch,
  };
}
