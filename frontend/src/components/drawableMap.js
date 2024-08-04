import Sidenav from "./sidenav";
import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places", "drawing"];  // Declare 'libraries' before using it

const DrawableMap = () => {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  
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
  const onOverlayComplete = async (event) => {
    const newPolygon = event.overlay;
    const newPolygonPath = newPolygon
        .getPath()
        .getArray()
        .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

    // Prompt the user for a name
    const name = prompt("Enter a name for this field:");

    if (name && !fieldNames.includes(name)) {
        setFieldNames((prevFieldNames) => [...prevFieldNames, name]);
        setPolygons((prevPolygons) => [...prevPolygons, { path: newPolygonPath, name }]);
        setDrawnPolygons((prevDrawnPolygons) => [...prevDrawnPolygons, newPolygon]);

        // Save to database
        sendSinglePolygonToDb(newPolygonPath, name);

        // Log polygons
        logPolygons();
    } else if (fieldNames.includes(name)) {
        alert("The name is already taken. Please choose a different name.");
        // Remove the new polygon from the map if name is not unique
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

const sendSinglePolygonToDb = async (coordinates, name) => {
  try {
      const response = await fetch('http://localhost:3000/api/save-single-polygon', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              coordinates,
              name,
          }),
      });

      if (response.ok) {
          const result = await response.json();
          console.log(result.message);
      } else {
          console.error('Failed to save polygon.');
      }
  } catch (error) {
      console.error('Error:', error);
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
    console.log("Current polygons:", polygons);
    return polygons.map((polygon, index) => ({
      index: index + 1,
      name: polygon.name,
    }));
  };

  useEffect(() => {
    if (isLoaded) {
      loadFromDB();
    }
  }, [isLoaded]);

  const loadFromDB = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/load-polygons");

      if (response.ok) {
        const result = await response.json();
        const transformedPolygons = result.map((polygon) => ({
          path: polygon.coordinates.map((coord) => ({
            lat: coord.lat,
            lng: coord.lng,
          })),
          name: polygon.name
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

  const handleFieldClick = (index) => {
    if (selectedFieldIndex === index) {
      setSelectedFieldIndex(null);
      // Hide the selected polygon from the map
      drawnPolygons.forEach((polygon, i) => {
        if (i === index) {
          polygon.setMap(null);
        }
      });
    } else {
      setSelectedFieldIndex(index);
      // Show the selected polygon on the map
      if (drawnPolygons[index]) {
        drawnPolygons[index].setMap(map);
      }
    }
  };

  const resetDB = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reset", {
        method: "POST",
      });

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

  return isLoaded ? (
    <div style={{ display: "flex" }}>
      <Sidenav
        logPolygons={logPolygons}
        resetDB={resetDB}
        sendToDb={sendToDb}
        loadFromDB={loadFromDB}
        clearMap={clearMap}
        selectedFieldIndex={selectedFieldIndex}
        onFieldClick={handleFieldClick}
      />
      <div className="map-container" style={{ flex: 1, position: "relative" }}>
        <GoogleMap
          zoom={18}
          center={defaultCenter}
          onLoad={(map) => {
            console.log("Google Maps is loaded");
            setMap(map);
          }}
          mapContainerStyle={containerStyle}
        >
          <DrawingManager
            onLoad={(drawingManager) => {
              console.log("Drawing manager is loaded");
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
    </div>
  ) : null;
};

export default DrawableMap;
