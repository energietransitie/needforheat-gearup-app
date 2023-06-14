import { defaultSpacing } from "@rneui/base";
import { createTheme } from "@rneui/themed";

export const theme = createTheme({
  lightColors: {
    primary: "#45B97C", // Dark green
    secondary: "#B1D249", // Apple green
    background: "#F0F2F3", // Not quite white
    white: "#FFFFFF",
    black: "#231F20",
    grey0: "#FF00D6", // Unused
    grey1: "#58595B",
    grey2: "#808184",
    grey3: "#A6A8AB",
    grey4: "#D0D2D3",
    grey5: "#FF00D6", // Unused
    greyOutline: "#FF00D6", // Unused
    searchBg: "#FF00D6", // Unused
    success: "#45B97C", // Dark green
    error: "#EE3135",
    warning: "#F5A61A",
    disabled: "#A6A8AB", // grey3
  },
  mode: "light",
  spacing: defaultSpacing,
  components: {
    ListItem: {
      containerStyle: {
        backgroundColor: "transparent",
      },
    },
    Text: props => {
      const fontWeightMap = {
        100: "Thin",
        300: "Light",
        400: "Regular",
        500: "Medium",
        700: "Bold",
        900: "Black",
      };

      return {
        style: {
          fontFamily: props.bold
            ? "RobotoBold"
            : props.fontWeight
            ? `Roboto${fontWeightMap[props.fontWeight]}`
            : "RobotoRegular",
          fontSize: 16,
        },
        h1Style: {
          fontFamily: "RobotoBold",
        },
        h2Style: {
          fontFamily: "RobotoBold",
        },
        h3Style: {
          fontFamily: "RobotoBold",
        },
        h4Style: {
          fontFamily: "RobotoBold",
        },
      };
    },
    Box: (props, theme) => ({
      style: {
        padding: props.padded ? theme.spacing.md : 0,
        flex: props.center ? 1 : 0,
        justifyContent: props.center ? "center" : "flex-start",
        alignItems: props.center ? "center" : "flex-start",
        width: props.fullWidth ? "100%" : "auto",
      },
    }),
    Button: props => ({
      containerStyle: {
        width: props.fullWidth ? "100%" : "auto",
      },
      titleStyle: {
        fontFamily: "RobotoRegular",
      },
    }),
    Screen: (_, theme) => ({
      style: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
    }),
    Input: (props, theme) => ({
      style: {
        width: props.fullWidth ? "100%" : "auto",
      },
      containerStyle: {
        borderRadius: theme.spacing.sm,
        paddingHorizontal: 0,
      },
      inputContainerStyle: {
        borderBottomWidth: 0,
        backgroundColor: theme.colors.grey4,
        paddingHorizontal: theme.spacing.md,
      },
      errorStyle: {
        display: props.errorMessage ? "flex" : "none",
      },
    }),
  },
});
