import React, { useState, useEffect } from "react";
import {
  DrawingManager,
  GoogleMap,
  Polygon,
} from "@react-google-maps/api";
import { savePolygon, sendToDb, loadPolygon } from "./apiService";
const libraries = ["places", "drawing"];
const Maps = ({ user, polygons, DataFetch, layerDisplay }) => {
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
  };

  useEffect(() => {
    console.log("use effect in maps is called", layerDisplay);
    displayImageLayerOnMap();
  }, [layerDisplay]);

  const onOverlayComplete = async (event) => {
    const newPolygon = event.overlay;
    const newPolygonPath = newPolygon
      .getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

    const name = prompt("Enter a name for this field:");

    if (name) {
      await savePolygon(newPolygonPath, name, user.id);
      newPolygon.setMap(null);
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
    console.log("I am getting triggered, I am layer on map");
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

    const groundOverlay = new window.google.maps.GroundOverlay(imageUrl, bounds);
    groundOverlay.setMap(map);
  };

  // Log latitude and longitude on mouse move
  const handleMouseMove = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log(`Mouse Move - Latitude: ${lat}, Longitude: ${lng}`);
  };

  return (
    <div className="map-container" style={{ flex: 1, position: "relative" }}>
      <GoogleMap
        zoom={13}
        center={defaultCenter}
        onLoad={(map) => {
          setMap(map);
        }}
        onClick={handleMouseMove} // Added onMouseMove handler
        mapContainerStyle={containerStyle}
      >
        <DrawingManager
          onLoad={(drawingManager) => {
            setDrawingManager(drawingManager);
          }}
          onOverlayComplete={onOverlayComplete}
          options={drawingManagerOptions}
        />
      </GoogleMap>
    </div>
  );
};

export default Maps;
