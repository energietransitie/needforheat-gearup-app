import { useContext } from "react";

import AuthenticatedHomeScreen from "./AuthenticatedHomeScreen";
import UnauthenticatedHomeScreen from "./UnauthenticatedHomeScreen";

import { UserContext } from "@/providers/UserProvider";

export default function HomeScreen() {
  const { isAuthed } = useContext(UserContext);
  return isAuthed ? <AuthenticatedHomeScreen /> : <UnauthenticatedHomeScreen />;
}
