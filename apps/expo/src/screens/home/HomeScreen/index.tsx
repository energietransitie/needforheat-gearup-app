import { useContext } from "react";

import AuthenticatedHomeScreen from "./AuthenticatedHomeScreen";
import DeviceOverviewScreen from "../DeviceOverviewScreen";
import UnauthenticatedHomeScreen from "./UnauthenticatedHomeScreen";

import { UserContext } from "@/providers/UserProvider";


export default function HomeScreen() {
  const userContext = useContext(UserContext);
  return userContext.isAuthed ? <DeviceOverviewScreen /> : <UnauthenticatedHomeScreen />;
}
