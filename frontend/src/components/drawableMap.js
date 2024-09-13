import React, { useState, useEffect } from "react";
import sampleImage from '../images/sample.png';
import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import Sidenav from "./sidenav";
import Undernav from "./under_nav";
import Bottom from "./bottom.js";

const libraries = ["places", "drawing"];

const DrawableMap = ({ user }) => {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [imageUrl,setImageUrl] = useState("");
const [imageOverlay, setImageOverlay] = useState(null);
let [cachedImage,setCachedImage] = useState(null); // Store the loaded image globally
let [cachedCanvas,setCachedCanvas] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDTpcRPc-44RydvSTDu6Oh8lrSuw2vSE_Q",
    libraries,
  });

  const defaultCenter = {
    lat: 33.639777,
    lng: 72.985718,
  };

  const containerStyle = {
    width: "100%",
    height: "74.5vh",
  };

  const polygonOptions = {
    fillOpacity: 0.3,
    fillColor: "#ff0000",
    strokeColor: "#ff0000",
    strokeWeight: 2,
    draggable: false,
    editable: true,
    clickable: false, // Prevent polygons from interfering with the map clicks
  };

  const drawingManagerOptions = {
    polygonOptions: polygonOptions,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],
    },
  };
  // Create a tooltip element
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.backgroundColor = "white";
tooltip.style.border = "1px solid #ccc";
tooltip.style.padding = "5px";
tooltip.style.borderRadius = "4px";
tooltip.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
tooltip.style.pointerEvents = "none"; // Prevent tooltip from blocking mouse events
tooltip.style.display = "none"; // Initially hidden
document.body.appendChild(tooltip);
  const onOverlayComplete = async (event) => {
    const newPolygon = event.overlay;
    const newPolygonPath = newPolygon
      .getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

    const lons = newPolygonPath.map((coord) => coord.lng);
    const lats = newPolygonPath.map((coord) => coord.lat);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    if (minLon >= maxLon || minLat >= maxLat) {
      alert("The field is too small to load for Sentinel");
      newPolygon.setMap(null); // Remove the polygon from the map
      return; // Stop execution if the field is too small
    }

    const name = prompt("Enter a name for this field:");

    if (name && !fieldNames.includes(name)) {
      setFieldNames((prevFieldNames) => [...prevFieldNames, name]);
      setPolygons((prevPolygons) => [
        ...prevPolygons,
        { path: newPolygonPath, name },
      ]);
      setDrawnPolygons((prevDrawnPolygons) => [
        ...prevDrawnPolygons,
        newPolygon,
      ]);

      // Save to database
      sendSinglePolygonToDb(newPolygonPath, name, user.id);
    } else if (fieldNames.includes(name)) {
      alert("The name is already taken. Please choose a different name.");
      newPolygon.setMap(null);
    }

    if (drawingManager) {
      drawingManager.setOptions({
        drawingControl: false,
        drawingControlOptions: {
          drawingModes: [],
        },
      });
    }
  };

  const sendSinglePolygonToDb = async (coordinates, name, userId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/save-single-polygon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates,
            name,
            userId,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
      } else {
        const errorData = await response.json();
        console.error("Failed to save polygon:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendToDb = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ polygons }),
      });

      if (response.ok) {
        console.log("Polygons saved successfully!");
      } else {
        console.error("Failed to save polygons");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const logPolygons = () => {
    return polygons.map((polygon, index) => ({
      index: index,
      name: polygon.name,
    }));
  };

  useEffect(() => {
    if (isLoaded) {
      loadFromDB(user.id);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (map) {
      logPolygons();
    }
  }, [polygons, map]);

  const loadFromDB = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/load-polygons/${encodeURIComponent(userId)}`
      );
      if (response.ok) {
        const result = await response.json();
        const transformedPolygons = result.map((polygon) => ({
          path: polygon.coordinates.map((coord) => ({
            lat: coord.lat,
            lng: coord.lng,
          })),
          name: polygon.name,
        }));
        setPolygons(transformedPolygons);
        logPolygons();
      } else {
        console.error("Failed to load polygons");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearMap = () => {
    drawnPolygons.forEach((polygon) => polygon.setMap(null));
    setDrawnPolygons([]);
    setPolygons([]);
    setFieldNames([]);
  };

  const highlightField = async (index) => {
    const isSelected = selectedFieldIndex === index;
    setSelectedFieldIndex(isSelected ? null : index);

    drawnPolygons.forEach((polygon, i) => {
      polygon.setMap(i === index && !isSelected ? map : null);
    });
  };

  const handleFieldClick = async (index, layer, timeRange) => {
    if (index === "") {
      alert("You have not selected any field from the sidebar.");
      return;
    }
    // alert(timeRange);

    const isSelected = selectedFieldIndex === index;
    setSelectedFieldIndex(isSelected ? null : index);

    drawnPolygons.forEach((polygon, i) => {
      polygon.setMap(i === index && !isSelected ? map : null);
    });

    if (isSelected) {
      clearImageOverlay();
    } else {
      loadFieldImage(index, layer, timeRange);
    }
  };

  const loadFieldImage = async (index, layer, timeRange) => {
    // alert(`index: ${index}`);

    const selectedPolygon = polygons[index];
    const { path } = selectedPolygon;
    const [lons, lats] = [path.map((c) => c.lng), path.map((c) => c.lat)];
    const [minLon, maxLon] = [Math.min(...lons), Math.max(...lons)];
    const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];

    try {
      // alert(timeRange);
      const requestBody = JSON.stringify({
        coordinates: path,
        layer,
        time: timeRange,
      });
      console.log("Request Body:", requestBody); // Log the request body

      const response = await fetch(
        "http://localhost:3000/sentinel/getImageUrl",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      if (response.ok) {
        const { imageUrl } = await response.json();
        setImageUrl(imageUrl);
        updateImageOverlay(imageUrl, minLat, minLon, maxLat, maxLon);
        // window.open(imageUrl, '_blank');
        // console.log(imageUrl)
        // alert(imageUrl)
      } else {
        showAlert(selectedPolygon.name, path);
      }
    } catch (error) {
      console.error("Error fetching image URL:", error.message);
    }
  };

  const showAlert = (name, path) => {
    const coordinates = path
      .map((coord) => `(${coord.lng.toFixed(1)}, ${coord.lat.toFixed(1)})`)
      .join(", ");
    alert(
      `The field could be too small for Sentinel! Coordinates of ${name}: ${coordinates}`
    );
  };
  const clearImageOverlay = () => {
    if (imageOverlay) {
      imageOverlay.setMap(null);
      setImageOverlay(null);
    }
  };

  const updateImageOverlay = (imageUrl, minLat, minLon, maxLat, maxLon) => {
    if (!map) {
      console.error("Map is not loaded yet.");
      return;
    }
  
    clearImageOverlay(); // Clear any previous overlay
  
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(minLat, minLon),
      new window.google.maps.LatLng(maxLat, maxLon)
    );
  
    const overlay = new window.google.maps.GroundOverlay(imageUrl, bounds, {
      clickable: false, // Ensure overlay captures events
    });
  
    overlay.setMap(map); // Set the new overlay on the map
    setImageOverlay(overlay); // Ensure the overlay is stored in state

    processLayerForPopUp(imageUrl);
  
    // let timer; // Timer for delaying the tooltip display
  
    // Ensure event listeners are added after the overlay is set
      // Add mousemove listener to the overlay
      // window.google.maps.event.addListener(overlay, 'mousemove', (event) => {
      //   clearTimeout(timer); // Clear timer if mouse keeps moving
      //   hideTooltip();       // Hide tooltip if mouse moves
  
      //   // Start 1-second timer to show tooltip if mouse stays still
      //   timer = setTimeout(() => {
      //     handleMapClick(event);
      //     showTooltipWithDummyValue(event); // Show tooltip after 1 second
      //   }, 300);
      // });
  
      // // Add mouseout listener to cancel the timer if the mouse leaves the overlay
      // window.google.maps.event.addListener(overlay, 'mouseout', () => {
      //   clearTimeout(timer); // Clear timer if mouse moves out
      //   hideTooltip();       // Hide tooltip when mouse leaves the overlay
      // });
  };
  
  
  
  
  const resetDB = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reset/${encodeURIComponent(userId)}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        console.log("Database reset successfully!");
      } else {
        console.error("Failed to reset database");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //mouse click ndvi value

  // Function to handle click on the GroundOverlay

  const handleMapClick = async (event) => {
    if (!imageOverlay) {
      console.error("Image overlay is not loaded.");
      return;
    }
  
    // if (!cachedImage || !cachedCanvas) {
    //   console.error("Image or canvas not preprocessed.");
    //   return;
    // } 
    const latLng = event.latLng;
    const { lat, lng } = latLng.toJSON();
    console.log("Clicked at Lat:", lat, "Lng:", lng);
  
    // Bounds of the overlay
    const bounds = imageOverlay.getBounds();
    const northEast = bounds.getNorthEast(); // maxLat, maxLon
    const southWest = bounds.getSouthWest(); // minLat, minLon
    const minLat = southWest.lat();
    const minLon = southWest.lng();
    const maxLat = northEast.lat();
    const maxLon = northEast.lng();
  
    // Process the click without reloading the image
    getColorAtPoint(lat, lng, minLat, minLon, maxLat, maxLon,event);
  };
// Function to download image and get color at clicked point
const getColorAtPoint = (lat, lng, minLat, minLon, maxLat, maxLon,event) => {
  console.log("Getting color at point:", lat, lng, "from cached image");

  if (!cachedCanvas) {
    console.error("Canvas is not available.");
    return;
  }

  const ctx = cachedCanvas.getContext("2d");
  const width = cachedCanvas.width;
  const height = cachedCanvas.height;

  // Convert lat/lng to canvas coordinates
  let x = ((lng - minLon) / (maxLon - minLon)) * width;
  let y = ((lat - maxLat) / (minLat - maxLat)) * height; // Adjusted to maintain proper scaling

  // Round x and y to the nearest integers as getImageData expects integer values
  x = Math.round(x);
  y = Math.round(y);

  console.log("Canvas Coordinates:", x, y);

  // Ensure x and y are within the bounds of the image/canvas
  if (x >= 0 && x < width && y >= 0 && y < height) {
    // Get the pixel color at the computed coordinates
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    showTooltipWithDummyValue(event,pixel[0],pixel[1],pixel[2]);    // Trigger function after 1 second

    console.log(`Color at (${x}, ${y}) [lat: ${lat}, lng: ${lng}] is: ${color}`);
  } else {
    console.error("Coordinates are out of bounds");
  }
};

const processLayerForPopUp = async (imageUrl) => {
  console.log("Preprocessing layer...");

  const image = new Image();
  image.crossOrigin = "Anonymous"; 

  image.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = image.width;
    const height = image.height;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    // Cache the image and canvas for later use
    
    setCachedImage(image);
    setCachedCanvas(canvas);

    console.log("Image preprocessing completed.");
  };

  image.onerror = (error) => {
    console.error("Failed to load the image during preprocessing", error);
    console.error("Image URL:", imageUrl);
  };
  // Load the image (only done once)
  image.src = imageUrl;
};

let timer;  
if (map) {
  map.addListener('mousemove', (event) => {
    // Clear the timer if the mouse keeps moving
    clearTimeout(timer);
    hideTooltip();
    // Start a 1 second timer to check if the mouse stays
    timer = setTimeout(() => {
      handleMapClick(event);
    }, 1000);
  });

  // Mouseout event to cancel the timer if the mouse leaves the map
  map.addListener('mouseout', () => {
    clearTimeout(timer);  // Clear the timer if the mouse moves out too soon
    hideTooltip();        // Hide tooltip when mouse leaves the map
  });
}

const updateTooltip = (v1,v2,v3, x, y) => {
  const red = v1;
  const green = v2;
  const ndvi = (green - red) / (green + red);
  const ndviValue = ndvi.toFixed(2);

  tooltip.textContent = `${ndviValue}`;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.style.display = "block"; // Show tooltip
};

const hideTooltip = () => {
  tooltip.style.display = "none"; // Hide tooltip
};

// Mousemove event to show tooltip with dummy value
const showTooltipWithDummyValue = (event,v1,v2,v3) => {
  // Dummy values for demonstration
  // const dummyValue = "Dummy RGB Value: rgb(100, 150, 200)";
  
  // Get the mouse position from the event
  const mouseX = event.domEvent.clientX;
  const mouseY = event.domEvent.clientY;

  updateTooltip(v1,v2,v3, mouseX, mouseY);
};

  return isLoaded ? (
    <div style={{ display: "flex" }}>
      <Sidenav
        isLoaded={isLoaded}
        user={user}
        logPolygons={logPolygons}
        resetDB={() => resetDB(user.id)}
        sendToDb={sendToDb}
        loadFromDB={() => loadFromDB(user.id)}
        clearMap={clearMap}
        selectedFieldIndex={selectedFieldIndex}
        onFieldClick={handleFieldClick}
        highlightField={highlightField}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          className="map-container"
          style={{ height: "74.75vh", position: "relative" }}
        >
          <GoogleMap
            zoom={13}
            center={defaultCenter}
            // onMouseOver={handleMapClick}
            onLoad={(map) => {
              setMap(map);
            }}
            mapContainerStyle={containerStyle}
          >
            <DrawingManager
              onLoad={(drawingManager) => {
                setDrawingManager(drawingManager);
              }}
              onOverlayComplete={onOverlayComplete}
              options={drawingManagerOptions}
            />
            {polygons.map((polygon, index) => (
              <Polygon
                key={index}
                paths={polygon.path}
                options={polygonOptions}
                visible={selectedFieldIndex === index}
              />
            ))}
          </GoogleMap>
        </div>
        <Bottom
          onFieldClick={handleFieldClick}
          selectedFieldIndex={selectedFieldIndex}
        />
      </div>
    </div>
  ) : null;
};

export default DrawableMap;
