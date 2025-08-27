// components/ThemeRegistry/theme.ts

import { createTheme } from "@mui/material/styles";
import { Rubik } from "next/font/google";

const rubik = Rubik({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = () =>
  createTheme({
    direction: "rtl",
    palette: {
      mode: "light",
      primary: {
        main: "#1a2a5a",
        light: "#BED6E9",
        dark: "#10347A",
      },
      secondary: {
        main: "#9139D6",
        dark: "#65467f",
      },
      text: {
        primary: "#000000",
      },
      background: {
        default: "#FFFFFF",
        paper: "#FFFFFF",
      },
    },
    typography: {
      fontFamily: rubik.style.fontFamily,
      caption: {
        fontSize: "12px",
        fontWeight: 400,
      },
      h1: {
        fontSize: "22px",
        fontWeight: 700,
      },
      h2: {
        fontSize: "18px",
        fontWeight: 500,
      },
      body1: {
        fontSize: "16px",
        fontWeight: 400,
      },
      body2: {
        fontSize: "14px",
        fontWeight: 400,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 400,
            boxShadow: "none",
            borderRadius: "10px",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            fontWeight: 400,
            boxShadow: "none",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            border: "none",
          },
          notchedOutline: {
            borderColor: "#BED6E9",
            "&:hover": {
              borderColor: "#BED6E9",
            },
            "&.Mui-focused": {
              borderColor: "#BED6E9",
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "#E6EFF5",
            fontSize: "16px",
            marginBottom: "0px !important",
            color: "#434343",
            border: "1px solid #0088b7",
          },
          arrow: {
            color: "#E6EFF5",
            // add border to arrow
            "&::before": {
              border: "1px solid #0088b7",
            },
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            zIndex: 1199,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(ownerState.severity === "info" && {
              backgroundColor: "#60a5fa",
            }),
          }),
        },
      },
      // change Card box shadow
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            border: "1px solid",
            borderColor: "#BED6E9",
            boxShadow: "none",
          },
        },
      },
    },
  });

export default theme;
