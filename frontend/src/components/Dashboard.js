import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import SideNav from "./SideNav";
import { sendSinglePolygonToDb, sendToDb, loadPolygon } from "./apiService";
import Maps from "./Maps";

const libraries = ["places", "drawing"];
const Dashboard = ({ user }) => {
  const [map, setMap] = useState(null);
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);

  useEffect(() => {
    DataFetch(user.id);
  }, []);
  //loading maps first and libs for drawing.
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDTpcRPc-44RydvSTDu6Oh8lrSuw2vSE_Q",
    libraries,
  });
  //fetching polygons from db
  const DataFetch = async (userId) => {
    try {
      const response = await loadPolygon(userId);
      setPolygons(response);
      console.log("polygon array of this user have arrived in Dashboard ");
    } catch (error) {
      console.log(error);
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
          "http://localhost:3000/sentinel/getImageUrl",
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
          alert(
            `The field could be too small for sentinel!
          Coordinates of ${selectedPolygon.name}: ${coordinates}`
          );
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

  return (
    <div style={{ display: "flex" }}>
      <SideNav
        polygons={polygons}
        isLoaded={isLoaded}
        user={user}
        resetDB={() => resetDB(user.id)}
        sendToDb={() => {
          sendToDb(polygons);
        }}
        clearMap={clearMap}
        selectedFieldIndex={selectedFieldIndex}
        onFieldClick={handleFieldClick}
      />
      <div className="map-container" style={{ flex: 1, position: "relative" }}>
        {isLoaded && (
          <Maps user={user} polygons={polygons}></Maps>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
