import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places", "drawing"];

const DrawableMap = () => {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [polygonDrawn, setPolygonDrawn] = useState(false); // Track if a polygon has been drawn
  const [drawnPolygons, setDrawnPolygons] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDTpcRPc-44RydvSTDu6Oh8lrSuw2vSE_Q",
    libraries,
  });

  const [polygons, setPolygons] = useState([
    [
      { lat: 33.639552, lng: 72.987401 },
      { lat: 33.640592, lng: 72.986661 },
      { lat: 33.640246, lng: 72.985916 },
      { lat: 33.639241, lng: 72.986796 },
    ],
    [
      { lat: 33.640003, lng: 72.98579 },
      { lat: 33.639619, lng: 72.986093 },
      { lat: 33.639328, lng: 72.985487 },
      { lat: 33.639614, lng: 72.985155 },
    ],
    [
      { lat: 33.639485, lng: 72.986128 },
      { lat: 33.639105, lng: 72.986423 },
      { lat: 33.638828, lng: 72.985812 },
      { lat: 33.639145, lng: 72.985533 },
    ],
    [
      { lat: 33.640512, lng: 72.988068 },
      { lat: 33.640218, lng: 72.987343 },
      { lat: 33.639771, lng: 72.987681 },
      { lat: 33.640048, lng: 72.988411 },
    ],
  ]);

  const defaultCenter = {
    lat: 33.639777,
    lng: 72.985718,
  };

  const [center, setCenter] = useState(defaultCenter);

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const polygonOptions = {
    fillOpacity: 0.3,
    fillColor: "#ff0000",
    strokeColor: "#ff0000",
    strokeWeight: 2,
    draggable: false,
    editable: true,
  };

  const drawingManagerOptions = {
    polygonOptions: polygonOptions,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],
    },
  };

  const onOverlayComplete = (event) => {
    const newPolygon = event.overlay;
    const newPolygonPath = newPolygon
      .getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

    // Add the new polygon to the state
    setPolygons((prevPolygons) => [...prevPolygons, newPolygonPath]);

    // Store the drawn polygon in the array
    setDrawnPolygons((prevDrawnPolygons) => [...prevDrawnPolygons, newPolygon]);

    // Remove the drawing mode
    if (drawingManager) {
      drawingManager.setOptions({
        drawingControl: false,
        drawingControlOptions: {
          drawingModes: [], // Disable all drawing modes
        },
      });
    }
  };

  const sendToDb = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/save-polygons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ polygons }), // Adjust the payload if necessary
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        // setPolygons([]); // Clear polygons after successful save
        console.log("Polygons saved successfully!"); // Show notification on success
      } else {
        console.error("Failed to save polygons");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const logPolygons = () => {
    console.log("Current polygons:", polygons);
  };

  useEffect(() => {
    console.log("use effect logging")
    console.log(polygons);
  }, [polygons]);

  const resetDB = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reset", {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        console.log("Database reset successfully!", 5000);
      } else {
        console.error("Failed to reset database");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadFromDB = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/load-polygons");

      if (response.ok) {
        const result = await response.json();
        console.log(result); // Directly log the result which should be an array of polygons
        console.log("Polygons loaded successfully!");
        const transformedPolygons = result.map((polygon) =>
          polygon.coordinates.map((coord) => ({
            lat: coord.lat,
            lng: coord.lng,
          }))
        );

        setPolygons(transformedPolygons);
        transformedPolygons.forEach((polygon, index) => {
          console.log(`Polygon ${index + 1}:`, polygon);
        });
      } else {
        console.error("Failed to load polygons");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearMap = () => {
    // Create a copy of the drawnPolygons array
    const polygonsToClear = [...drawnPolygons];

    // Remove all polygons from the map
    drawnPolygons.forEach((polygon) => polygon.setMap(null));

    // Clear the state arrays
    setDrawnPolygons([]);
    setPolygons([]);
  };

  return isLoaded ? (
    <div className="map-container" style={{ position: "relative" }}>
      <GoogleMap
        zoom={18}
        center={center}
        onLoad={(map) => {
          console.log("Google Maps is loaded");
          setMap(map);
        }}
        mapContainerStyle={containerStyle}
        onTilesLoaded={() => setCenter(defaultCenter)} // Reset to defaultCenter if needed
      >
        <DrawingManager
          onLoad={(drawingManager) => {
            console.log("Drawing manager is loaded");
            setDrawingManager(drawingManager);
          }}
          onOverlayComplete={onOverlayComplete}
          options={{
            ...drawingManagerOptions,
            drawingControl: !polygonDrawn, // Enable drawing controls when polygon is not drawn
            drawingControlOptions: {
              position: window.google?.maps?.ControlPosition?.TOP_CENTER,
              drawingModes: polygonDrawn
                ? []
                : [window.google.maps.drawing.OverlayType.POLYGON], // Allow polygon drawing if not drawn
            },
          }}
        />

        {polygons.map((polygon, index) => (
          <Polygon key={index} paths={polygon} options={polygonOptions} />
        ))}
      </GoogleMap>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button onClick={logPolygons}>Log Polygons</button>
        <button onClick={resetDB}>Reset DB</button>
        <button onClick={sendToDb}>Send Polygon to DB</button>
        <button onClick={loadFromDB}>Load From DB</button>
        <button onClick={clearMap}>clearMap</button>
      </div>
    </div>
  ) : null;
};

export default DrawableMap;