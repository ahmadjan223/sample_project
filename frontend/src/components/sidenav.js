import React, { useState } from "react";

const Sidenav = ({ logPolygons, resetDB, sendToDb, loadFromDB, clearMap, selectedFieldIndex, onFieldClick }) => {
  const [polygonInfo, setPolygonInfo] = useState([]);
  const [expandedField, setExpandedField] = useState(null);
  const [editFieldIndex, setEditFieldIndex] = useState(null);
  const [editFieldName, setEditFieldName] = useState("");

  const onLoadFromDB = () => {
    loadFromDB();
    handleLogPolygons();
  }

  const handleLogPolygons = () => {
    const polygons = logPolygons();
    const formattedPolygons = polygons.map((polygon, index) => ({
      index: index + 1,
      name: polygon.name || `Field ${index + 1}`, // Use polygon.name if available
    }));
    setPolygonInfo(formattedPolygons);
  };
  const handleEditFieldName = (name) => {
    setEditFieldName(name);
    setEditFieldIndex(polygonInfo.findIndex(field => field.name === name));

};

const handleDeleteField = async (name) => {
    try {
        // Call the delete endpoint with the field name
        await fetch(`http://localhost:3000/api/delete-field/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        setPolygonInfo(polygonInfo.filter(field => field.name !== name));
        clearMap();
    } catch (error) {
        console.error('Error deleting field:', error);
    }
    handleLogPolygons();
};

const saveFieldName = async (originalName) => {

    try {
        // Update the local state
        const updatedPolygons = polygonInfo.map(field =>
            field.name === originalName ? { ...field, name: editFieldName } : field
        );
        setPolygonInfo(updatedPolygons);
        setEditFieldIndex(null);

        // Send the updated name to the server
        await fetch(`http://localhost:3000/api/update-field/${encodeURIComponent(originalName)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: editFieldName }),
        });
    } catch (error) {
        console.error('Error updating field name:', error);
    }
    handleLogPolygons();
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
      <button onClick={handleLogPolygons} style={{ margin: "5px" }}>Log Polygons</button>
      <button onClick={resetDB} style={{ margin: "5px" }}>Reset DB</button>
      <button onClick={onLoadFromDB} style={{ margin: "5px" }}>Load From DB</button>
      <button onClick={clearMap} style={{ margin: "5px" }}>Clear Map</button>
      <div style={{ marginTop: "20px", width: "100%" }}>
        {polygonInfo.map((field) => (
          <div key={field.name} style={{ marginBottom: "10px" }}>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                backgroundColor: selectedFieldIndex === field.name ? "#e0e0e0" : "#fff",
                cursor: "pointer",
              }}
              onClick={() => onFieldClick(field.name)}
            >
              <div
                style={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={() => setExpandedField(expandedField === field.name ? null : field.name)}
              >
                {expandedField === field.name ? "−" : "+"} {field.name}
              </div>
              {expandedField === field.name && (
                <div style={{ marginTop: "10px" }}>
                  {editFieldIndex === polygonInfo.findIndex(f => f.name === field.name) ? (
                    <div>
                      <input
                        type="text"
                        value={editFieldName}
                        onChange={(e) => setEditFieldName(e.target.value)}
                        style={{ marginRight: "10px" }}
                      />
                      <button onClick={() => saveFieldName(field.name)} style={{ marginRight: "5px" }}>Save</button>
                      <button onClick={() => setEditFieldIndex(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => handleEditFieldName(field.name)} style={{ marginRight: "10px" }}>Edit</button>
                      <button onClick={() => handleDeleteField(field.name)}>Delete</button>
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
