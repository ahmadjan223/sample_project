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
  const [imageData, setImageData] = useState(null); // State to store image data
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
  const fetchImageData = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // To handle CORS if needed
      img.src = imageUrl;
  
      img.onload = () => {
        // Create a canvas with the same size as the image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
  
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);
  
        // Extract pixel data from the canvas
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        console.log("Image loaded successfully!");
      console.log("Image Width:", img.width);
      console.log("Image Height:", img.height);
      console.log("Pixel Data:", imageData.data);
  
        // Resolve with the image data and additional info (dimensions, etc.)
        resolve({
          data: imageData.data, // Pixel data
          width: img.width,
          height: img.height,
          bounds: null, // You can assign the bounds later
        });
      };
  
      img.onerror = (err) => {
        reject(new Error("Failed to load image: " + err.message));
      };
    });
  };
  
  const displayImageLayerOnMap = () => {
    const [imageUrl, minLat, minLon, maxLat, maxLon] = layerDisplay;
    
    if (!map) {
      console.error("Map is not loaded yet.");
      return;
    }
  
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(minLat, minLon), // SW corner
      new window.google.maps.LatLng(maxLat, maxLon)  // NE corner
    );
  
    const groundOverlay = new window.google.maps.GroundOverlay(imageUrl, bounds);
    groundOverlay.setMap(map);
  
    // Fetch and store the image data
    fetchImageData(imageUrl).then(data => setImageData(data)).catch(error => console.error("Error fetching image data:", error));
  };
  const latLngToPixel = (latLng, bounds, imageWidth, imageHeight) => {
    const projection = map.getProjection();
    const topLeft = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomRight = projection.fromLatLngToPoint(bounds.getSouthWest());
    const current = projection.fromLatLngToPoint(latLng);
  
    const scale = 1 / (bottomRight.x - topLeft.x); // Normalized scale
  
    return {
      x: Math.floor((current.x - topLeft.x) * imageWidth / scale),
      y: Math.floor((topLeft.y - current.y) * imageHeight / scale),
    };
  };
  const handleClick = (event) => {
    const latLng = event.latLng;
    if (!imageData || !map) return;
  
    const { bounds, width, height } = imageData;
    const pixelCoords = latLngToPixel(latLng, bounds, width, height);
  
    if (pixelCoords.x >= 0 && pixelCoords.x < width && pixelCoords.y >= 0 && pixelCoords.y < height) {
      const index = (pixelCoords.y * width + pixelCoords.x) * 4;
      const pixel = {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3],
      };
      console.log(`Pixel Value at (${pixelCoords.x}, ${pixelCoords.y}):`, pixel);
    } else {
      console.log("Click is outside the image bounds");
    }
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
  onLoad={(map) => setMap(map)}
  onClick={handleClick} // Changed to handle clicks
  mapContainerStyle={containerStyle}
>
  <DrawingManager
    onLoad={(drawingManager) => setDrawingManager(drawingManager)}
    onOverlayComplete={onOverlayComplete}
    options={drawingManagerOptions}
  />
</GoogleMap>

    </div>
  );
};

export default Maps;
