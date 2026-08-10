import { createTheme } from "@mui/material/styles";

// Ported 1:1 from Flutter's lib/config/theme.dart color constants.
export const colors = {
  mainTextColor: "#161616",
  mainWhiteTextColor: "#FDFDFD",
  additionalTextColor: "#6C6C6C",
  additionalTextColor2: "#bcbcbc",
  mainDrawerIconColor: "#161616",
  additionalColor: "#FDFDFD",
  canvasColor: "#ffffff",
  appBarColor: "#ffffff",
  mainColor: "#161616",
  greenColor: "#42c766",
  orangeColor: "#EFB572",
  saleBadgeColor: "#FF5F5F",
} as const;

// Ported from lib/config/font.dart — GoogleFonts.comfortaa()
export const fontFamily = '"Comfortaa", sans-serif';

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.mainColor,
      contrastText: "#ffffff",
    },
    text: {
      primary: colors.mainTextColor,
      secondary: colors.additionalTextColor,
    },
    background: {
      default: colors.canvasColor,
      paper: colors.appBarColor,
    },
  },
  typography: {
    fontFamily,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.canvasColor,
        },
      },
    },
  },
});

export default theme;
