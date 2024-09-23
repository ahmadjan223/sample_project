import React, { useState, useEffect } from "react";

const BottomBar = ({ layer, date, setDate, setLayer, selectedFieldName }) => {
  const [hoveredDateIndex, setHoveredDateIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const styles = {
    bottomBar: {
      position: "absolute",
      bottom: 0,
      width: "83.7%",
      padding: "20px",
      // backgroundColor: "transparent",
      backgroundColor: "#212930",
      // boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
      // borderTop: "5px solid #00000",
      display: "flex",
      flexDirection: "column", // Stack elements vertically
      alignItems: "center", // Center align the items
    },

    selectorsContainer: {
      display: "flex",
      // justifyContent: "", // Space the selectors
      width: "50%", // Ensure it takes full width
      marginBottom: "10px", // Space between selectors and date navigator
      gap: "10px", // Add space between selectors
      // backgroundColor: "red",
      // color: "yellow",
    },

    dropdownMenu: {
      padding: "8px",
      fontSize: 
      "16px",
      backgroundColor: "#111418",
      color: "#fafafa",
    },
    
    dateContainer: {
      width: "80%",
      // border: "2px solid black",
      borderRadius: "0px",
      display: "flex",
      alignItems: "center",
      padding: "0px",
      boxSizing: "border-box",
      gap: "0px",
      marginTop: "10px", // Add space above the date navigator
    },

    dateNav: {
      cursor: "pointer",
      borderRadius: "0px",
      padding: "5px 4px",
      border: "1px solid black", // Add border to make it look like a button

      backgroundColor: "#111418",
      color: "#fafafa",
    },

    dateTile: (isSelected, isHovered) => ({
      cursor: "pointer",
      borderRadius: "0px",
      padding: "5px 4px",
      backgroundColor: isSelected
        ? "#192c45"
        : isHovered
        ? "#323d48"
        : "#111418",
      // // backgroundColor: isHovered ? "#323d48":"#111418",
      // backgroundColor: selectedDate === date ? "#192c45" : "#111418",
      color: isSelected ? "#338cf3" : "#fafafa",
      textAlign: "center",
      border: "1px solid black", // Add border to make it look like a button
      outline: "none", // Remove the default outline on focus
    }),
  };

  const [incrementValue, setIncrementValue] = useState(30);
  const initDays = 30;
  const dateCount = 12;
  const [dates, setDates] = useState([]);
  const [userSelectedIndex, setUserSelectedIndex] = useState("-1");
  const [timeRange, setTimeRange] = useState("");

  // Function to handle date selection
  const handleDate = async (date) => {
    await setSelectedDate(date);
    // alert(date); // This will show the correct date

    // The next alert will show the old value of selectedDate
    // So we won't use it immediately here
    const inputDate = new Date(date);
    const DaysBefore = new Date(inputDate);
    DaysBefore.setDate(inputDate.getDate() - incrementValue);
    const formattedDate = `${format(DaysBefore)}/${format(inputDate)}`;
    setDate(formattedDate);
  };

  // Use an effect to alert when selectedDate changes
  // useEffect(() => {
  //   if (selectedDate) {
  //     alert(selectedDate); // This will show the updated selectedDate
  //   }
  // }, [selectedDate]);

  const format = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to get date label
  const getDateLabel = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const years = date.getFullYear();
    let year = years
    if (year > 2000) {
      year = year - 2000;
    } else {
      year = year - 1900;
    }
    return (
      <>
        {day} {month}'{year}
      </>
    );
  };

  // Functions to navigate through dates
  const handleNextDates = () => {
    setDates((prevDates) => {
      const benchmarkDate = new Date();
      benchmarkDate.setDate(benchmarkDate.getDate() - initDays);
      const newDates = [...prevDates];
      const lastDate = new Date(newDates[newDates.length - 1]);
      const newDate = new Date(lastDate);
      newDate.setDate(lastDate.getDate() + incrementValue);

      if (newDate > benchmarkDate) {
        alert("Can't go beyond the benchmark date.");
        return prevDates;
      }

      newDates.push(newDate);
      newDates.shift();
      return newDates;
    });
  };

  const handlePreviousDates = () => {
    setDates((prevDates) => {
      const newDates = [...prevDates];
      const firstDate = new Date(newDates[0]);
      firstDate.setDate(firstDate.getDate() - incrementValue);
      newDates.unshift(firstDate);
      newDates.pop();
      return newDates;
    });
  };
  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() - initDays);

      const dateArray = [];
      for (let i = 0; i < dateCount; i++) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() - incrementValue);
      }
      dateArray.reverse();
      setDates(dateArray);
      // setSelectedDate(dateArray[0]); // Set the default selected date
    };

    generateDates();
  }, [incrementValue]);

  return (
    <div style={styles.bottomBar}>
      {/* Selectors Container */}
      <div style={styles.selectorsContainer}>

        <select
          value={layer}
          onChange={(e) => {
            setLayer(e.target.value);
            console.log("Layer value is changed");
          }}
          className="form-select"

          style={styles.dropdownMenu}
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

        {/* Additional Selector */}
        <select
            className="form-select"
            style={styles.dropdownMenu
            //   {
            //   width: "50%", // Set the width to 50%
            //   borderRadius: "15px",
            //   border: "1px solid black",

            //   padding: "5px",
            //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            // }
          }
            // Add your handler for this select
            // onChange={handleIntervalChange}
          >
            <option value="Monthly">Monthly</option>
            <option value="Fortnightly">Fortnightly</option>
            <option value="Weekly">Weekly</option>
          </select>
      </div>

      {/* Date Navigator */}
      <div className = "d-flex" style={styles.dateContainer} >
        <button style={styles.dateNav} onClick={handlePreviousDates}>
          {"<"}
        </button>

        <div style={{ display: "flex", gap: "0px" }}>
          {dates.map((date, index) => (
            <button
              key={index}
              style={styles.dateTile(
                selectedDate === date,
                hoveredDateIndex === index
              )}
              onMouseEnter={() => setHoveredDateIndex(index)}
              onMouseLeave={() => setHoveredDateIndex(null)}
              onClick={() => {
                if (selectedFieldName == null) {
                  alert("You have not selected any field from the sidebar.");
                  return;
                }
                handleDate(date);
              }}
            >
              {getDateLabel(date)}
            </button>
          ))}
        </div>

        <button style={styles.dateNav} onClick={handleNextDates}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
