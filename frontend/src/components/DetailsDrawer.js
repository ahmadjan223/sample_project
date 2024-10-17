import React from "react";
import { useState, useEffect } from "react";

import { Drawer, Button, Typography, Divider, Input } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ThemeContext, ThemeProvider } from "@emotion/react";

const DetailsDrawer = ({
  drawerWidth,
  topBarHeight,
  goBackToSidebar,
  selectedFieldName,
  setSelectedFieldName,
  selectedFieldCoords,
  handleEditField,
  DataFetch,
  polygons,
  open,
  setOpen,
  polygonInfo,
  setPolygonInfo,
  theme
}) => {
  const [editFieldName, setEditFieldName] = useState(null);

  const handleEdit = async (name) => {
    await setSelectedFieldName("Field 2");
  };
  const handleDelete = async (name) => {
    try {
      // Call the delete endpoint with the field name
      await fetch(
        `https://densefusion.vercel.app/api/delete-field/${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        }
      );
      DataFetch();
      goBackToSidebar();
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  const handleChange = (name) => {
    setSelectedFieldName(name);
  };

  const saveFieldName = async (newName) => {
    console.log("updating the field name")
    try {
      // Update the local state with the new name
      const updatedPolygons = polygonInfo.map((field) =>
        field.name === editFieldName ? { ...field, name: newName } : field
      );
      setPolygonInfo(updatedPolygons);
      console.log("changes made locally")
  
      // Send the updated name to the server
      await fetch(
        `https://densefusion.vercel.app/api/update-field/${encodeURIComponent(editFieldName)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );
  
      await DataFetch();
      console.log("changes made backend")

      setSelectedFieldName(newName);
    } catch (error) {
      console.error("Error updating field name:", error);
    }
  };
  
  // const saveFieldName = async (originalName) => {
  //   try {
  //     // Update the local state
  //     const updatedPolygons = polygonInfo.map((field) =>
  //       field.name === originalName ? { ...field, name: editFieldName } : field
  //     );
  //     setPolygonInfo(updatedPolygons);
  //     setEditFieldIndex(null);

  //     // Send the updated name to the server
  //     await fetch(
  //       `https://densefusion.vercel.app/api/update-field/${encodeURIComponent(originalName)}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ name: editFieldName }),
  //       }
  //     );

  //     // Wait for loadFromDB to finish before calling handleLogPolygons
  //     await loadFromDB(user.id);
  //     handleLogPolygons();
  //   } catch (error) {
  //     console.error("Error updating field name:", error);
  //   }
  // };

  useEffect(() => {
    if (editFieldName) {
      const newName = prompt("Enter new name for the field: ");
      if (newName ==null){
        setEditFieldName(null);
      }
      else{
        saveFieldName(newName)
        //call the function saveFieldName that handles the 
        //code to update local names, and then sending the names to db, and then laoding the names from db
        setEditFieldName(null);
      }

    }
  }, [editFieldName]);

  const handleEditFieldName = (name) => {
    setEditFieldName(name);
  };

  return (
    <ThemeProvider theme={theme}>

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
      variant="temporary"
      anchor="left"
      open={open}
      ModalProps={{ hideBackdrop: true }}
    >
      <div
        style={{
          padding: "32px",

          //NEW
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={goBackToSidebar}
              variant="outlined"
              color="inherit"
              style={{ marginBottom: "32px" }}
            >
              Back
            </Button>

            <FormControl
              variant="standard"
              sx={{ minWidth: 120, marginBottom: "16px" }}
            >
              <InputLabel id="demo-simple-select-standard-label" >
                Current Field
              </InputLabel>

              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedFieldName} // Use selectedFieldName as the value for the select
                onChange={(event) => handleChange(event.target.value)}
                label="Field"
              >
                <MenuItem value={selectedFieldName}>
                  <em>{selectedFieldName}</em>
                </MenuItem>
                {polygonInfo.map(
                  (field) =>
                    field.name !== selectedFieldName && (
                      <MenuItem value={field.name} key={field.name}>
                        {field.name}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </div>

          <Divider />

          <Typography
            variant="h5"
            color="white"
            style={{ marginBottom: "16px", border: "2px solid  transparent" }}
          >
            {selectedFieldName}
          </Typography>

          {/* <Divider /> */}

          {/* <Typography
            variant="body2"
            color="gray"
            style={{ border: "2px solid transparent" }}
          >
            Coordinates: {selectedFieldCoords}
          </Typography> */}
          <div>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                {/* <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 16 }}
              >
                {selectedFieldName} Notes
              </Typography> */}

                <Typography variant="h6" component="div">
                  Coordinates{" "}
                </Typography>

                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                  {selectedFieldCoords}
                </Typography>

                {/* <Typography variant="body2">
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.{" "}
              </Typography> */}
              </CardContent>
            </Card>
          </div>
          <Divider />
        </div>

        {/*  Field Note*/}
        <div>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 16 }}
              >
                {selectedFieldName} Notes
              </Typography>

              {/* <Typography variant="h5" component="div">
                Lorem Ipsum
              </Typography> */}

              {/* <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                adjective
              </Typography> */}

              <Typography variant="body2">
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.{" "}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined" color="inherit">
                + Add Note
              </Button>
            </CardActions>
          </Card>
        </div>

        {/* This div wraps the buttons to place them at the bottom */}
        <div
          style={{
            marginBottom: "48px",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            border: "2px solid  transparent",
          }}
        >
          {/* Add margin to create space above the bottom */}
          <Button
            onClick={() => handleEditFieldName(selectedFieldName)} // Correct usage
            variant="outlined"
            color="inherit"
            style={{ marginTop: "16px" }}
          >
            Edit Name
          </Button>
          <Button
            onClick={() => handleDelete(selectedFieldName)} // Correct usage
            variant="outlined"
            color="inherit"
            style={{ marginTop: "16px" }}
          >
            Delete Field
          </Button>
        </div>
      </div>
    </Drawer>
    </ThemeProvider>

  );
};

export default DetailsDrawer;
