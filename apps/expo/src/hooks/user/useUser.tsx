import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

import { fetchUser } from "@/api/user";

export default function useUser() {
  const { data: user, isFetching, refetch } = useQuery({ queryKey: ["user"], queryFn: () => fetchUser(), retry: 0 });

  const storeUserData = (userData: AccountResponse) => {
    try {
      SecureStore.setItemAsync("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const getUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync("userData");
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      if (user) {
        storeUserData(user);
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
