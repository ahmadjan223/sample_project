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
  // for displaying image layer on map
  useEffect(() => {
    if(polygonLayer){
      displayImageLayerOnMap();
    }
  }, [polygonLayer]);
  //for saving polygon coordinates in state
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

  const displayImageLayerOnMap = () => {
    let groundOverlay = null;
    const [imageUrl, minLat, minLon, maxLat, maxLon] = polygonLayer;
    
    if (!map) {
      console.error("Map is not loaded yet.");
      return;
    }
    
    if (groundOverlay) {
      groundOverlay.setMap(null);
    }
  
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(minLat, minLon), // SW corner
      new window.google.maps.LatLng(maxLat, maxLon) // NE corner
    );
  
    groundOverlay = new window.google.maps.GroundOverlay(imageUrl, bounds, {
      clickable: true, // Set clickable to true to capture events
    });
    groundOverlay.setMap(map);
    setGroundOverlay(groundOverlay);
    // Add the mousemove listener to the GroundOverlay
    groundOverlay.addListener('mousemove', (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        updateTooltip(event, 25); // Update the tooltip with dummy value
      }, 10);
    });
  
    // Add mouseout listener to hide the tooltip when the mouse leaves
    groundOverlay.addListener('mouseout', () => {
      clearTimeout(timer);
      hideTooltip(); // Hide tooltip when mouse leaves the overlay
    });
  };
  
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

  let timer;  
  //   if (map) {
  //   console.log('map listener is about to get initialized')
  //   map.addListener('mousemove', (event) => {
  //     // Clear the timer if the mouse keeps moving
  //     clearTimeout(timer);
  //     // hideTooltip();
  //     // Start a 1 second timer to check if the mouse stays
  //     timer = setTimeout(() => {
  //       updateTooltip(event, 25)
  //       console.log('print mouse value')
  //     }, 10);
  //   });
  
  //   // Mouseout event to cancel the timer if the mouse leaves the map
  //   map.addListener('mouseout', () => {
  //     clearTimeout(timer);  // Clear the timer if the mouse moves out too soon
  //     hideTooltip();        // Hide tooltip when mouse leaves the map
  //   });
  // }
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
