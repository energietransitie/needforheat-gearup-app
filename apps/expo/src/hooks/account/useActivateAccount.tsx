import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { activateAccount } from "@/api/account";

type ReactQueryOptions = Omit<
  UseMutationOptions<Awaited<ReturnType<typeof activateAccount>>, unknown, { accountToken: string }, unknown>,
  "mutationFn"
>;

export default function useActivateAccount(options: ReactQueryOptions = {}) {
  // eslint-disable-next-line @tanstack/query/prefer-query-object-syntax
  return useMutation(async ({ accountToken }) => activateAccount(accountToken), options);
}
