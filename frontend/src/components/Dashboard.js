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
import BottomBar from "./bottomBar";

const libraries = ["places", "drawing"];
const Dashboard = ({ user }) => {
  const [map, setMap] = useState(null);
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [polygons, setPolygons] = useState(null);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectedFieldName, setSelectedFieldName] = useState(null);
  const [polygonLayer, setPolygonLayer] = useState([]);
  const [date,setDate] = useState(new Date());
  const [layer,setLayer] = useState("NDVI");
  const [polygoneBoundary,setPolygoneBoundary] = useState([]);  

  useEffect(() => {
    DataFetch();
  }, []);
  
  useEffect(() => {
    if(selectedFieldName){
      updateImage(selectedFieldName,layer,date);
    }
  }, [layer,date]);
  
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
  const updateImage = async (name,layer,date) => {
    console.log("update image is called it will be updated very now")
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
            body: JSON.stringify({ coordinates: selectedPolygon.path, layer:layer, date:date }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const propsArray = [
            data.imageUrl,
            minLat,
            minLon,
            maxLat,
            maxLon
          ];
          setPolygonLayer(propsArray);
          console.log(polygonLayer)
        }
      } catch (error) {
        console.error("Error fetching image URL:", error.message);
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
      <div style={{flex:1, flexDirection:'row'}}>

      <div className="map-container" style={{ flex: 1, position: "relative" }}>
        {(isLoaded) &&  (
          <Maps user={user} polygons={polygons} DataFetch={DataFetch} polygonLayer = {polygonLayer} selectedFieldName = {selectedFieldName}></Maps>
        )}
      </div>
      <div>
        <BottomBar date = {date} layer = {layer} setDate = {setDate} setLayer = {setLayer}></BottomBar>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
