import React from "react";

const Sidebar = ({ fields, onAddLocation, addingMode }) => {
  return (
    <div
      style={{ width: "300px", padding: "20px", backgroundColor: "#f1f1f1" }}
    >
      <h2>Fields</h2>
      <button onClick={onAddLocation} disabled={addingMode}>
        Add Location
      </button>
      <div>
        {fields.map((field, index) => (
          <div key={index}>
            <h3>Field {index + 1}</h3>
            <ul>
              {field.map((marker, idx) => (
                <li key={idx}>
                  Latitude: {marker.lat}, Longitude: {marker.lng}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
