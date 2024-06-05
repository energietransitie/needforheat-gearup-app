import { useContext } from "react";

import UnauthenticatedHomeScreen from "./UnauthenticatedHomeScreen";
import DeviceOverviewScreen from "../DeviceOverviewScreen";

import { UserContext } from "@/providers/UserProvider";

export default function HomeScreen() {
  const userContext = useContext(UserContext);
  return userContext.isAuthed ? <DeviceOverviewScreen /> : <UnauthenticatedHomeScreen />;
}
