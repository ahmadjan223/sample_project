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
  setIsLoading,
  isDrawing,
  setIsDrawing,
}) => {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [polygonBoundary, setPolygoneBoundary] = useState([]);
  const [groundOverlay, setGroundOverlay] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 33.639777,
    lng: 72.985718,
  });
  //saving image on canvas ofr mouse hover
  let [cachedImage, setCachedImage] = useState(null); // Store the loaded image globally
  let [cachedCanvas, setCachedCanvas] = useState(null);

  //map ki height waghera yahan maps se change hogi
  //lekin agar wo scroll bar aana shuru ho jaye
  //right side pe ya neeche ki taraf to wo bottombar mki waja se khap hogi
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const polygonOptions = {
    fillOpacity: 0,
    fillColor: "#ff0000",
    strokeColor: "white",
    strokeWeight: 3,
    draggable: false,
    editable: false,
    clickable: true,
  };

  const drawingManagerOptions = {
    polygonOptions: polygonOptions,
    drawingControl: true,
    position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],

  };
  
  useEffect(() => {
    if (map && drawingManager) {
      if (drawingManager) {
        drawingManager.setMap(map); // Show the drawing manager
        drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON); // Activate polygon drawing
      } else {
        drawingManager.setMap(null); 
        // deactivate polygon drawing drawing
        // Hide the drawing manager when not in drawing mode

      }
    }
  }, [isDrawing, map, drawingManager]);
  

  //for clearing map
  useEffect(() => {
    if (!selectedFieldName) {
      setPolygoneBoundary([]);
    }
    if(groundOverlay){  
      groundOverlay.setMap(null);
    }

  }, [selectedFieldName]);

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
  //for removing prev image layer and drawing new image layer
  useEffect(() => {
    if (groundOverlay) {
      groundOverlay.setMap(null);
    }
  }, [date, layer]);
  // for displaying image layer on map
  useEffect(() => {
    if (polygonLayer) {
      displayImageLayerOnMap();
    }
  }, [polygonLayer]);
  //for saving polygon coordinates in state for displaying polygon
  useEffect(() => {
    if (selectedFieldName && polygons) polygonCoordinates();
  }, [selectedFieldName]);
  const polygonCoordinates = () => {
    const filter = polygons.find(
      (polygon) => polygon.name === selectedFieldName
    );
    setPolygoneBoundary(filter.path);
  };
  // to check if name already exists donot allow to save
  const nameExists = (name) => {
    return polygons.some((polygon) => polygon.name === name);
  };
  const onOverlayComplete = async (event) => {
    setIsDrawing(false);
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
    setIsDrawing(false); // Exit drawing mode after saving

  };
  // let timer;

  const displayImageLayerOnMap = () => {
    if (!map) {
      console.error("Map is not loaded yet.");
      return;
    }

    // Clear the existing overlay if it exists
    if (groundOverlay) {
      groundOverlay.setMap(null);
    }

    const [imageUrl, minLat, minLon, maxLat, maxLon] = polygonLayer;
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(minLat, minLon), // SW corner
      new window.google.maps.LatLng(maxLat, maxLon) // NE corner
    );

    // Create a new GroundOverlay
    const newGroundOverlay = new window.google.maps.GroundOverlay(
      imageUrl,
      bounds,
      {
        clickable: false, // Ensure overlay captures events
      }
    );

    newGroundOverlay.setMap(map);
    setGroundOverlay(newGroundOverlay); // Save the overlay in state
    processLayerForPopUp(imageUrl);
  };

  const processLayerForPopUp = async (imageUrl) => {
    console.log("Preprocessing layer...");

    const image = new Image();
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const width = image.width;
      const height = image.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);

      // Cache the image and canvas for later use

      setCachedImage(image);
      setCachedCanvas(canvas);
      console.log("Image preprocessing completed.");
      setIsLoading(false);
    };

    image.onerror = (error) => {
      console.error("Failed to load the image during preprocessing", error);
      console.error("Image URL:", imageUrl);
    };
    // Load the image (only done once)
    image.src = imageUrl;
  };

  // Add the mousemove listener to the GroundOverlay
  const updateTooltip = (event, indexValue) => {
    const mouseX = event.domEvent.clientX;
    const mouseY = event.domEvent.clientY;
    tooltip.textContent = `${indexValue}`;
    tooltip.style.left = `${mouseX}px`;
    tooltip.style.top = `${mouseY}px`;
    tooltip.style.display = "block"; // Show tooltip
  };

  const hideTooltip = () => {
    tooltip.style.display = "none"; // Hide tooltip
  };
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.backgroundColor = "white";
  tooltip.style.border = "1px solid #ccc";
  tooltip.style.padding = "5px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  tooltip.style.pointerEvents = "none"; // Prevent tooltip from blocking mouse events
  tooltip.style.display = "none"; // Initially hidden
  document.body.appendChild(tooltip);
  const handlePolygonLoad = (polygon) => {
    // Add mousemove listener to the polygon
    polygon.addListener("mousemove", (event) => {
      updateTooltip(event, 25); // Display index value
    });

    // Add mouseout listener to hide the tooltip
    polygon.addListener("mouseout", hideTooltip);
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
          options={isDrawing?drawingManagerOptions:{}}
        />
        <Polygon
          paths={polygonBoundary}
          options={polygonOptions}
          visible={true}
          onLoad={handlePolygonLoad}
        />
      </GoogleMap>
    </div>
  );
};

export default Maps;
