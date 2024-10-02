import { useState } from "react";

const SideBarTiles = ({
  field,
  selectedFieldName,
  openDetailsPage, // Pass down the openDetailsPage function
  hovered,
  setHovered,
  DataFetch
}) => {
  const [expanded, setExpanded] = useState(false);

  const onClickField = (fieldName) => {
    openDetailsPage(fieldName); // Call the function to open the details page
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignSelf: "stretch",
          flexGrow: 0,
          flexShrink: 0,
          gap: 10,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: 8,
          // border: "1px solid white",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClickField(field.name)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 0,
            flexShrink: 0,
            width: 232,
            height: 24,
            position: "relative",
          }}
        >
          <p
            style={{
              flexGrow: 0,
              flexShrink: 0,
              width: 146,
              fontSize: 16,
              fontWeight: 500,
              textAlign: "left",
              color: "#e4ebfb",
            }}
          >
            {field.name}
          </p>
          <svg
          onClick={onClickField}
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              flexGrow: 0,
              flexShrink: 0,
              width: 20,
              height: 20,
              position: "relative",
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M8.33337 15.8333C8.33337 16.75 9.08337 17.5 10 17.5C10.9167 17.5 11.6667 16.75 11.6667 15.8333C11.6667 14.9167 10.9167 14.1667 10 14.1667C9.08337 14.1667 8.33337 14.9167 8.33337 15.8333Z"
              stroke="white"
              stroke-width="1.5"
            />
            <path
              d="M8.33337 4.16665C8.33337 5.08331 9.08337 5.83331 10 5.83331C10.9167 5.83331 11.6667 5.08331 11.6667 4.16665C11.6667 3.24998 10.9167 2.49998 10 2.49998C9.08337 2.49998 8.33337 3.24998 8.33337 4.16665Z"
              stroke="white"
              stroke-width="1.5"
            />
            <path
              d="M8.33337 10C8.33337 10.9167 9.08337 11.6667 10 11.6667C10.9167 11.6667 11.6667 10.9167 11.6667 10C11.6667 9.08335 10.9167 8.33335 10 8.33335C9.08337 8.33335 8.33337 9.08335 8.33337 10Z"
              stroke="white"
              stroke-width="1.5"
            />
          </svg>
        </div>
      </div>
      {/* <button
        className="field-item-content selected"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClickField(field.name)} // Handle click to select field
      >
        <div
          className={`field-name ${
            selectedFieldName === field.name ? "selected" : ""
          }`}
        >
          {field.name}
        </div>
      </button> */}
    </div>
  );
};

export default SideBarTiles;