import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import Sidenav from "./sidenav";
import Bottom from "./bottom.js";
import { useCentralProps } from "./centralpropscontext";
import { ThreeCircles } from 'react-loader-spinner'
import { savePolygon } from "../functions/db.js";
const libraries = ["places", "drawing"];

const DrawableMap = ({ user }) => {
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const toggleSatelliteView = () => {
    setIsSatelliteView(!isSatelliteView);
  };
  const [isLoading,setIsLoading] = useState(false);
  
  const { userSelectedIndex,setUserSelectedIndex } = useCentralProps();
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [indexValues, setIndexValue] = useState(null);
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
    fillOpacity: 0.1,
    fillColor: "#ffffff",
    strokeColor: "#ffffff",
    strokeWeight: 2,
    draggable: false,
    editable: false,
    clickable: false,
  };

  const drawingManagerOptions = {
    polygonOptions: polygonOptions,
    drawingControl: false,
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
      // Save to polygon to database
      savePolygon(newPolygonPath, name, user.id);
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
    if (drawingManager) {
      drawingManager.setDrawingMode(null); // Switch to dragging mode
    }
    

  };

  

  // const sendToDb = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/api/fields", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ polygons }),
  //     });

  //     if (response.ok) {
  //       console.log("Polygons saved successfully!");
  //     } else {
  //       console.error("Failed to save polygons");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

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
  const [imageOverlay, setImageOverlay] = useState(null);

  const handleCreateField = () => {
    if (drawingManager) {
      // Set the drawing mode to POLYGON to allow the user to draw
      drawingManager.setDrawingMode(
        window.google.maps.drawing.OverlayType.POLYGON
      );

      // Show drawing controls temporarily (optional)
      drawingManager.setOptions({
        drawingControl: true,
        drawingControlOptions: {
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },
      });
    }
  };

  const highlightField = async (index) => {
    clearHighlight();
    clearImageOverlay();

    if (index >= 0 && index < polygons.length) {
      const selectedPolygon = polygons[index];

      // Use polygonOptions to define the outline style
      const highlightOptions = {
        ...polygonOptions, // Spread the default opti// Transparent fill
      };

      // Create a new Polygon with the modified options
      const outlinePolygon = new window.google.maps.Polygon({
        paths: selectedPolygon.path,
        ...highlightOptions,
        map: map, // Add the polygon to the map
      });

      // Save the outlinePolygon in the drawnPolygons array
      setDrawnPolygons((prevDrawnPolygons) => [
        ...prevDrawnPolygons,
        outlinePolygon,
      ]);
    }
  };

  // Function to clear the highlight
  const clearHighlight = () => {
    drawnPolygons.forEach((polygon) => polygon.setMap(null));
    setDrawnPolygons([]);
  };

  useEffect(() => {
    if (userSelectedIndex == "-1") {
      // clearImageOverlay();
      clearHighlight();
    } else {
      highlightField(userSelectedIndex);
    }
  }, [userSelectedIndex]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [sameDateSelected, setSameDateSelected] = useState(false);

  // const [ oldTimeRange, setOldTimeRange] = useState("");

  
  const handleFieldClick = async (index, layer, timeRange) => {
    if (timeRange == "") {
      timeRange = "2024-06-01/2024-06-20";
    }

    const isSelected = selectedFieldIndex === index;
    setSelectedFieldIndex(isSelected ? null : index);

    // drawnPolygons.forEach((polygon, i) => {
    //   polygon.setMap(i === index && !isSelected ? map : null);
    // });

    if (isSelected) {
      clearImageOverlay();
    } else {
      loadFieldImage(index, layer, timeRange);
    }
  };


  const clearImageOverlay = () => {
    if (imageOverlay) {
      imageOverlay.setMap(null);
      setImageOverlay(null);
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

  const loadFieldImage = async (index, layer, timeRange) => {
    // alert(`index: ${index}`);
    setIsLoading(true);
    const selectedPolygon = polygons[index];
    const { path } = selectedPolygon;
   

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
      getIndexValues(path,layer,timeRange);

      if (response.ok) {
        const { imageUrl } = await response.json();
        updateImageOverlay(imageUrl,path);
        // window.open(imageUrl, "_blank");
        // console.log(imageUrl)
        // alert(imageUrl)
      } else {
        showAlert(selectedPolygon.name, path);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching image URL:", error.message);
    }
  };
  const getIndexValues = async (path,layer,timeRange) => {
    try {
      const response = await fetch(
        "http://localhost:3000/sentinel/getIndexValues",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: path,
            layer,
            time: timeRange,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Extract the indexvalue and convert it into an array
        const IndexArray = Object.values(result.indexValues);
        
        // Pass the array to indexvalue
        setIndexValue(IndexArray);
        console.log(result);
      } else {
        console.error("Failed to get index values");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const updateImageOverlay = (imageUrl,path) => {
    const [lons, lats] = [path.map((c) => c.lng), path.map((c) => c.lat)];
    const [minLon, maxLon] = [Math.min(...lons), Math.max(...lons)];
    const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
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
  
  const handleMouseHover = async (event) => {
    if (!imageOverlay) {
      console.error("Image overlay is not loaded.");
      return;
    }
  
    // Check if cachedImage and cachedCanvas are initialized
    if (!cachedCanvas || !indexValues) {
      console.error("Cached canvas or NDVI values are not available.");
      return;
    }
  
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
  
    // Get canvas dimensions
    const width = cachedCanvas.width;
    const height = cachedCanvas.height;
  
    // Process the click
    calculateIndexValue(lat, lng, minLat, minLon, maxLat, maxLon, width, height, event);
  };
  
// Function to download image and get color at clicked point

const calculateIndexValue = (lat, lng, minLat, minLon, maxLat, maxLon, width, height, event) => {
  
  console.log("IndexValue:", indexValues,lat,lng,minLat,minLon,maxLat,maxLon,width,height);
  // Validate input values

  // Check if the ranges are valid
  const lonRange = maxLon - minLon;
  const latRange = maxLat - minLat;

  if (lonRange <= 0 || latRange <= 0) {
    console.error("Invalid latitude or longitude range.");
    return;
  }
  
  // Convert lat/lng to pixel coordinates
  const x = ((lng - minLon) / lonRange) * width;
  const y = ((lat - maxLat) / -latRange) * height; // Invert latRange to correctly scale the Y axis

  // Check if the conversion resulted in valid numbers
  if (isNaN(x) || isNaN(y)) {
    console.error("Conversion to pixel coordinates resulted in NaN values.");
    console.error(`lng: ${lng}, minLon: ${minLon}, maxLon: ${maxLon}, width: ${width}`);
    console.error(`lat: ${lat}, minLat: ${minLat}, maxLat: ${maxLat}, height: ${height}`);
    return;
  }

  // Round x and y to the nearest integers
  const pixelX = Math.round(x);
  const pixelY = Math.round(y);

  console.log("NDVI Array Length:", indexValues.length);
console.log("Canvas Width:", width, "Canvas Height:", height);
console.log("Index Calculation: ", pixelY * width + pixelX);

  // Ensure x and y are within the bounds of the image dimensions
  if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
    // Calculate the index in the NDVI values array
    const index = pixelY * width + pixelX;

    // Ensure the index is within bounds
    if (index >= 0 && index < indexValues.length) {
      const ndviValue = indexValues[index];
      
      // NDVI values are typically in the range [-1, 1], adjust if necessary
      console.log(`NDVI Value at (${pixelX}, ${pixelY}) [lat: ${lat}, lng: ${lng}] is: ${ndviValue}`);

      // Trigger function after 1 second (assuming you want to use ndviValue in the tooltip)
      updateTooltip(event, ndviValue);

    } else {
      console.error("Index is out of bounds in the NDVI values array. Length: ", indexValues.length, " Index: ", index);
    }
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
    // hideTooltip();
    // Start a 1 second timer to check if the mouse stays
    timer = setTimeout(() => {
      handleMouseHover(event);
    }, 10);
  });

  // Mouseout event to cancel the timer if the mouse leaves the map
  map.addListener('mouseout', () => {
    clearTimeout(timer);  // Clear the timer if the mouse moves out too soon
    hideTooltip();        // Hide tooltip when mouse leaves the map
  });
}
  const updateTooltip = (event,indexValue) => {
    const mouseX = event.domEvent.clientX;
    const mouseY = event.domEvent.clientY;
    tooltip.textContent = `${indexValue}`;
    tooltip.style.left = `${mouseX}px`;
    tooltip.style.top = `${mouseY}px`;
    tooltip.style.display = "block"; // Show tooltip
  };
  
  const hideTooltip = () => {
    tooltip.style.display = "none"; // Hide tooltip
  };
  
  return isLoaded ? (
    <div style={{ display: "flex" }}>
  <Sidenav
    isLoaded={isLoaded}
    user={user}
    logPolygons={logPolygons}
    loadFromDB={() => loadFromDB(user.id)}
    clearMap={clearMap}
    selectedFieldIndex={selectedFieldIndex}
    onFieldClick={handleFieldClick}
    highlightField={highlightField}
    clearHighlight={clearHighlight}
    handleCreateField={handleCreateField}
    toggleSatelliteView={toggleSatelliteView}
    polygons={polygons}
  />
  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
    <div
      className="map-container"
      style={{ height: "74.75vh", position: "relative" }}
    >
      {isLoading && ( // Add a condition to show the loader
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background with transparency
            zIndex: 999, // Ensure it's above all other elements
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
      )}
      <GoogleMap
        zoom={13}
        center={defaultCenter}
        onLoad={(map) => {
          setMap(map);
        }}
        mapContainerStyle={containerStyle}
        mapTypeId={isSatelliteView ? "satellite" : "roadmap"} // Toggle between "roadmap" and "satellite"
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
      clearMap={clearMap}
    />
  </div>
</div>

  ) : null;
};

export default DrawableMap;