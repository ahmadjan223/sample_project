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
    window.location.href = "http://localhost:3000/api/logout";
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

      {/* field */}
      <div className="field-container">
        {polygonInfo.map((field, index) => (
          <div key={field.name} className="field-item">
            <button
              className={`field-item-content ${
                selectedFieldName === field.name ? "selected" : ""
              } ${hoveredFieldIndex === index ? "hovered" : ""}`}
              onMouseEnter={() => setHoveredFieldIndex(index)}
              onMouseLeave={() => setHoveredFieldIndex(null)}
              onClick={() => setSelectedFieldName(field.name)}
            >
              <div
                className={`field-name ${
                  selectedFieldName === field.name ? "selected" : ""
                }`}
                onClick={() =>
                  setExpandedField(
                    expandedField === field.name ? null : field.name
                  )
                }
              >
                {expandedField === field.name ? "−" : "+"} {field.name}
              </div>
              {expandedField === field.name && (
                <div className="field-details">
                  {editFieldIndex ===
                  polygonInfo.findIndex((f) => f.name === field.name) ? (
                    <div>
                      {/* Input and Save/Cancel buttons can be implemented here */}
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => handleEditFieldName(field.name)}
                        className="btn btn-sm"
                        style={{ backgroundColor: "#3592fd", color: "#fafafa" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteField(field.name)}
                        className="btn btn-sm"
                        style={{ backgroundColor: "#3592fd", color: "#fafafa" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SideNav;
