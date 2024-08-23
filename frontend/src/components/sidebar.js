// import React, { useState } from "react";

// // Base button styles
// const baseButtonStyle = {
//   display: "inline-block",
//   padding: "8px 16px",
//   borderRadius: "8px",
//   border: "none",
//   fontSize: "14px",
//   fontWeight: "500",
//   cursor: "pointer",
//   transition: "all 0.3s ease",
//   margin: "6px",
//   textAlign: "center",
//   lineHeight: "1.4",
//   textTransform: "uppercase",
// };

// // Specific button styles
// const addButtonStyle = {
//   ...baseButtonStyle,
//   backgroundColor: "#00aaff",
//   color: "#ffffff",
//   boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
// };

// const sendButtonStyle = {
//   ...baseButtonStyle,
//   backgroundColor: "#00aaff",
//   color: "#ffffff",
//   boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
// };

// const resetButtonStyle = {
//   ...baseButtonStyle,
//   backgroundColor: "#ff4d4d",
//   color: "#ffffff",
//   boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
// };

// // Button hover and active states
// const buttonHoverStyle = {
//   opacity: "0.9",
// };

// const buttonActiveStyle = {
//   opacity: "0.8",
// };

// const titleStyle = {
//   marginTop: 0,
//   fontSize: "20px",
//   fontWeight: "600",
//   color: "#ffffff",
//   textAlign: "center",
// };

// // Sidebar container styling
// const sidebarStyle = {
//   width: "300px",
//   padding: "20px",
//   backgroundColor: "#1a1a1a",
//   color: "#f1f1f1",
//   borderRadius: "40px 0 0 40px", // Only left edges circular
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   maxHeight: "100vh", // Ensures full viewport height
//   overflowY: "auto", // Scrollbar for overflow
// };

// const fieldContainerStyle = {
//   width: "80%", // Ensure it fits the sidebar width
//   marginTop: "20px",
//   maxHeight: "calc(100vh - 180px)", // Adjust height for scrolling
// };

// const fieldBlockStyle = {
//   backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background
//   padding: "12px",
//   borderRadius: "8px",
//   marginBottom: "12px",
//   width: "100%",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
//   cursor: "pointer",
// };

// const fieldTitleStyle = {
//   fontSize: "16px",
//   fontWeight: "600",
//   color: "#ffffff",
//   marginBottom: "8px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
// };

// const caretStyle = {
//   marginLeft: "10px",
//   fontSize: "18px",
// };

// const fieldDetailsStyle = {
//   marginTop: "8px",
// };

// const fieldListStyle = {
//   listStyleType: "none",
//   padding: "0",
//   margin: "0",
// };

// const fieldItemStyle = {
//   padding: "6px 0",
//   borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
//   color: "#e0e0e0",
//   fontSize: "14px",
// };

// // Format coordinates to 2 decimal places
// const formatCoordinates = (lat, lng) => `(${lng.toFixed(2)}, ${lat.toFixed(2)})`;

// const buttonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   width: "100%",
//   marginTop: "20px",
// };

// const Sidebar = ({ fields, onAddLocation, addingMode, onSendToDatabase, onResetDatabase }) => {
//   const [expandedFields, setExpandedFields] = useState([]);

//   const toggleFieldDetails = (index) => {
//     setExpandedFields((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index]
//     );
//   };

//   return (
//     <div style={sidebarStyle}>
//       <h2 style={titleStyle}>Fields</h2>
//       <button
//         onClick={onAddLocation}
//         disabled={addingMode}
//         style={addButtonStyle}
//         onMouseOver={(e) => e.currentTarget.style.opacity = buttonHoverStyle.opacity}
//         onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
//         onMouseDown={(e) => e.currentTarget.style.opacity = buttonActiveStyle.opacity}
//         onMouseUp={(e) => e.currentTarget.style.opacity = buttonHoverStyle.opacity}
//       >
//         {addingMode ? "Adding..." : "Add Field"}
//       </button>
//       <div style={fieldContainerStyle}>
//         {fields.map((field, index) => (
//           <div
//             key={index}
//             style={fieldBlockStyle}
//             onClick={() => toggleFieldDetails(index)}
//           >
//             <div style={fieldTitleStyle}>
//               <span>Field {index + 1}</span>
//               <span style={caretStyle}>
//                 {expandedFields.includes(index) ? "^" : "v"}
//               </span>
//             </div>
//             {expandedFields.includes(index) && (
//               <div style={fieldDetailsStyle}>
//                 <ul style={fieldListStyle}>
//                   {field.map((marker, idx) => (
//                     <li key={idx} style={fieldItemStyle}>
//                       {formatCoordinates(marker.lat, marker.lng)}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <div style={buttonContainerStyle}>
//         <button
//           onClick={onSendToDatabase}
//           disabled={fields.length === 0}
//           style={sendButtonStyle}
//           onMouseOver={(e) => e.currentTarget.style.opacity = buttonHoverStyle.opacity}
//           onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
//           onMouseDown={(e) => e.currentTarget.style.opacity = buttonActiveStyle.opacity}
//           onMouseUp={(e) => e.currentTarget.style.opacity = buttonHoverStyle.opacity}
//         >
//           Send to Database
//         </button>
//         <button
//           onClick={onResetDatabase}
//           disabled={fields.length === 0}
//           style={resetButtonStyle}
//           onMouseOver={(e) => e.currentTarget.style.opacity = buttonHoverStyle.opacity}
//           onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
//           onMouseDown={(e) => e.currentTarget.style.opacity = buttonActiveStyle.opacity}
//           onMouseUp={(e) => e.currentTarget.style.opacity = buttonHoverStyle.opacity}
//         >
//           Reset Database
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
