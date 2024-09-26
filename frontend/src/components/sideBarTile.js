import { useState } from "react";

const SideBarTiles = ({
  field,
  selectedFieldName,
  openDetailsPage, // Pass down the openDetailsPage function
}) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const onClickField = (fieldName) => {
    openDetailsPage(fieldName); // Call the function to open the details page
  };

  return (
    <div className="field-item">
      <button
        className="field-item-content selected"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClickField(field.name)} // Handle click to select field
      >
        <div
          className={`field-name ${
            selectedFieldName === field.name ? "selected" : ""
          }`}
        >
          {field.name}
        </div>
      </button>
    </div>
  );
};

export default SideBarTiles;
