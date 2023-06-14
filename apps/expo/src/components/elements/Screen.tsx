import { withTheme } from "@rneui/themed";
import { View, ViewProps } from "react-native";

export type ScreenProps = ViewProps;

export default withTheme<ScreenProps>(View, "Screen");

declare module "@rneui/themed" {
  export interface ComponentTheme {
    Screen: Partial<ScreenProps>;
  }
}
