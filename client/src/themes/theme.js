import { createTheme } from "@mui/material/styles";

const tokens = {
  ink: "#16233A",
  paper: "#F1F3ED",
  paperRaised: "#FFFFFF",
  highlight: "#F5A623",
  teal: "#1B6E63",
  brick: "#C1443C",
  inkLight: "#55606E",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: tokens.ink, contrastText: "#F1F3ED" },
    secondary: { main: tokens.teal, contrastText: "#FFFFFF" },
    warning: { main: tokens.highlight },
    error: { main: tokens.brick },
    background: { default: tokens.paper, paper: tokens.paperRaised },
    text: { primary: tokens.ink, secondary: tokens.inkLight },
  },
  typography: {
    fontFamily: `"Work Sans", "Helvetica", "Arial", sans-serif`,
    h1: { fontFamily: `"Fraunces", serif`, fontWeight: 600, letterSpacing: "-0.01em" },
    h2: { fontFamily: `"Fraunces", serif`, fontWeight: 600, letterSpacing: "-0.01em" },
    h3: { fontFamily: `"Fraunces", serif`, fontWeight: 600 },
    h4: { fontFamily: `"Fraunces", serif`, fontWeight: 600 },
    h5: { fontFamily: `"Fraunces", serif`, fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, paddingLeft: 20, paddingRight: 20 },
        containedPrimary: {
          backgroundColor: tokens.ink,
          "&:hover": { backgroundColor: "#0E1826" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 1px 2px rgba(22,35,58,0.08)", border: "1px solid rgba(22,35,58,0.08)" },
      },
    },
  },
});

export { tokens };
export default theme;