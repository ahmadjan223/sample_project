import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
// import Sidenav from "./sidenav";

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
        "https://densefusion.vercel.app/api/save-single-polygon",
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
      const response = await fetch("https://densefusion.vercel.app/api/fields", {
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
      `https://densefusion.vercel.app/api/load-polygons/${encodeURIComponent(userId)}`
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

  const handleFieldClick = async (index) => {
    if (selectedFieldIndex === index) {
      setSelectedFieldIndex(null);
      drawnPolygons.forEach((polygon, i) => {
        if (i === index) {
          polygon.setMap(null);
        }
      });
    } else {
      setSelectedFieldIndex(index);
      drawnPolygons.forEach((polygon, i) => {
        polygon.setMap(i === index ? map : null);
      });

      // Show an alert with the coordinates of the selected field
      const selectedPolygon = polygons[index];
      const coordinates = selectedPolygon.path
        .map((coord) => `(${coord.lng.toFixed(1)}, ${coord.lat.toFixed(1)})`)
        .join(", ");

      const lons = selectedPolygon.path.map((coord) => coord.lng);
      const lats = selectedPolygon.path.map((coord) => coord.lat);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      // alert(selectedPolygon)

      // Send coordinates to backend to get image URL
      try {
        const response = await fetch(
          "https://densefusion.vercel.app/sentinel/getImageUrl",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ coordinates: selectedPolygon.path }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Assuming `data.imageUrl` contains the image URL
          // window.open(data.imageUrl, "_blank");
          displayImageLayerOnMap(data.imageUrl, minLat, minLon, maxLat, maxLon);

          // You can display the image URL as needed, e.g., set it in the state and display it in the UI.
        } else {
          console.error("Error in backend response");
        }
      } catch (error) {
        console.error("Error fetching image URL:", error.message);
      }
    }
  };

  const displayImageLayerOnMap = (imageUrl, minLat, minLon, maxLat, maxLon) => {
    if (!map) {
      console.error("Map is not loaded yet.");
      return;
    }

    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(minLat, minLon), // SW corner
      new window.google.maps.LatLng(maxLat, maxLon) // NE corner
    );

    const groundOverlay = new window.google.maps.GroundOverlay(
      imageUrl,
      bounds
    );
    groundOverlay.setMap(map);
  };

  const resetDB = async (userId) => {
    try {
      const response = await fetch(
        `https://densefusionion.vercel.app/api/reset/${encodeURIComponent(userId)}`,
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
      <div className="map-container" style={{ flex: 1, position: "relative" }}>
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
    </div>
  ) : null;
};

export default DrawableMap;