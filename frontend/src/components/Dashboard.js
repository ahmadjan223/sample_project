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
import TopBar from "./TopBar";
import { Drawer, Stack } from "@mui/material";
import PermanentDrawer from "./PermanentDrawer";

const libraries = ["places", "drawing"];
const Dashboard = ({ user }) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [polygons, setPolygons] = useState(null);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFieldName, setSelectedFieldName] = useState(null);
  const [polygonLayer, setPolygonLayer] = useState([]);
  const [date, setDate] = useState(new Date());
  const [layer, setLayer] = useState("NDVI");
  const [indexValues, setIndexValues] = useState({});

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
        "http://localhost:3000/sentinel/getImageUrl",
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
        // window.open(data.imageUrl, "_blank");
        const propsArray = [data.imageUrl, minLat, minLon, maxLat, maxLon];
        setPolygonLayer(propsArray);
        console.log(polygonLayer);
        // setIsLoading(false);
        //fetching index values
        getIndexValues(selectedPolygon.path, layer, date);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching image URL:", error.message);
    }
  };

  const getIndexValues = async (path, layer, timeRange) => {
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
        setIndexValues(IndexArray);
        console.log(result);
      } else {
        console.error("Failed to get index values");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
  useEffect(() => {
    if (selectedFieldName) {
      // alert(`Selected Field Name: ${selectedFieldName}`);
    }
  }, [selectedFieldName]);

  return (
    <Stack>
      {/* TopBar */}
      <TopBar />

      <div
        style={{
          display: "flex",
          // border: "1px solid white",
          // padding: "1px",
        }}
      >
        <div
          style={{
            flex: "0 0 21.5%",
            // border: "1px solid white",
            // padding: "1px", // Solid black border for the left div
          }}
        >
          <PermanentDrawer
            polygons={polygons}
            user={user}
            selectedFieldName={selectedFieldName}
            setSelectedFieldName={setSelectedFieldName}
            DataFetch={DataFetch}
            setIsDrawing={setIsDrawing}
          />
        </div>

        <div
          style={{
            flex: "1 0 77%", // 70% width for the right div
            display: "flex", // Flex to handle layout inside (map and bottom bar)
            flexDirection: "column",
            // border: "1px solid white", // Solid black border for the right div
            padding: "10px", // Stack the map and BottomBar vertically
          }}
        >
          <div
            style={{
              flex: 1,
              position: "relative",
              borderRadius: "32px", // Set the desired border radius here
              overflow: "hidden", // Ensure the content respects the border radius
            }}
          >
            {isLoading && (
  <div
    style={{
      position: "fixed", // Ensure the overlay covers the whole screen, even when scrolling
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background with transparency
      zIndex: 1300, // Ensure it's above all other elements, including Drawer
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
                indexValues={indexValues}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
              />
            )}
          </div>

          {selectedFieldName && (
            <BottomBar
              date={date}
              layer={layer}
              setDate={setDate}
              setLayer={setLayer}
              selectedFieldName={selectedFieldName}
            />
          )}
        </div>
      </div>
    </Stack>
  );
};

export default Dashboard;
