import React, { useState, useEffect } from "react";
import { Box, Select, MenuItem, Button } from "@mui/material";
import styles from "./BottomBarStyle"; // Adjust the path as needed

const BottomBar = ({ layer, date, setDate, setLayer, selectedFieldName }) => {
  const [hoveredDateIndex, setHoveredDateIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [incrementValue, setIncrementValue] = useState(30);
  const initDays = 30;
  const dateCount = 10;
  const [dates, setDates] = useState([]);
  const [userSelectedIndex, setUserSelectedIndex] = useState("-1");
  const [timeRange, setTimeRange] = useState("");

  // Function to handle date selection
  const handleDate = async (date) => {
    await setSelectedDate(date);
    const inputDate = new Date(date);
    const DaysBefore = new Date(inputDate);
    DaysBefore.setDate(inputDate.getDate() - incrementValue);
    const formattedDate = `${format(DaysBefore)}/${format(inputDate)}`;
    setDate(formattedDate);
  };

  const format = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDateLabel = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear() > 2000 ? date.getFullYear() - 2000 : date.getFullYear() - 1900;
    return `${day} ${month}'${year}`;
  };

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
    };

    generateDates();
  }, [incrementValue]);

  const handleIntervalChange = async (event) => {
    const value = event.target.value;
    let increment;

    if (value === "Weekly") {
      increment = 7;
    } else if (value === "Fortnightly") {
      increment = 14;
    } else if (value === "Monthly") {
      increment = 28;
    }

    await setIncrementValue(increment);
  };

  return (
    <Box sx={styles.bottomBar}>
      {/* Selectors Container */}
     

      {/* Date Navigator */}
      <Box className="d-flex" sx={styles.dateContainer}>
        <Button sx={styles.dateNavLeft} onClick={handlePreviousDates}>
          {"<"}
        </Button>
        <Box sx={{ display: "flex", gap: "0px" }}>
          {dates.map((date, index) => (
            <Button
              key={index}
              sx={styles.dateTile(selectedDate === date, hoveredDateIndex === index)}
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
            </Button>
          ))}
        </Box>
        <Button sx={styles.dateNavRight} onClick={handleNextDates}>
          {">"}
        </Button>
      </Box>
    </Box>
  );
};

export default BottomBar;
