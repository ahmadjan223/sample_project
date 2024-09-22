
import { useCentralProps } from "./centralpropscontext";

import React, { useState, useEffect } from "react";

const Bottom = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    polygonInfo,
    setPolygonInfo,
    expandedField,
    setExpandedField,
    editFieldIndex,
    setEditFieldIndex,
    editFieldName,
    setEditFieldName,
    layer,
    setLayer,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    timeRange,
    setTimeRange,
    userSelectedIndex,
    setUserSelectedIndex,
    handleLayerChange,
    temp,

    selectedDate,
    setSelectedDate,
    getDateLabel,
    dates,
    setDate,

    handleNextDates,
    handlePreviousDates,
    incrementValue,
    setIncrementValue,
    setDates
  } = useCentralProps();
  
  useEffect(() => {
    if (incrementValue !== null) { // Ensure that incrementValue is set before alerting
    //   alert(incrementValue);
    }
  }, [incrementValue]); // Dependency array with incrementValue

  const handleIntervalChange = async (event) => {
    const value = event.target.value;
    let increment;
  
    // Set increment based on the selected interval
    if (value === "Weekly") {
      increment = 7;
    } else if (value === "Fortnightly") {
      increment = 14;
    } else if (value === "Monthly") {
      increment = 28;
    }

    // Update the increment value state
    await setIncrementValue(increment); // This will trigger the useEffect above
  };

    
  
  

  return (
    <div
      style={{
        //   width: "250px",
        height: "25vh",
        // backgroundColor: "#f3f3f3",
        backgroundColor: "white",
        //   padding: "0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "15px",
        border: "4px solid #9a9a9a",
      }}
    >
      <div
        style={{
          //   marginTop: "0px",
          width: "70%",
        //   border: "1px solid black", // Corrected semicolon to a comma
        }}
      >
        <h4
          style={{ marginTop: "0px", fontWeight: "bold", textAlign: "center", fontFamily:"Times New Roman" }}
        >
          Control Bar
        </h4>

        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
          <select
            className="form-select"
            style={{
              width: "50%", // Set the width to 50%
              borderRadius: "15px",
              border: "1px solid black",
              padding: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            value={"ndvi"}
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

          <select
            className="form-select"
            style={{
              width: "50%", // Set the width to 50%
              borderRadius: "15px",
              border: "1px solid black",

              padding: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            // Add your handler for this select
            onChange={handleIntervalChange}
          >
            <option value="Monthly">Monthly</option>
            <option value="Fortnightly">Fortnightly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        <div
          style={{
            width: "100%",
            // border: "1px solid black",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 5px 5px 5px",
            boxSizing: "border-box",
            gap: "5px",
          }}
        >
          <button
            style={{
              cursor: "pointer",
              borderRadius: "15px",
              padding: "10px 7px 10px 7px",
              backgroundColor: "white",
            }}
            onClick={handlePreviousDates}
          >
            {"<"}
          </button>

          <div style={{ display: "flex", gap: "5px" }}>
            {dates.map((date, index) => (
              <button
                key={index}
                style={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  borderRadius: "15px",
                  backgroundColor:
                    selectedDate === date ? "#0e0e0e" : "#f4f4f4",
                  color: selectedDate === date ? "white" : "black",
                  textAlign: "center",
                  border: "1px solid black", // Add border to make it look like a button
                  outline: "none", // Remove the default outline on focus
                }}
                onClick={() => {
                  if (userSelectedIndex == "-1") {
                    alert("You have not selected any field from the sidebar.");
                    return;
                  }
                  setDate(date);
                //   onFieldClick(userSelectedIndex, layer, timeRange);
                }}
              >
                {getDateLabel(date)}
              </button>
            ))}
          </div>

          <button
            style={{
                cursor: "pointer",
                borderRadius: "15px",
                padding: "10px 7px 10px 7px",
                backgroundColor: "white",
              }}
            onClick={handleNextDates}
          >
            {">"}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Bottom;