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
  const [selectedFieldName, setSelectedFieldName] = useState(null);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);


  useEffect(() => {
    DataFetch();
  }, []);
  //for sentinel
  useEffect(() => {
    if(selectedFieldName){

      handleFieldClick(selectedFieldName)
    }
  }, [selectedFieldName]);
  
  //loading maps first and libs for drawing.
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDTpcRPc-44RydvSTDu6Oh8lrSuw2vSE_Q",
    libraries,
  });
  //fetching polygons from db
  const DataFetch = async () => {
    try {
      const response = await loadPolygon(user.id);
      setPolygons(response);
      console.log("data fetched from db");
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

  const handleFieldClick = async (name) => {
    // Define a GeoJSON object for testing purposes
    const selectedPolygon = {
      type: "Polygon",
      coordinates: [
        [
          [72.95746253892514, 33.6566964018635],
          [72.96556495277412, 33.661497251838135],
          [72.97682594014998, 33.64869439510463],
          [72.96432899400327, 33.64194927356759],
          [72.95746253892514, 33.6566964018635]
        ]
      ]
    };
  
    // Extract coordinates in the expected format
    const coordinates = selectedPolygon.coordinates[0].map(([lng, lat]) => ({
      lng,
      lat
    }));
  
    try {
      const response = await fetch("http://localhost:3000/sentinel/getImageUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates }), // Send the formatted coordinates
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Image URL:", data.imageUrl);
      } else {
        const errorText = await response.text(); // Get detailed error message from response
        console.error("Error in backend response:", errorText);
      }
    } catch (error) {
      console.error("Error fetching image URL:", error.message);
    }
  };
  
  
  // const displayImageLayerOnMap = (imageUrl, minLat, minLon, maxLat, maxLon) => {
  //   if (!map) {
  //     console.error("Map is not loaded yet.");
  //     return;
  //   }

  //   const bounds = new window.google.maps.LatLngBounds(
  //     new window.google.maps.LatLng(minLat, minLon), // SW corner
  //     new window.google.maps.LatLng(maxLat, maxLon) // NE corner
  //   );

  //   const groundOverlay = new window.google.maps.GroundOverlay(
  //     imageUrl,
  //     bounds
  //   );
  //   groundOverlay.setMap(map);
  // };

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
        setSelectedFieldName={(name)=>{setSelectedFieldName(name);}}
        // onFieldClick={handleFieldClick}
      />
      <div className="map-container" style={{ flex: 1, position: "relative" }}>
        {isLoaded && (
          <Maps user={user} polygons={polygons} DataFetch={DataFetch}></Maps>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
