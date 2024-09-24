import React, { useState, useEffect } from "react";
import styles from "./BottomBarStyle"; // Adjust the path as needed

const BottomBar = ({ layer, date, setDate, setLayer, selectedFieldName }) => {
  const [hoveredDateIndex, setHoveredDateIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

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
    let year = years;
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
    <div style={styles.bottomBar}>
      {/* Selectors Container */}
      <div style={styles.selectorsContainer}>


        <select
          className="form-select"
          style={styles.dropdownMenu}
          onChange={handleIntervalChange}
          defaultValue="Monthly" // Set default value here

        >
          <option value="Monthly">Monthly</option>
          <option value="Fortnightly">Fortnightly</option>
          <option value="Weekly">Weekly</option>
        </select>


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
      </div>
      {/* Date Navigator */}
      <div className="d-flex" style={styles.dateContainer}>
        <button
          style={{ ...styles.dateNav, ...styles.dateNavLeft }}
          onClick={handlePreviousDates}
        >
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

        <button
          style={{ ...styles.dateNav, ...styles.dateNavRight }}
          onClick={handleNextDates}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
