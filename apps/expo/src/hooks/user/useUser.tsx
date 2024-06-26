import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import LZString from "lz-string";
import { useEffect, useState } from "react";

import { fetchUser } from "@/api/user";
import { AccountResponse } from "@/types/api";

export default function useUser() {
  const { data: user, isFetching, refetch } = useQuery({ queryKey: ["user"], queryFn: () => fetchUser(), retry: 0 });

  const storeUserData = async (userData: AccountResponse) => {
    try {
      // Check if userData contains campaign property
      if (userData && userData.campaign) {
        const {
          campaign: { data_source_list, ...campaignWithoutDatasourcelist },
          ...userDataWithoutCampaignDatasourcelist
        } = userData;

        // Store modified userData
        const modifiedUserData = {
          ...userDataWithoutCampaignDatasourcelist,
          campaign: campaignWithoutDatasourcelist,
        };

        const compressedData = LZString.compressToUTF16(JSON.stringify(modifiedUserData));
        await SecureStore.setItemAsync("userData", compressedData);
      }
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const getUserData = async () => {
    try {
      const compressedData = await SecureStore.getItemAsync("userData");
      if (compressedData) {
        const userData = JSON.parse(LZString.decompressFromUTF16(compressedData));
        return userData;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      if (user) {
        await storeUserData(user);
      }
      const storedUser = await getUserData();
      setStoredUser(storedUser);
    }

    fetchData();
  }, [user]);

  const [storedUser, setStoredUser] = useState(null);

  return {
    user: user || storedUser,
    isAuthed: Boolean((user && user.activated_at) || storedUser),
    isLoading: isFetching,
    refetch,
  };
}
