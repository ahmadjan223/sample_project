import React from "react";
import "./FullPageComponent.css"; // Create and import CSS for styling

// FullPageComponent
const FullPageComponent = ({ field, goBack }) => {
  return (
    <div className="fullpage-container">
      <button className="back-button" onClick={goBack}>
        ← Back
      </button>
      <div className="fullpage-content">
        {/* Add the content for the full page here */}
        <h1>{field.name}</h1>
        <p>This is the full-page view for {field.name}.</p>
      </div>
    </div>
  );
};

export default FullPageComponent;
