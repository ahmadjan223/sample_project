const styles = {
    bottomBar: {
      position: "absolute",
      bottom: 0,
      width: "83.7%",
      padding: "20px",
      backgroundColor: "transparent",
      // backgroundColor: "#212930",
      display: "flex",
      flexDirection: "column", // Stack elements vertically
      alignItems: "center", // Center align the items
    },

    selectorsContainer: {
      display: "flex",

      justifyContent: "space-between", // Change to space-between
      width: "80%", // Ensure it takes full width
      marginTop: "10px", // Space between selectors and date navigator
      
      gap: "700px", // Add space between selectors
    },
    

    dropdownMenu: {
      padding: "8px",
      fontSize: "16px",
      backgroundColor: "#111418",
      color: "#fafafa",
      width: "50%", // Set the width to 50%
    },

    dateContainer: {
      width: "80%",
      // border: "2px solid black",
      display: "flex",
      alignItems: "center",
      padding: "0px",
      boxSizing: "border-box",
      gap: "0px",
      marginTop: "10px", // Add space above the date navigator
    },

    dateNav: {
      cursor: "pointer",
      padding: "5px 8px",
      border: "1px solid black", // Add border to make it look like a button
      // borderRadius: "0px",
      backgroundColor: "#111418",
      color: "#fafafa",
    },
    dateNavLeft: {
      borderRadius: "10px 0px 0px 10px",
    },
    dateNavRight: {
      borderRadius: "0px 10px 10px 0px",
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

  export default styles;
