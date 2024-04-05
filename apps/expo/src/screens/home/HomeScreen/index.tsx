import { useContext } from "react";

import AuthenticatedHomeScreen from "./AuthenticatedHomeScreen";
import DeviceOverviewScreen from "../DeviceOverviewScreen";
import UnauthenticatedHomeScreen from "./UnauthenticatedHomeScreen";

import { UserContext } from "@/providers/UserProvider";

interface HomeScreenProps {
  isAuthed: boolean;
}

export default function HomeScreen({ isAuthed }: HomeScreenProps) {
  const userContext = useContext(UserContext);
  return userContext.isAuthed ? <DeviceOverviewScreen /> : <UnauthenticatedHomeScreen />;
}
