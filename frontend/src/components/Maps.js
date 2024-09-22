import React, { useState, useEffect } from "react";
import { DrawingManager, GoogleMap, Polygon } from "@react-google-maps/api";
import { savePolygon, sendToDb, loadPolygon } from "./apiService";
const libraries = ["places", "drawing"];
const Maps = ({
  user,
  polygons,
  DataFetch,
  polygonLayer,
  selectedFieldName,
  date,
  layer,
}) => {
  console.log(selectedFieldName);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [imageData, setImageData] = useState(null); // State to store image data
  const [polygonBoundary, setPolygoneBoundary] = useState([]);
  const [groundOverlay,setGroundOverlay] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 33.639777,
    lng: 72.985718,
  });

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const polygonOptions = {
    fillOpacity: 0,
    fillColor: "#ff0000",
    strokeColor: "black",
    strokeWeight: 5,
    draggable: false,
    editable: false,
  };

  const drawingManagerOptions = {
    polygonOptions: polygonOptions,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],
    },
  };
  //for changing the center
  useEffect(() => {
    if (selectedFieldName) {
      const filter = polygons.find(
        (polygon) => polygon.name === selectedFieldName
      );
      const centerPoint = calculateCenter(filter.path);
      setDefaultCenter(centerPoint);
    }
  }, [selectedFieldName]);
  const calculateCenter = (path) => {
    const totalPoints = path.length;

    // Sum all latitudes and longitudes
    const { latSum, lngSum } = path.reduce(
      (acc, point) => {
        acc.latSum += point.lat;
        acc.lngSum += point.lng;
        return acc;
      },
      { latSum: 0, lngSum: 0 }
    );

    // Calculate average lat and lng
    const center = {
      lat: latSum / totalPoints,
      lng: lngSum / totalPoints,
    };

    return center;
  };
  //for clearing map and drawing new polygons
  useEffect(() => {
    if(groundOverlay){
      groundOverlay.setMap(null);
    }
  },[date,layer])
  useEffect(() => {
    console.log("use effect in maps is called", polygonLayer);
    displayImageLayerOnMap();
  }, [polygonLayer]);
  // to check if name already exists donot allow to save
  const nameExists = (name) => {
    return polygons.some((polygon) => polygon.name === name);
  };
  useEffect(() => {
    if (selectedFieldName && polygons) polygonCoordinates();
  }, [selectedFieldName]);
  const polygonCoordinates = () => {
    const filter = polygons.find(
      (polygon) => polygon.name === selectedFieldName
    );
    setPolygoneBoundary(filter.path);
  };
  const onOverlayComplete = async (event) => {
    const name = prompt("Enter a name for this field:");
    if (nameExists(name)) {
      alert("name already exists");
      return;
    }
    const newPolygon = event.overlay;
    const newPolygonPath = newPolygon
      .getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

    if (name !== null && name !== "") {
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
    let groundOverlay = null;
    const [imageUrl, minLat, minLon, maxLat, maxLon] = polygonLayer;
    // if (!map) {
    //   console.error("Map is not loaded yet.");
    //   return;
    // }
    if (groundOverlay) {
      groundOverlay.setMap(null);
    }

    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(minLat, minLon), // SW corner
      new window.google.maps.LatLng(maxLat, maxLon) // NE corner
    );

    groundOverlay = new window.google.maps.GroundOverlay(imageUrl, bounds);
    groundOverlay.setMap(map);
    setGroundOverlay(groundOverlay);
    // Fetch and store the image data
    fetchImageData(imageUrl)
      .then((data) => setImageData(data))
      .catch((error) => console.error("Error fetching image data:", error));
  };

  return (
    <div className="map-container" style={{ flex: 1, position: "relative" }}>
      <GoogleMap
        zoom={13}
        center={defaultCenter}
        onLoad={(map) => setMap(map)}
        // onClick={handleClick} // Changed to handle clicks
        mapContainerStyle={containerStyle}
      >
        <DrawingManager
          onLoad={(drawingManager) => setDrawingManager(drawingManager)}
          onOverlayComplete={onOverlayComplete}
          options={drawingManagerOptions}
        />
        <Polygon
          paths={polygonBoundary}
          options={polygonOptions}
          visible={true}
        />
      </GoogleMap>
    </div>
  );
};

export default Maps;
