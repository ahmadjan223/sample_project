import React, { useState } from "react";

const Undernav = () => {
  const [sliderValue, setSliderValue] = useState(1);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <div>
      {/* Your existing code for the UnderNav component goes here */}

      <div style={{ margin: "20px 0", position: "relative", width: "300px" }}>

        <input
          id="slider"
          type="range"
          min="1"
          max="7"
          value={sliderValue}
          onChange={handleSliderChange}
          style={{ width: "100%" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "absolute",
            width: "100%",
            bottom: "-20px",
          }}
        >
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
        </div>
      </div>
    </div>
  );
};

export default Undernav;
