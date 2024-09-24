import { useState } from "react";

 
 const SideBarTiles = ({ field, selectedFieldName, setSelectedFieldName, clearMap,handleShowFullPage }) => {
    const [hovered, setHovered] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [editFieldIndex, setEditFieldIndex] = useState(null);
    const [editFieldName, setEditFieldName] = useState("");
    // Edit field name
    const handleEditFieldName = (name) => {
      setEditFieldName(name);
      setEditFieldIndex(field.index);
    };
  
    // Delete field by name
    const handleDeleteField = async (name) => {
      try {
        await fetch(
          `http://localhost:3000/api/delete-field/${encodeURIComponent(name)}`,
          { method: "DELETE" }
        );
        clearMap(); // Call clearMap after deletion
      } catch (error) {
        console.error("Error deleting field:", error);
      }
    };
  
    return (
      <div key={field.name} className="field-item">
        <button
          className={`field-item-content ${
            selectedFieldName === field.name ? "selected" : ""
          } ${hovered ? "hovered" : ""}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setSelectedFieldName(field.name)}
        >
          {/* Field Name with Expand/Collapse */}
          <div
            className={`field-name ${
              selectedFieldName === field.name ? "selected" : ""
            }`}
            onClick={() => {
                setExpanded(!expanded)}}
          >
            {expanded ? "−" : "+"} {field.name}
          </div>
  
          {/* Expanded Field Options */}
          {expanded && (
            <div className="field-details">
              {editFieldIndex === field.index ? (
                <div>
                  {/* Placeholder for Input and Save/Cancel buttons */}
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
    );
  };
export default SideBarTiles;