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

  const onLoadFromDB = () => {
    loadFromDB(user.id);  // Pass user.id to loadFromDB
  };
  useEffect(() => {
    if (isLoaded) {
      handleLogPolygons();
    }
  }, [isLoaded]);

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

    await loadFromDB(user.id);  // Pass user.id to loadFromDB
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
      setPolygonInfo(polygonInfo.filter((field) => field.name !== name));
      clearMap();
    } catch (error) {
      console.error("Error deleting field:", error);
    }    
    loadFromDB(user.id);  // Pass user.id to loadFromDB
    handleLogPolygons();
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
    } catch (error) {
      console.error("Error updating field name:", error);
    }    
    loadFromDB(user.id);  // Pass user.id to loadFromDB
    handleLogPolygons();
  };
  const handleLogout = () => {
    window.location.href = 'http://localhost:3000/api/logout'; 
  };

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
        <div style={{ color: "#888" }}>ID: {user.id}</div>
      </div>

      <button onClick={handleLogPolygons} style={{ margin: "5px" }}>
        Refresh
      </button>
      {/* <button onClick={() => resetDB(user.id)} style={{ margin: "5px" }}>
        Reset DB
      </button> */}
      {/* <button onClick={onLoadFromDB} style={{ margin: "5px" }}>
        Load From DB
      </button> */}
      {/* <button onClick={clearMap} style={{ margin: "5px" }}>
        Clear Map
      </button> */}
      <button onClick={handleLogout} style={{ margin: "5px" }}>
        Logout
      </button>

      <div style={{ marginTop: "20px", width: "100%" }}>
        {polygonInfo.map((field) => (
          <div key={field.name} style={{ marginBottom: "10px" }}>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                backgroundColor:
                  selectedFieldIndex === field.index ? "#e0e0e0" : "#fff",
                cursor: "pointer",
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
                        style={{ marginRight: "10px" }}
                      />
                      <button
                        onClick={() => saveFieldName(field.name)}
                        style={{ marginRight: "5px" }}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditFieldIndex(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => handleEditFieldName(field.name)}
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteField(field.name)}>
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
    </div>
  );
};

export default Sidenav;
