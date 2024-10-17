import React from "react";
import "./FieldDetails.css"; // Add styling to position this component as needed

const FieldDetails = ({
  polygons,
  fieldName,
  polygonInfo,
  goBackToSidebar,
  DataFetch
}) => {
  // You can find the field data from polygonInfo if needed
  const fieldDetails = polygonInfo.find((field) => field.name === fieldName);
  const selectedPolygon = polygons.find(
    (polygon) => polygon.name === fieldName
  );
  const coordinates = selectedPolygon.path
    .map((coord) => `(${coord.lng.toFixed(1)}, ${coord.lat.toFixed(1)})`)
    .join(", ");

  const handleDelete = async (name) => {
    try {
      // Call the delete endpoint with the field name
      await fetch(
        `http://localhost:3000/api/delete-field/${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        }
      );
      DataFetch();
      goBackToSidebar();
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };
  const handleRename = async (name) => {
    alert('asdfghjkl')
  };
  return (
    <div>
      {/* <button onClick={goBackToSidebar} className="back-button">
        Back
      </button>
      <h2>{fieldDetails?.name}</h2>
      {/* Display more detailed information here */}
      {/* <p>Details about {fieldDetails?.path}</p> */}

      <div style={{ width: 300, height: 933, position: "relative" }}>
        {/* BACK BUTTON */}
        <div
          style={{
            width: 300,
            height: 933,
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "hidden",
            background: "#323d48",
            boxShadow: "1px 0px 0px 0 #dedede",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 40,
              position: "absolute",
              left: 16,
              top: 17,
              overflow: "hidden",
              gap: 8,
              // paddingLeft: 20,
              // paddingRight: 20,
              // paddingTop: 12,
              // paddingBottom: 12,
              borderRadius: 4,
              background: "#31c58d",
            }}
            onClick={goBackToSidebar}
          >
            <p
              style={{
                flexGrow: 0,
                flexShrink: 0,
                fontSize: 18,
                fontWeight: 700,
                textAlign: "left",
                color: "#fff",
              }}
            >
              Back
            </p>
          </div>
        </div>
        {/* DETAILS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: 268,
            position: "absolute",
            left: 16,
            top: 103,
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch",
              flexGrow: 0,
              flexShrink: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexGrow: 0,
                flexShrink: 0,
                height: 40,
                width: 220,
                gap: 6,
                color: "#fafafa",
              }}
            >
              <h2>{fieldDetails?.name}</h2>
              <p>{coordinates}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 450 }}>
            <button className="btn btn-primary" onClick={handleRename}>
              Rename Field
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleDelete(fieldName)}            >
              Delete Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetails;