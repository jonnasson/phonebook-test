import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#334155" },
        secondary: { main: "#6366F1" },
        background: {
          default: "#F8FAFC",
          paper: "#FFFFFF",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: "#CBD5E1" },
        secondary: { main: "#818CF8" },
        background: {
          default: "#0F172A",
          paper: "#1E293B",
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-background-paper)",
          color: "var(--mui-palette-text-primary)",
          borderBottom: "1px solid var(--mui-palette-divider)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderRadius: 16,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 100px var(--mui-palette-background-paper) inset !important;
          -webkit-text-fill-color: var(--mui-palette-text-primary) !important;
          caret-color: var(--mui-palette-text-primary) !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
      `,
    },
    MuiTextField: {
      defaultProps: {
        autoComplete: "off",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
