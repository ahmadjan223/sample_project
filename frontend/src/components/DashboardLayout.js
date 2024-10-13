import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import List from "@mui/material/List"; // Import List
import ListItem from "@mui/material/ListItem"; // Import ListItem
import ListItemText from "@mui/material/ListItemText"; // Import ListItemText
import { createTheme } from "@mui/material/styles";
import LayersIcon from "@mui/icons-material/Layers";

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        border: "5px solid pink",
        height: "100%",
        width: "100%", // Set height to fill available space
        flexGrow: 1, // Grow to take remaining space in the layout
      }}
    >
      <Typography>Map content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBasic(props) {
  const polygons = [
    { name: "Field 1", coordinates: { x: 10, y: 20 } },
    { name: "Field 2", coordinates: { x: 30, y: 40 } },
    { name: "Field 3", coordinates: { x: 50, y: 60 } },
    { name: "Field 4", coordinates: { x: 70, y: 80 } },
    { name: "Field 5", coordinates: { x: 90, y: 100 } },
  ];
  const handleFieldClick = (fieldName) => {
    alert(`You clicked on ${fieldName}`);
  };
  const NAVIGATION = [
    {
      kind: "header",
      title: "Fields",
      sx: { userSelect: "none", cursor: "pointer" }, // Corrected cursor property
    },
    ...polygons.map((polygon) => ({
      segment: polygon.name.toLowerCase().replace(/\s+/g, "-"), // URL-friendly segment
      title: polygon.name,
      icon: <LayersIcon />,
      onClick: handleFieldClick,
    })),
  ];

  const { window } = props;

  const [pathname, setPathname] = React.useState("/dashboard");
  const [Sidebar, setSidebar] = React.useState(false);
  const [currentSegment, setCurrentSegment] = React.useState("");

  const handleTileClick = (segment) => {

      setSidebar(true);
      setCurrentSegment("Field 1");

      setPathname(`/${segment} asdfghjkl`);

  };

  const handleBackClick = () => {
    setSidebar(false); // Go back to main sidebar
  };

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <Box sx={{ display: "flex", border: "5px solid blue" }}>
      <AppProvider
        // navigation={null}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        {!Sidebar && (
          <Drawer variant="permanent" open>
          <List>
            {NAVIGATION.map((item) => (
              item.segment && (
                <ListItem button key={item.segment} onClick={() => handleTileClick(item.segment)}>
                  {item.icon}
                  <ListItemText primary={item.title} />
                </ListItem>
              )
            ))}
          </List>
        </Drawer>

        )}
        <DashboardLayout sx={{ border: "5px solid yellow" }}>

          <DemoPageContent pathname={pathname} />

          {Sidebar && (
            <Drawer
              variant="temporary"
              anchor="left"
              open={Sidebar}
              onClose={handleBackClick}
              sx={{ border: "5px solid yellow" }}
            >
              <Box sx={{ width: 320, p: 10, border: "5px solid red" }}>
                <IconButton onClick={handleBackClick}>
                  <ArrowBackIcon />
                </IconButton>

                <Typography variant="h6" sx={{ mt: 2 }}>
                  You are in
                  {currentSegment ? currentSegment : " Modal Details Page"}
                </Typography>
                <Typography variant="body1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </Typography>
              </Box>
            </Drawer>
          )}
        </DashboardLayout>
      </AppProvider>
    </Box>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
