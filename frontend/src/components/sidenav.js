import React, { useState, useEffect } from "react";
import "./SideNav.css";
import SideBarTiles from "./sideBarTile";

// SideNav component
const SideNav = ({
  polygons,
  user,
  clearMap,
  selectedFieldName,
  setSelectedFieldName,
}) => {
  const [polygonInfo, setPolygonInfo] = useState([]);

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

  return (
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
        {polygonInfo.map((field, index) => (
          <SideBarTiles
            key={field.name}
            field={field}
            selectedFieldName={selectedFieldName}
            setSelectedFieldName={setSelectedFieldName}
            clearMap={clearMap}
          />
        ))}
      </div>
    </div>
  );
};



export default SideNav;
