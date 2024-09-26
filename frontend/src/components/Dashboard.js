import React, { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";

import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import SideNav from "./sidenav";
import { sendSinglePolygonToDb, sendToDb, loadPolygon } from "./apiService";
import Maps from "./Maps";
import BottomBar from "./bottomBar";

const libraries = ["places", "drawing"];
const Dashboard = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [polygons, setPolygons] = useState(null);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFieldName, setSelectedFieldName] = useState(null);
  const [polygonLayer, setPolygonLayer] = useState([]);
  const [date, setDate] = useState(new Date());
  const [layer, setLayer] = useState("NDVI");

  useEffect(() => {
    DataFetch();
  }, []);

  useEffect(() => {
    if (selectedFieldName) {
      updateImage(selectedFieldName, layer, date);
    }
  }, [layer, date]);

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
  const updateImage = async (name, layer, date) => {
    setIsLoading(true);
    const selectedPolygon = polygons.find((polygon) => polygon.name === name);
    const coordinates = selectedPolygon.path
      .map((coord) => `(${coord.lng.toFixed(1)}, ${coord.lat.toFixed(1)})`)
      .join(", ");

    const lons = selectedPolygon.path.map((coord) => coord.lng);
    const lats = selectedPolygon.path.map((coord) => coord.lat);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    try {
      const response = await fetch(
        "https://densefusion-3n1o.vercel.app/sentinel/getImageUrl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: selectedPolygon.path,
            layer: layer,
            time: date,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const propsArray = [data.imageUrl, minLat, minLon, maxLat, maxLon];
        setPolygonLayer(propsArray);
        console.log(polygonLayer);
        // setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching image URL:", error.message);
    }
  };

  const resetDB = async (userId) => {
    try {
      const response = await fetch(
        `https://densefusion-3n1o.vercel.app/api/reset/${encodeURIComponent(userId)}`,
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
        selectedFieldName={selectedFieldName}
        setSelectedFieldName={(name) => {
          setSelectedFieldName(name);
        }}
        // onFieldClick={handleFieldClick}
      />
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
      <div style={{ flex: 1, flexDirection: "row" }}>
        <div
          className="map-container"
          style={{ flex: 1, position: "relative" }}
        >
          {isLoaded && (
            <Maps
              user={user}
              polygons={polygons}
              DataFetch={DataFetch}
              polygonLayer={polygonLayer}
        
              selectedFieldName={selectedFieldName}
              date={date}
              layer={layer}
              setIsLoading={setIsLoading}
            ></Maps>
          )}
        </div>
        <div>
          {selectedFieldName && (<BottomBar
            date={date}
            layer={layer}
            setDate={setDate}
            setLayer={setLayer}
            selectedFieldName={selectedFieldName}
          ></BottomBar>)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
