import React, { useState, useEffect } from "react";
import "./SideNav.css";

const SideNav = ({
  polygons,
  isLoaded,
  user,
  resetDB,
  clearMap,
  selectedFieldName,
  setSelectedFieldName,
  onFieldClick,
}) => {
  const [hoveredFieldIndex, setHoveredFieldIndex] = useState(null);
  const [polygonInfo, setPolygonInfo] = useState([]);
  const [expandedField, setExpandedField] = useState(null);
  const [editFieldIndex, setEditFieldIndex] = useState(null);
  const [editFieldName, setEditFieldName] = useState("");

  // Load polygons and synchronize state on mount or when `isLoaded` changes
  useEffect(() => {
    if (polygons) {
      handlePolygons();
    }
  }, [polygons]);

  const handlePolygons = () => {
    console.log("handle polygon is called in navbar once data is fetched");
    const formattedPolygons = polygons.map((polygon, index) => ({
      index: index,
      name: polygon.name || `Field ${index}`, // Use polygon.name if available
    }));
    setPolygonInfo(formattedPolygons);
  };

  const handleEditFieldName = async (name) => {
    setEditFieldName(name);
    setEditFieldIndex(polygonInfo.findIndex((field) => field.name === name));

    // await loadFromDB(user.id); // Ensure latest data is loaded
    handlePolygons();
  };

  const handleDeleteField = async (name) => {
    try {
      // Call the delete endpoint with the field name
      await fetch(
        `http://localhost:3000/api/delete-field/${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        }
      );

      // Update local state after deletion
      setPolygonInfo(polygonInfo.filter((field) => field.name !== name));
      clearMap();

      // Wait for loadFromDB to finish before calling handleLogPolygons
      // await loadFromDB(user.id);
      handlePolygons();
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  const saveFieldName = async (originalName) => {
    try {
      // Update the local state
      const updatedPolygons = polygonInfo.map((field) =>
        field.name === originalName ? { ...field, name: editFieldName } : field
      );
      setPolygonInfo(updatedPolygons);
      setEditFieldIndex(null);

      // Send the updated name to the server
      await fetch(
        `http://localhost:3000/api/update-field/${encodeURIComponent(
          originalName
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editFieldName }),
        }
      );

      // Wait for loadFromDB to finish before calling handleLogPolygons
      // await loadFromDB(user.id);
      handlePolygons();
    } catch (error) {
      console.error("Error updating field name:", error);
    }
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:3000/api/logout";
  };

  return (
    <div className="sidenav-container">
      {/* user info */}
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
        ))}
      </div>
    </div>
  );
};

export default SideNav;
