// centralProps.js
import { useState, useEffect } from "react";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "short" };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
};

export const useAppState = () => {
  const dateCount = 15;

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
    } else {
      await setUserSelectedIndex(index);
    }
  };

  const [dates, setDates] = useState([]);

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
    setDates,
  };
};

export default useAppState;
