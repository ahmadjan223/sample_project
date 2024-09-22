// centralProps.js
import { useState,useEffect } from "react";

const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short' };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

export const useAppState = () => {

const dateCount =15;

const increment = 28;
const [incrementValue, setIncrementValue] = useState(increment);

const initDays = 45;

  const [selectedMonth, setSelectedMonth] = useState("Aug");
  const [polygonInfo, setPolygonInfo] = useState([]);
  const [expandedField, setExpandedField] = useState(null);
  const [editFieldIndex, setEditFieldIndex] = useState(null);
  const [editFieldName, setEditFieldName] = useState("");
  const [layer, setLayer] = useState("NDVI");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState("");
  const [userSelectedIndex, setUserSelectedIndex] = useState("-1");

  // Functions related to state
  const handleLayerChange = (event) => {
    setLayer(event.target.value);
  };

  const temp = async (index) => {
    if (userSelectedIndex === index) {
      await setUserSelectedIndex("-1");
    }
    else{
      await setUserSelectedIndex(index);
    }
    
  };


  const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short' };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);

  const format = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const setDate = (date) => {
    setSelectedDate(date);
    const inputDate = new Date(date);
    const fiveDaysBefore = new Date(inputDate);
    fiveDaysBefore.setDate(inputDate.getDate() - incrementValue);
    // alert("Date: "+ format(inputDate) + "\nNext Date: "+ format(fiveDaysBefore));
    setTimeRange(`${format(fiveDaysBefore)}/${format(inputDate)}`);

  }

  useEffect(() => {
    // Initialize the dates array with increments of 5 days
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

  const getDateLabel = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    // Add a line break using a span with display block
    return (
      <>
        {day}
        <br />
        {month}
      </>
    );
  };
  

  const handleNextDates = () => {
    setDates((prevDates) => {
      const benchmarkDate = new Date();
      benchmarkDate.setDate(benchmarkDate.getDate() - initDays);

      const newDates = [...prevDates];
      const lastDate = new Date(newDates[newDates.length - 1]);
      const newDate = new Date(lastDate);
      newDate.setDate(lastDate.getDate() + incrementValue);
  
      // Check if the new date exceeds the benchmark date
      if (newDate > benchmarkDate) {
        alert("Can't go beyond the benchmark date.");
        return prevDates; // Return the previous state to prevent modification
      }
  
      // Add the new date to the end and remove the oldest date
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

      // Add a new date to the beginning and remove the newest date
      newDates.unshift(firstDate);
      newDates.pop();

      return newDates;
    });
  };

  return {
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
    dates,
    setDate,
    getDateLabel,

    handleNextDates,
    handlePreviousDates,
    incrementValue,
    setIncrementValue,
    setDates
  };
};

export default useAppState;