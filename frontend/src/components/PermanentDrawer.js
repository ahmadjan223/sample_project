import DetailsDrawer from "./DetailsDrawer"; // Adjust the path as necessary
import SearchBar from "@mkyy/mui-search-bar";

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
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import InputLabel from "@mui/material/InputLabel";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TypeSearch from "./Search.tsx";

import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const drawerWidth = 340;
const topBarHeight = 64;

const PermanentDrawer = ({
  polygons,
  user,
  selectedFieldName,
  setSelectedFieldName,
  DataFetch,
  setIsDrawing,
  setSnackBarOpen,
  addField,
  setAddField,
  mapType,
  setMapType,
  theme,
  setTheme,
}) => {
  const [polygonInfo, setPolygonInfo] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFieldCoords, setSelectedFieldCoords] = useState();

  const [textFieldValue, setTextFieldValue] = useState(null);
  const handleSearch = () => {
    const trimmedValue = textFieldValue.trim(); // Trim whitespace
    const polygonExists = polygonInfo.some(
      (field) => field.name === trimmedValue
    );
    if (polygonExists) {
      setSelectedFieldName(trimmedValue);
    } else {
      // alert("Polygon not found");
    }
  };

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

  useEffect(() => {
    if (selectedFieldName) {
      getCoords(selectedFieldName);
      setOpen(true);
    }
  }, [selectedFieldName]);

  useEffect(() => {
    if (selectedFieldCoords) {
      // alert("COORDS ARE:: " + selectedFieldCoords)
    }
  }, [selectedFieldCoords]);

  const handleLogout = () => {
    window.location.href = "https://densefusion.vercel.app/api/logout"; // Adjust the logout URL as needed
  };

  const getCoords = (field) => {
    const selectedPolygon = polygons.find(
      (polygon) => polygon.name == selectedFieldName
    );
    const coordinates = selectedPolygon.path
      .map((coord) => `(${coord.lng.toFixed(1)}, ${coord.lat.toFixed(1)})`)
      .join(", ");
    // alert(coordinates);
    setSelectedFieldCoords(coordinates);
  };

  const openDetailsPage = (field) => {
    setSelectedFieldName(field);
  };

  const goBackToSidebar = () => {
    setSelectedFieldName(null);
    setSelectedFieldCoords(null);
    setOpen(false);
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

  const handleAddField = () => {
    setAddField(!addField);
    setSnackBarOpen(true);
    setIsDrawing(true);
  };

  const handleCancelField = () => {
    setAddField(!addField);
    setSnackBarOpen(false);
    setIsDrawing(false);
  };

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked)
  };

  useEffect(
    ()=>{
      // alert(`checked is set to ${checked}`)
      if (checked){
        setMapType("SATELLITE")
      }
      else{
        setMapType("ROADMAP")
      }

    },[checked]
  )

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#65C466",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
            backgroundColor: "#31c58d",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

  return (
    <>
      <ThemeProvider theme={theme}>
        <DetailsDrawer
          open={open}
          setOpen={setOpen}
          drawerWidth={drawerWidth}
          topBarHeight={topBarHeight}
          goBackToSidebar={goBackToSidebar}
          selectedFieldName={selectedFieldName}
          setSelectedFieldName={setSelectedFieldName}
          selectedFieldCoords={selectedFieldCoords}
          handleEditField={handleEditField}
          DataFetch={DataFetch}
          polygons={polygons}
          polygonInfo={polygonInfo}
          setPolygonInfo={setPolygonInfo}
          theme={theme}
        />

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            marginTop: `${topBarHeight}px`, // Push drawer below TopBar
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              marginTop: `${topBarHeight}px`, // Apply margin to drawer paper
              backgroundColor: (theme) => theme.palette.primary.main,
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {/* top div */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "92%",
            }}
          >
            {/* 001 FUNCTIONALITY */}
            <div style={{ border: "0px solid red" }}>
              {/* 1. ADD FIELD BUTTON */}
              <div style={{ border: "0px solid yellow" }}>
                {addField ? (
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "#31c58d",
                      width: "calc(100% - 32px)", // Adjust width to account for right margin
                      height: "48px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      margin: "16px",
                    }}
                    onClick={handleAddField}
                    variant="contained"
                  >
                    Add new Field
                  </Button>
                ) : (
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "red",
                      width: "calc(100% - 32px)", // Adjust width to account for right margin
                      height: "48px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      margin: "16px",
                    }}
                    onClick={handleCancelField}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                )}
              </div>
              {/*________________ */}

              {/* 2. Search */}
              <div
                style={{
                  width: "calc(100%)", // Adjust width to account for right margin
                  height: "48px",
                  border: "0px solid blue",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <SearchBar
                  style={{
                    backgroundColor: theme.palette.secondary.main, // Corrected the typo
                    color: theme.palette.secondary.contrastText,
                  }}
                  placeholder="Search a field"
                  value={textFieldValue}
                  onChange={(newValue) => {
                    setTextFieldValue(newValue);

                    // Check if the new value matches any polygon name and set it
                    const match = polygonInfo.find(
                      (field) => field.name === textFieldValue
                    );
                    if (match) {
                      setSelectedFieldName(match.name); // Update to selected option if found
                    }
                  }}
                  onSearch={handleSearch}
                  onCancelResearch={() => setTextFieldValue("")} // Clear search on cancel
                  options={polygonInfo.map((field) => field.name)} // Provide polygon names as autocomplete options
                />
              </div>
              {/* ______________--- */}

              {/* 3. FIELDS */}
              <Divider></Divider>
              <div style={{ border: "0px solid orange" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // border: "2px solid white",
                  }}
                >
                  <div
                    style={{
                      // border: "2px solid pink",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h6" component="div">
                      User Fields
                    </Typography>
                  </div>
                  <div
                    style={{
                      // border: "2px solid pink",
                      textAlign: "right",
                      width: "100%",
                    }}
                  >
                    <FormControlLabel
                      control={<IOSSwitch sx={{ m: 0 }} />}
                      label=" Satellite Mode"
                      onChange={handleChange}
                      checked={checked}
                    />
                  </div>
                </div>
                <Divider></Divider>

                {/* List of Items */}
                <List>
                  {polygonInfo.map((field) => (
                    <ListItem key={field.name} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          openDetailsPage(field.name);
                        }}
                      >
                        <ListItemIcon>
                          <LayersIcon />
                        </ListItemIcon>

                        <ListItemText variant="h5" primary={field.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </div>
              {/*________________ */}
            </div>
            {/*________________ */}

            {/*002 USER DETAILS*/}
            <div>
              {/* 1. INFO*/}
              <div
                style={{
                  padding: "16px",
                  border: "0px solid purple",
                  borderRadius: "16px 16px 0px 0px", // Ensures the container takes the full height of the sidebar
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    border: "0px solid green",
                  }}
                >
                  <Avatar src="avatar.png" />
                  <div>
                    <Typography variant="h6" component="div">
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
            </div>
            {/*________________ */}
          </div>
        </Drawer>
      </ThemeProvider>
    </>
  );
};

export default PermanentDrawer;
