import React, { useState, useEffect } from "react";
import "./SideNav.css";
import SideBarTiles from "./sideBarTile";
import FieldDetails from "./FieldDetails"; // Import the new component

// SideNav component
const SideNav = ({
  polygons,
  user,
  clearMap,
  selectedFieldName,
  setSelectedFieldName,
}) => {
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
      name: polygon.name || `Field ${index}`, // Use polygon name if available
    }));
    setPolygonInfo(formattedPolygons);
  };

  // Handle logout
  const handleLogout = () => {
    window.location.href = "http://densefusion-3n10.vercel.app/api/logout";
  };

  // Function to open the FieldDetails page
  const openDetailsPage = (fieldName) => {
    setSelectedFieldName(fieldName);
    setShowDetailsPage(true); // Switch to the details page
  };

  // Function to go back to the SideNav
  const goBackToSidebar = () => {
    setShowDetailsPage(false); // Go back to sidebar
    //to set selectedFielsName to null
    setSelectedFieldName(null);
  };

  return (
    <>
      {showDetailsPage ? (
        

        <FieldDetails
        fieldName={selectedFieldName}
        polygonInfo={polygonInfo}
        goBackToSidebar={goBackToSidebar} // Pass the back function to FieldDetails
        />
      ) : ( 
        <div className="sidenav-container">
          {/* User Info */}
          <div className="user-info">
            {user.image && (
              <img
                src={user.image}
                alt={`${user.displayName}'s profile`}
                className="user-image"
              />
            )}
            <div className="user-name">{user.displayName}</div>
            <i className="material-icons logout-icon" onClick={handleLogout}>
              logout
            </i>
          </div>

          {/* Field List */}
          <div className="field-container">
            {polygonInfo.map((field) => (
              <SideBarTiles
                key={field.name}
                field={field}
                selectedFieldName={selectedFieldName}
                openDetailsPage={openDetailsPage} // Pass the function to open details
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SideNav;