import React from "react";
import "./FieldDetails.css"; // Add styling to position this component as needed

const FieldDetails = ({ fieldName, polygonInfo, goBackToSidebar }) => {
  // You can find the field data from polygonInfo if needed
  const fieldDetails = polygonInfo.find((field) => field.name === fieldName);

  return (
    <div className="sidenav-container">
      <button onClick={goBackToSidebar} className="back-button">
        Back
      </button>
      <h2>{fieldDetails?.name}</h2>
      {/* Display more detailed information here */}
      <p>Details about {fieldDetails?.path}</p>
    </div>
  );
};

export default FieldDetails;
