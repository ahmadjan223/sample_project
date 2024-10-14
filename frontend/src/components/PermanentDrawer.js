import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LayersIcon from "@mui/icons-material/Layers";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FieldDetails from "./FieldDetails"; // Import your FieldDetails component
import { ThemeProvider, Toolbar } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const drawerWidth = 340;
const topBarHeight = 64;

const PermanentDrawer = ({
  polygons,
  user,
  selectedFieldName,
  setSelectedFieldName,
}) => {
  const [polygonInfo, setPolygonInfo] = useState([]);
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [selectedFieldCoords, setSelectedFieldCoords] = useState({});

  const handlePolygons = () => {
    const formattedPolygons = polygons.map((polygon, index) => ({
      index,
      name: polygon.name || `Field ${index}`, // Use polygon name if available
      path: polygon.path || [], // Include the path in the state
    }));
    setPolygonInfo(formattedPolygons);
  };

  useEffect(() => {
    if (polygons) {
      handlePolygons();
    }
    console.log(polygons);
  }, [polygons]);

  const handleLogout = () => {
    window.location.href = "http://localhost:3000/api/logout"; // Adjust the logout URL as needed
  };

  const getCoords = (field) => {
    const selectedPolygon = polygons.find((polygon) => polygon.name === field);
    const coordinates = selectedPolygon.path
      .map((coord) => `(${coord.lng.toFixed(1)}, ${coord.lat.toFixed(1)})`)
      .join(", ");

    if (coordinates) {
      alert(`Coordinates for ${field}: ${coordinates}`);
    }
  };

  const openDetailsPage = (field) => {
    setSelectedFieldName(field);
    console.log(selectedFieldName);
    // getCoords(field.name);
    setSelectedFieldCoords(field.coordinates);
    setShowDetailsPage(true);
  };

  const goBackToSidebar = () => {
    setSelectedFieldName(null);
    setSelectedFieldCoords({});
    setShowDetailsPage(false);
  };

  const handleDeleteField = () => {
    // Logic for deleting the field
    alert(`Field ${selectedFieldName} deleted!`);
    goBackToSidebar();
  };

  const handleEditField = () => {
    // Logic for editing the field name
    alert(`Editing field ${selectedFieldName}`);
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#2D333A",
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        {showDetailsPage ? (
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              marginTop: `${topBarHeight}px`, // Push drawer below TopBar
              
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                marginTop: `${topBarHeight}px`, // Apply margin to drawer paper
              },
            }}
            
            variant="permanent"
            anchor="left"
          >
            <div style={{ padding: "16px" }}>
              <Button
                onClick={goBackToSidebar}
                variant="outlined"
                color="inherit"
                style={{ marginBottom: "16px" }}
              >
                Back
              </Button>

              <Typography variant="h6" color="white">
                {selectedFieldName}
              </Typography>

              <Typography variant="body2" color="gray">
                Coordinates: {selectedFieldCoords}
              </Typography>

              <Button
                onClick={handleEditField}
                variant="outlined"
                color="inherit"
                style={{ marginTop: "16px" }}
              >
                Edit Field Name
              </Button>

              <Button
                onClick={handleDeleteField}
                variant="outlined"
                color="inherit"
                style={{ marginTop: "16px" }}
              >
                Delete Field
              </Button>
            </div>
          </Drawer>
        ) : (
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              marginTop: `${topBarHeight}px`, // Push drawer below TopBar
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                marginTop: `${topBarHeight}px`, // Apply margin to drawer paper
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <div style={{ padding: "16px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Avatar src="avatar.png" />
                <div>
                  <Typography variant="h6" color="white">
                    {user.displayName}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {user.id}
                  </Typography>
                </div>
                <Button onClick={handleLogout} color="inherit">
                  Logout
                </Button>
              </div>
            </div>
              <Divider />
            <List>
              {polygonInfo.map((field) => (
                <ListItem key={field.name} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      // setSelectedFieldName(field.name);
                      openDetailsPage(field.name);
                    }}
                  >
                    <ListItemIcon>
                      <LayersIcon />
                    </ListItemIcon>

                    <ListItemText primary={field.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
        )}
      </ThemeProvider>
    </>
  );
};

export default PermanentDrawer;
