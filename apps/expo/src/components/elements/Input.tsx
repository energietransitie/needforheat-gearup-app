import { InputProps, withTheme } from "@rneui/themed";
import { TextInput } from "react-native";

export default withTheme<InputProps>(TextInput, "Input");

declare module "@rneui/themed" {
  export interface ComponentTheme {
    Input: Partial<InputProps>;
  }
}
