// centralProps.js
import { useState,useEffect } from "react";

const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short' };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

export const useAppState = () => {

const dateCount = 13;
const increment = 11;
const initDays = 25;

  const [selectedMonth, setSelectedMonth] = useState("Aug");
  const [polygonInfo, setPolygonInfo] = useState([]);
  const [expandedField, setExpandedField] = useState(null);
  const [editFieldIndex, setEditFieldIndex] = useState(null);
  const [editFieldName, setEditFieldName] = useState("");
  const [layer, setLayer] = useState("NDVI");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState("");
  const [userSelectedIndex, setUserSelectedIndex] = useState("");

  // Functions related to state
  const handleLayerChange = (event) => {
    setLayer(event.target.value);
  };

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

  const temp = async (index) => {
    if (userSelectedIndex === index) {
      await setUserSelectedIndex("");
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
    fiveDaysBefore.setDate(inputDate.getDate() - 5);
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
        currentDate.setDate(currentDate.getDate() - increment);
      }
      dateArray.reverse();
      setDates(dateArray);
      setSelectedDate(dateArray[0]); // Set the default selected date
    };

    generateDates();
  }, []);

  const getDateLabel = (date) => formatDate(date);

  const handleNextDates = () => {
    setDates((prevDates) => {
      const benchmarkDate = new Date();
      benchmarkDate.setDate(benchmarkDate.getDate() - initDays);

      const newDates = [...prevDates];
      const lastDate = new Date(newDates[newDates.length - 1]);
      const newDate = new Date(lastDate);
      newDate.setDate(lastDate.getDate() + increment);
  
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
      firstDate.setDate(firstDate.getDate() - increment);

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
    handleMonthClick,
    handleNextMonths,
    handlePreviousMonths,
    getMonthName,
    temp,

    selectedDate,
    setSelectedDate,
    dates,
    setDate,
    getDateLabel,

    handleNextDates,
    handlePreviousDates
  };
};

export default useAppState;