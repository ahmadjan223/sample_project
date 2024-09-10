import { useCentralProps } from "./centralpropscontext";

import React, { useState, useEffect } from "react";

const Bottom = ({ onFieldClick, selectedFieldIndex }) => {
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
    handleMonthClick,
    handleNextMonths,
    handlePreviousMonths,
    getMonthName,
    temp,

    selectedDate,
    setSelectedDate,
    getDateLabel,
    dates,
    setDate,

    handleNextDates,
    handlePreviousDates
  } = useCentralProps();

  return (
    <div
      style={{
        //   width: "250px",
        height: "25vh",
        backgroundColor: "#f3f3f3",
        //   padding: "0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "12px",
        border: "4px solid #9a9a9a",
      }}
    >
      <div
        style={{
          //   marginTop: "0px",
          width: "70%",
          // border: "1px solid black", // Corrected semicolon to a comma
        }}
      >
        <h6
          style={{ marginTop: "0px", fontWeight: "bold", textAlign: "center" }}
        >
          Control Bar
        </h6>
        <select
          className="form-select"
          style={{
            // border: "1px solid #ccc",
            borderRadius: "20px", // Rounded edges
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
            padding: "10px 5px 5px 5px",
            boxSizing: "border-box",
            gap: "5px",
          }}
        >
          <div
            style={{
              cursor: "pointer",
              borderRadius: "12px",
              padding: "15px 5px 15px 5px",
              backgroundColor: "white",
            }}
            onClick={handlePreviousDates}
          >
            {"<"}
          </div>

          <div style={{ display: "flex", gap: "5px" }}>
            {dates.map((date, index) => (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  borderRadius: "12px",
                  backgroundColor: selectedDate === date ? "gray" : "white",
                  color: selectedDate === date ? "white" : "black",
                  textAlign: "center",
                }}
                onClick={() => setDate(date)}
              >
                {getDateLabel(date)}
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
            onClick={handleNextDates}
          >
            {">"}
          </div>
        </div>
      </div>
      <button
        onClick={() => onFieldClick(userSelectedIndex, layer, timeRange)}
        className="btn btn-primary btn-sm"
        style={{ marginRight: "10px" }}
      >
        {userSelectedIndex === selectedFieldIndex ? "Hide Field" : "Show Field"}
      </button>
    </div>
  );
};

export default Bottom;
