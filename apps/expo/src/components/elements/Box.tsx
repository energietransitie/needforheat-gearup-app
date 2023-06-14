import { withTheme } from "@rneui/themed";
import { View, ViewProps } from "react-native";

export type BoxProps = ViewProps & {
  center?: boolean;
  padded?: boolean;
  fullWidth?: boolean;
};

export default withTheme<BoxProps>(View, "Box");

declare module "@rneui/themed" {
  export interface ComponentTheme {
    Box: Partial<BoxProps>;
  }
}
