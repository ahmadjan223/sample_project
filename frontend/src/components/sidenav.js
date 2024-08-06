import React, { useState, useEffect } from "react";
const Sidenav = ({
  user,
  logPolygons,
  resetDB,
  loadFromDB,
  clearMap,
  selectedFieldIndex,
  onFieldClick,
  isLoaded,
}) => {
  const [polygonInfo, setPolygonInfo] = useState([]);
  const [expandedField, setExpandedField] = useState(null);
  const [editFieldIndex, setEditFieldIndex] = useState(null);
  const [editFieldName, setEditFieldName] = useState("");

  // Load polygons and synchronize state on mount or when `isLoaded` changes
  useEffect(() => {
    if (isLoaded) {
      handleLogPolygons();
    }
  },);

  const handleLogPolygons = () => {
    const polygons = logPolygons();
    const formattedPolygons = polygons.map((polygon, index) => ({
      index: index,
      name: polygon.name || `Field ${index}`, // Use polygon.name if available
    }));
    setPolygonInfo(formattedPolygons);
  };

  const handleEditFieldName = async (name) => {
    setEditFieldName(name);
    setEditFieldIndex(polygonInfo.findIndex((field) => field.name === name));

    await loadFromDB(user.id); // Ensure latest data is loaded
    handleLogPolygons();
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
      await loadFromDB(user.id);
      handleLogPolygons();
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
        `http://localhost:3000/api/update-field/${encodeURIComponent(originalName)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editFieldName }),
        }
      );
  
      // Wait for loadFromDB to finish before calling handleLogPolygons
      await loadFromDB(user.id);
      handleLogPolygons();
    } catch (error) {
      console.error("Error updating field name:", error);
    }
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:3000/api/logout";
  };
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* user info */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#e0e0e0",
          padding: "10px",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        {user.image && (
          <img
            src={user.image}
            alt={`${user.displayName}'s profile`}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
        )}
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
          {user.displayName}
        </div>
        {/* <div style={{ color: "#888" }}>ID: {user.id}</div> */}
        <i
          className="material-icons"
          onClick={handleLogout}
          style={{
            fontSize: "24px",
            cursor: "pointer",
            color: "#f44336",
          }}
        >
          logout
        </i>
      </div>
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    width: "80%",
    marginTop: "20px", // Space from the top
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px", // Space between the boxes
    }}
  >
    {/* <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dddddd", // Background color for the box
        borderRadius: "10px", // Rounded corners
        padding: "5px", // Space inside the box
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)", // Shadow
        height: "40px"
      }}
    >
      <i
        onClick={handleLogPolygons}
        style={{
          fontSize: "18px", // Smaller icon size
          cursor: "pointer",
          color: "#111111",
        }}
      >
        +
      </i>
    </div> */}

    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dddddd", // Background color for the box
        borderRadius: "10px", // Rounded corners
        padding: "5px", // Space inside the box
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)", // Shadow
      }}
    >
      {/* <i
        className="material-icons"
        onClick={handleLogPolygons}
        style={{
          fontSize: "18px", // Smaller icon size
          cursor: "pointer",
          color: "#111111",
        }}
      >
        refresh
      </i> */}
    </div>
  </div>
</div>


      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}

      {/* field */}
      <div style={{ marginTop: "20px", width: "100%" }}>
        {polygonInfo.map((field) => (
          <div key={field.name} style={{ marginBottom: "10px" }}>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "15px", // Rounded edges
                padding: "10px",
                backgroundColor:
                  selectedFieldIndex === field.index ? "#e0e0e0" : "#fff",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
              }}
              onClick={() => onFieldClick(field.index)}
            >
              <div
                style={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={() =>
                  setExpandedField(
                    expandedField === field.name ? null : field.name
                  )
                }
              >
                {expandedField === field.name ? "−" : "+"} {field.name}
              </div>
              {expandedField === field.name && (
                <div style={{ marginTop: "10px" }}>
                  {editFieldIndex ===
                  polygonInfo.findIndex((f) => f.name === field.name) ? (
                    <div>
                      <input
                        type="text"
                        value={editFieldName}
                        onChange={(e) => setEditFieldName(e.target.value)}
                        style={{ marginRight: "10px", padding: "5px" }}
                      />
                      <button
                        onClick={() => saveFieldName(field.name)}
                        className="btn btn-primary btn-sm" // Smaller button
                        style={{ marginRight: "5px" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditFieldIndex(null)}
                        className="btn btn-secondary btn-sm" // Smaller button
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => handleEditFieldName(field.name)}
                        className="btn btn-warning btn-sm" // Smaller button
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteField(field.name)}
                        className="btn btn-danger btn-sm" // Smaller button
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* buttons */}
      {/* <button
        onClick={handleLogPolygons}
        className="btn btn-primary"
        style={{ margin: "5px" }}
      >
        Load
      </button> */}
      {/* 
      <button
        onClick={handleLogout}
        className="btn btn-danger"
        style={{ margin: "5px" }}
      >
        Logout
      </button> */}
    </div>
  );
};

export default Sidenav;
