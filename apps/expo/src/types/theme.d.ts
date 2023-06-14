import "@rneui/themed";

declare module "@rneui/themed" {
  type FontWeight = 100 | 300 | 400 | 500 | 700 | 900;

  export interface TextProps {
    bold?: boolean;
    fontWeight?: FontWeight;
  }

  export interface ButtonProps {
    fullWidth?: boolean;
  }

  export interface InputProps {
    fullWidth?: boolean;
  }

  export interface ComponentTheme {
    Text: Partial<TextProps>;
    Button: Partial<ButtonProps>;
    Input: Partial<TextInputProps>;
  }
}
