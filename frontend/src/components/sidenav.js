import React, { useState, useEffect } from "react";
import "./SideNav.css";
import SideBarTiles from "./sideBarTile";
import FieldDetails from "./FieldDetails"; // Import the new component
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Toolbar from "@mui/material/Toolbar";
import LayersIcon from "@mui/icons-material/Layers";
const drawerWidth = 340;
const topBarHeight = 64;
// SideNav component
const SideNav = ({
  polygons,
  isLoaded,
  user,
  clearMap,
  selectedFieldName,
  setSelectedFieldName,

  isDrawing,
  setIsDrawing,
  DataFetch
}) => {
  const [hovered, setHovered] = useState(false);
  const handleAddField = () => {
    setIsDrawing(true);
  };
  const [polygonInfo, setPolygonInfo] = useState([]);
  const [showDetailsPage, setShowDetailsPage] = useState(false); // New state to manage page

  // Load polygons and update state when polygons change
  useEffect(() => {
    if (polygons) {
      handlePolygons();
    }
  }, [polygons]);

  // Helper function to format polygon data
  const handlePolygons = () => {
    const formattedPolygons = polygons.map((polygon, index) => ({
      index,
      name: polygon.name || `Field ${index}`, 
    }));
    setPolygonInfo(formattedPolygons);
  };

  // Handle logout
  const handleLogout = () => {
    window.location.href = "https://densefusion.vercel.appercel.app/api/logout";
  };

  // Function to open the FieldDetails page
  const openDetailsPage = (fieldName) => {
    setSelectedFieldName(fieldName);
    setShowDetailsPage(true); // Switch to the details page
  };

  // Function to go back to the SideNav
  const goBackToSidebar = () => {
    setSelectedFieldName(null);
    setShowDetailsPage(false); // Go back to sidebar
    //to set selectedFielsName to null
  };

  return (
    // <>
    //   {showDetailsPage ? (

    //     <FieldDetails
    //     fieldName={selectedFieldName}
    //     polygonInfo={polygonInfo}
    //     goBackToSidebar={goBackToSidebar} // Pass the back function to FieldDetails
    //     />
    //   ) : (
    //     <div className="sidenav-container">
    //       {/* User Info */}
    //       <div className="user-info">
    //         {user.image && (
    //           <img
    //             src={user.image}
    //             alt={`${user.displayName}'s profile`}
    //             className="user-image"
    //           />
    //         )}
    //         <div className="user-name">{user.displayName}</div>
    //         <i className="material-icons logout-icon" onClick={handleLogout}>
    //           logout
    //         </i>
    //       </div>

    //       {/* Field List */}
    //       <div className="field-container">
    //         {polygonInfo.map((field) => (
    //           <SideBarTiles
    //             key={field.name}
    //             field={field}
    //             selectedFieldName={selectedFieldName}
    //             openDetailsPage={openDetailsPage} // Pass the function to open details
    //           />
    //         ))}
    //       </div>
    //     </div>
    //   )}
    // </>
    <>
      {showDetailsPage ? (
        <FieldDetails
          polygons={polygons}
          fieldName={selectedFieldName}
          polygonInfo={polygonInfo}
          goBackToSidebar={goBackToSidebar}
          DataFetch={DataFetch} // Pass the back function to FieldDetails
        />
      ) : (
        <div style={{ width: 300, height: "70vh", position: "relative" }}>
          <div
            style={{
              width: 300,
              height: 933,
              position: "absolute",
              left: 0,
              top: 0,
              overflow: "hidden",
              background: "#181f26",
              boxShadow: "1px 0px 0px 0 #dedede",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                position: "absolute",
                left: 16,
                top: 853,
                gap: 43,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexGrow: 0,
                  flexShrink: 0,
                  position: "relative",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    flexGrow: 0,
                    flexShrink: 0,
                    width: 48,
                    height: 48,
                    position: "relative",
                    borderRadius: 38,
                    background: 'url("avatar.png")',
                    borderWidth: 1,
                    borderColor: "#e4ebfb",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flexGrow: 0,
                    flexShrink: 0,
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexGrow: 0,
                      flexShrink: 0,
                      position: "relative",
                      gap: 10,
                    }}
                  >
                    <p
                      style={{
                        flexGrow: 0,
                        flexShrink: 0,
                        fontSize: 16,
                        fontWeight: 600,
                        textAlign: "left",
                        color: "#fff",
                      }}
                    >
                      {user.displayName}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexGrow: 0,
                      flexShrink: 0,
                      position: "relative",
                      gap: 10,
                    }}
                  >
                    <p
                      style={{
                        flexGrow: 0,
                        flexShrink: 0,
                        fontSize: 14,
                        textAlign: "left",
                        color: "#708090",
                      }}
                    >
                      {user.id}
                    </p>
                  </div>
                </div>
              </div>

              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexGrow: 0, flexShrink: 0, width: 24, height: 24 }}
                preserveAspectRatio="none"
                onClick={handleAddField}
              >
                <path
                  d="M16.44 8.90002C20.04 9.21002 21.51 11.06 21.51 15.11V15.24C21.51 19.71 19.72 21.5 15.25 21.5H8.73998C4.26998 21.5 2.47998 19.71 2.47998 15.24V15.11C2.47998 11.09 3.92998 9.24002 7.46998 8.91002"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 15V3.62"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.35 5.85L12 2.5L8.65002 5.85"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 268,
                height: 54,
                position: "absolute",
                left: 16,
                top: 17,
                overflow: "hidden",
                gap: 8,
                paddingLeft: 20,
                paddingRight: 16,
                paddingTop: 12,
                paddingBottom: 12,
                borderRadius: 4,
                background: "#0d6efd",
                cursor: "pointer",
              }}
              onClick={handleAddField}
            >
              <p
                style={{
                  flexGrow: 0,
                  flexShrink: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  textAlign: "left",
                  color: "#fff",
                }}
              >
                Add Field
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: 268,
              position: "absolute",
              left: 16,
              top: 103,
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignSelf: "stretch",
                  flexGrow: 0,
                  flexShrink: 0,
                  gap: 16,
                  cursor: "pointer",
                }}
              >
                {polygonInfo.map((field) => (
                  <SideBarTiles
                    key={field.name}
                    field={field}
                    setSelectedFieldName={selectedFieldName}
                    openDetailsPage={openDetailsPage}
                    hovered={hovered}
                    setHovered={setHovered}
                    DataFetch={DataFetch}
                  ></SideBarTiles>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>

  );
};

export default SideNav;
