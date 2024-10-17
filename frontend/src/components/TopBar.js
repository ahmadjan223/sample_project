import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Icon } from "@mui/material";
import Logo from "../images/cm_logo.svg";
function appBarLabel(label) {
  return (
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        <img
          src={Logo}
          alt="logo"
          style={{
            maxWidth: "110%",
            maxHeight: "110%",
            objectFit: "contain",
          }}
        />
      </IconButton>

      <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1 }}>
        {label}
      </Typography>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        MONITOR FIELDS FOR CROPS
      </Typography>
    </Toolbar>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#181F26",
      // main: "#2D333A",

    },
  },

  typography: {
    allVariants: {
      fontFamily: "serif",
    },
  },
});

export default function TopBar() {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="primary" enableColorOnDark>
          {appBarLabel("Crop Monitoring")}
        </AppBar>
      </ThemeProvider>
    </Stack>
  );
}
