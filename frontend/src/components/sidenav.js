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
  const [selectedMonth, setSelectedMonth] = useState("Aug");

  const [polygonInfo, setPolygonInfo] = useState([]);
  const [expandedField, setExpandedField] = useState(null);
  const [editFieldIndex, setEditFieldIndex] = useState(null);
  const [editFieldName, setEditFieldName] = useState("");
  const [layer, setLayer] = useState("NDVI"); // Default value is 'NDVI'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Load polygons and synchronize state on mount or when `isLoaded` changes
  useEffect(() => {
    if (isLoaded) {
      handleLogPolygons();
    }
  });
  const handleLayerChange = (event) => {
    setLayer(event.target.value);
  };

  const [timeRange, setTimeRange] = useState("");

  const handleMonthClick = (month, year) => {
    const formattedMonth = month.toString().padStart(2, "0");
    setTimeRange(`${year}-${formattedMonth}-01/${year}-${formattedMonth}-26`);
    setSelectedMonth(month);
  };

  const handleNextMonths = () => {
    const nextMonth = currentMonth + 3;
    const nextYear = currentYear;

    if (nextMonth > 12) {
      setCurrentMonth(nextMonth - 12);
      setCurrentYear(nextYear + 1);
    } else {
      setCurrentMonth(nextMonth);
    }

    // Prevent displaying future months
    const today = new Date();
    if (
      currentYear > today.getFullYear() ||
      (currentYear === today.getFullYear() &&
        currentMonth > today.getMonth() + 1)
    ) {
      setCurrentMonth(today.getMonth() + 1);
      setCurrentYear(today.getFullYear());
    }
  };

  const handlePreviousMonths = () => {
    const prevMonth = currentMonth - 3;
    const prevYear = currentYear;

    if (prevMonth < 1) {
      setCurrentMonth(12 + prevMonth);
      setCurrentYear(prevYear - 1);
    } else {
      setCurrentMonth(prevMonth);
    }
  };

  const getMonthName = (month, year) => {
    const date = new Date(year, month - 1);

    return `${date.toLocaleString("default", { month: "short" })} ${year}`;
  };

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
  const [userSelectedIndex, setUserSelectedIndex] = useState("");
  const temp = async (index) => {
    await setUserSelectedIndex(index);
    // alert("User has selected index:" + userSelectedIndex);
  };
  {
    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  }
  {
    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  }
  {
    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  }
  {
    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  }
  {
    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  }
  {
    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  }
  {
    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  }
  {
    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  }
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

      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}

      {/* field */}
      <div
        style={{
          marginTop: "20px",
          width: "90%",
          // border: "1px solid black", // Corrected semicolon to a comma
        }}
      >
        <h6
          style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}
        >
          Control Bar
        </h6>
        <select
          className="form-select"
          style={{
            marginTop: "10px",
            // border: "1px solid #ccc",
            borderRadius: "10px", // Rounded edges
            padding: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
            // border: "1px solid black", // Corrected semicolon to a comma
          }}
          value={layer}
          onChange={handleLayerChange}
        >
          <option value="AGRICULTURE">Agriculture</option>
          <option value="BATHYMETRIC">Bathymetric</option>
          <option value="FALSE-COLOR-URBAN">False color (urban)</option>
          <option value="FALSE-COLOR">False color (vegetation)</option>
          <option value="GEOLOGY">Geology</option>
          <option value="MOISTURE-INDEX">Moisture Index</option>
          <option value="NATURAL-COLOR">Natural color (true color)</option>
          <option value="NDVI">NDVI</option>
          <option value="SWIR">SWIR</option>
          <option value="TRUE-COLOR-S2L2A">TRUE COLOR S2L2A</option>
        </select>

        <div
          style={{
            width: "100%",
            // border: "1px solid black",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 5px 10px 5px",
            boxSizing: "border-box",
             gap: "5px"
          }}
        >
          <div
            style={{
              cursor: "pointer",
              borderRadius: "12px",
              padding: "15px 5px 15px 5px",
              backgroundColor: "white",

            }}
            onClick={handlePreviousMonths}
          >
            {"<"}
          </div>

          <div style={{ display: "flex" , gap: "5px"}}>
            {[currentMonth-2, currentMonth -1, currentMonth ].map((month) => (
              <div
                key={month}
                style={{
                  cursor: "pointer",
                  padding: "5px 5px",
                  borderRadius: "12px",
                  backgroundColor:
                    selectedMonth === month ? "gray" : "white",
                  color: selectedMonth === month ? "white" : "black",
                  textAlign: "center"
                }}
                onClick={() => handleMonthClick(month, currentYear)}
              >
                {getMonthName(month, currentYear)}
              </div>
            ))}
          </div>

          <div
            style={{
              cursor: "pointer",
              borderRadius: "12px",
              padding: "15px 5px 15px 5px",
              backgroundColor: "white",

            }}
            onClick={handleNextMonths}
          >
            {">"}
          </div>
        </div>

        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px 0",
            width: "70%",
            boxSizing: "border-box", // Ensure padding is included in the width
            border: "1px solid black", // Corrected semicolon to a comma
          }}
        >
          <div style={{ display: "flex", margin: "0 10px" }}>
            <div
              style={{
                margin: "0 5px",
                cursor: "pointer",
                borderRadius: "10px", // Greyish highlight
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
              }}
              onClick={handlePreviousMonths}
            >
              {"<"}
            </div>

            {[currentMonth, currentMonth + 1, currentMonth + 2].map(
              (month, idx) => (
                <div
                  key={month}
                  style={{
                    margin: "0 5px",
                    cursor: "pointer",
                    padding: "0px 3px",
                    borderRadius: "10px", // Rounded corners
                    backgroundColor:
                      selectedMonth === month ? "#d3d3d3" : "transparent", // Greyish highlight
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
                  }}
                  onClick={() => handleMonthClick(month, currentYear)}
                >
                  {getMonthName(month, currentYear)}
                </div>
              )
            )}
          </div>
          <div
            style={{
              cursor: "pointer",
              borderRadius: "10px", // Greyish highlight
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
            }}
            onClick={handleNextMonths}
          >
            {">"}
          </div>
        </div> */}
      </div>

      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}

      <div style={{ marginTop: "20px", width: "100%" }}>
        <h6 style={{ fontWeight: "bold", textAlign: "center" }}>User Bar</h6>

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
              onClick={() => temp(field.index)}
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
                        onClick={() =>
                          onFieldClick(field.index, layer, timeRange)
                        }
                        className="btn btn-primary btn-sm"
                        style={{ marginRight: "10px" }}
                      >
                        {selectedFieldIndex === userSelectedIndex
                          ? `Hide ${layer}`
                          : `Show ${layer}`}
                      </button>
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
