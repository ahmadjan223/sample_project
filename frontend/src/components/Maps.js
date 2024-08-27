import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  GoogleMap,
  Polygon,
} from "@react-google-maps/api";
import { savePolygon, sendToDb, loadPolygon } from "./apiService";
const libraries = ["places", "drawing"];
const Maps = ({user, polygons,DataFetch,layerDisplay }) => {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
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
  }
  useEffect(() => {
    console.log('use effect in maps is called',layerDisplay)
    displayImageLayerOnMap();
      // Cleanup function to clear the timeout if the component unmounts or propsArray changes
  }, [layerDisplay]);
  

  const onOverlayComplete = async (event) => {
    const newPolygon = event.overlay;
    //a minimal lat long map we be obtained
    const newPolygonPath = newPolygon
      .getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

    // const lons = newPolygonPath.map((coord) => coord.lng);
    // const lats = newPolygonPath.map((coord) => coord.lat);
    // const minLon = Math.min(...lons);
    // const maxLon = Math.max(...lons);
    // const minLat = Math.min(...lats);
    // const maxLat = Math.max(...lats);

    // if (minLon >= maxLon || minLat >= maxLat) {
    //   alert("The field is too small to load for Sentinel");
    //   newPolygon.setMap(null); // Remove the polygon from the map
    //   return; // Stop execution if the field is too small
    // }
    const name = prompt("Enter a name for this field:");

    if (name) {
      // setPolygons((prevPolygons) => [// ig donot need to set it just on complete send it the polygon to db
      //   ...prevPolygons,
      //   { path: newPolygonPath, name },
      // ]);
      // setDrawnPolygons((prevDrawnPolygons) => [
      //   ...prevDrawnPolygons,
      //   newPolygon,
      // ]);

      // Save to database
      await savePolygon(newPolygonPath, name, user.id); 
      newPolygon.setMap(null);
      // to trigger the data fetch
      DataFetch();
    } else {
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
  const displayImageLayerOnMap = () => {
    console.log('i am getting triggered i am layer on map')
    const [imageUrl, minLat, minLon, maxLat, maxLon] = layerDisplay;
    console.log(imageUrl);
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
  return (
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
          { false && polygons.map((polygon, index) => (
            <Polygon
              key={index}
              paths={polygon.path}
              options={polygonOptions}
              // visible={selectedFieldIndex === index}
            />
          ))}
        </GoogleMap>
      </div>
  )
}

export default Maps