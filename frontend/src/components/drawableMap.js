import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import Sidenav from "./sidenav";
import Undernav from "./under_nav";

const libraries = ["places", "drawing"];

const DrawableMap = ({ user }) => {
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
  const [imageOverlay, setImageOverlay] = useState(null);

  const handleFieldClick = async (index,layer, timeRange) => {
    // alert(timeRange);
    const isSelected = selectedFieldIndex === index;
    setSelectedFieldIndex(isSelected ? null : index);
  
    drawnPolygons.forEach((polygon, i) => {
      polygon.setMap(i === index && !isSelected ? map : null);
    });
  
    if (isSelected) {
      clearImageOverlay();
    } else {
      loadFieldImage(index, layer,timeRange);
    }
  };
  
  
  const loadFieldImage = async (index,layer,timeRange) => {
    const selectedPolygon = polygons[index];
    const { path } = selectedPolygon;
    const [lons, lats] = [path.map(c => c.lng), path.map(c => c.lat)];
    const [minLon, maxLon] = [Math.min(...lons), Math.max(...lons)];
    const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
    
    try {
      // alert(timeRange);
      const requestBody = JSON.stringify({ coordinates: path, layer, time: timeRange });
      console.log("Request Body:", requestBody); // Log the request body

      const response = await fetch("http://localhost:3000/sentinel/getImageUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
  
      if (response.ok) {
        const { imageUrl } = await response.json();
        updateImageOverlay(imageUrl, minLat, minLon, maxLat, maxLon);
      } else {
        showAlert(selectedPolygon.name, path);
      }
    } catch (error) {
      console.error("Error fetching image URL:", error.message);
    }
  };
  
  const showAlert = (name, path) => {
    const coordinates = path
      .map(coord => `(${coord.lng.toFixed(1)}, ${coord.lat.toFixed(1)})`)
      .join(", ");
    alert(`The field could be too small for Sentinel! Coordinates of ${name}: ${coordinates}`);
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
    
    clearImageOverlay();
  
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(minLat, minLon),
      new window.google.maps.LatLng(maxLat, maxLon)
    );
  
    const overlay = new window.google.maps.GroundOverlay(imageUrl, bounds);
    overlay.setMap(map);
    setImageOverlay(overlay);
    map.addListener("mousemove", (event) => {
      const { latLng } = event;
      const { lat, lng } = latLng.toJSON();
      getColorAtPoint(lat, lng, imageUrl, minLat, minLon, maxLat, maxLon);
    });
  };
  const getColorAtPoint = async (lat, lng, imageUrl, minLat, minLon, maxLat, maxLon) => {
    const image = new Image();
    //downlaod the image on the frontend and then use that image to fix the cross origin issueue
    
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const [width, height] = [image.width, image.height];
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      
      // Convert lat/lng to canvas coordinates
      // This will depend on your coordinate system
      const a = (lng - minLon) / (maxLon - minLon) * width;
      const b = (lat - minLat) / (maxLat - minLat) * height;
      const [x,y] = [a,b]
  
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      console.log(`Color at (${x}, ${y}): ${color}`);
      
      // Show color on UI
      showColorAtCursor(color);
    };
  };

  const showColorAtCursor = (color) => {
    // Display the color value on the UI
    // This could be a tooltip or any other UI element
    const colorDisplayElement = document.getElementById("colorDisplay");
    colorDisplayElement.style.backgroundColor = color;
    colorDisplayElement.textContent = color;
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
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div className="map-container" style={{ height: "60vh", position: "relative" }}>
          <GoogleMap
            zoom={13}
            center={defaultCenter}
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
        {/* <Undernav /> */}
      </div>
    </div>
  ) : null;
  
};

export default DrawableMap;
