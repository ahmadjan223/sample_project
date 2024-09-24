import React from "react";
import "./FullPageComponent.css"; // Create and import CSS for styling

// FullPageComponent
const FullPageComponent = ({ field, goBack }) => {
  return (
    <div>{field} hello jee</div>
    // <button onClick={()=>{goBack()}}> hello jee mein button hu</button>
  );
};

export default FullPageComponent;
