import React from "react";
import { ThreeCircles } from "react-loader-spinner";

export default function Loader() {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0)", // Dark background with transparency
          zIndex: 4000, // Ensure it's above all other elements, including Drawer
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
        }}
      >
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background with transparency
          zIndex: 4000, // Ensure it's above all other elements, including Drawer
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
        }}
      >
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="three-circles-loading"
        />
      </div>
    </div>
  );
}
