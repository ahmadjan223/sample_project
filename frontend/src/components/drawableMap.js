import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places", "drawing"];
const DrawableMap = () => {
  const [map, setMap] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [polygonDrawn, setPolygonDrawn] = useState(false); // Track if a polygon has been drawn

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDTpcRPc-44RydvSTDu6Oh8lrSuw2vSE_Q",
    libraries,
  });
  const [polygons, setPolygons] = useState([
    // Initial polygons defined in state
    [
      { lat: 28.626137, lng: 79.821603 },
      { lat: 28.636137, lng: 79.821603 },
      { lat: 28.636137, lng: 79.831603 },
      { lat: 28.626137, lng: 79.831603 },
    ],
    [
      { lat: 28.646137, lng: 79.821603 },
      { lat: 28.656137, lng: 79.821603 },
      { lat: 28.656137, lng: 79.831603 },
      { lat: 28.646137, lng: 79.831603 },
    ],
    [
      { lat: 28.616137, lng: 79.811603 },
      { lat: 28.626137, lng: 79.811603 },
      { lat: 28.626137, lng: 79.821603 },
      { lat: 28.616137, lng: 79.821603 },
    ],
  ]); // Use an array to hold multiple polygons

  const defaultCenter = {
    lat: 28.626137,
    lng: 79.821603,
  };
  const [center, setCenter] = useState(defaultCenter);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const polygonOptions = {
    fillOpacity: 0.3,
    fillColor: "#ff0000",
    strokeColor: "#ff0000",
    strokeWeight: 2,
    draggable: true,
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

  const onOverlayComplete = (event) => {
    const newPolygon = event.overlay
      .getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
    
    setPolygons((prevPolygons) => [...prevPolygons, newPolygon]);
    // event.overlay.setMap(null);
    // setPolygonDrawn(true); // Set polygonDrawn to true
  };
  const resetMap = () => {
    setPolygons([]);
    setPolygonDrawn(false);
    if (drawingManager) {
      drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
  };


  const addPolygonToArray = (newPolygon) => {
    setPolygons([...polygons, newPolygon]);
  };
  //fucntion to be defined
  const DisplayPolygon=()=>{
    const data =  [];
    setPolygons(data);
  }
  const sendToDb = () => {
    const data = polygons;
  }

  useEffect(() => {
    console.log(polygons);
  }, [polygons]);

  return isLoaded ? (
    <div className="map-container" style={{ position: "relative" }}>
      <GoogleMap
        zoom={15}
        center={center}
        onLoad={(map) => {
          console.log("google maps is runned")
          setMap(map);
        }}
        mapContainerStyle={containerStyle}
        onTilesLoaded={() => setCenter(null)}
      >
        <DrawingManager
          onLoad={(drawingManager) => {
            console.log('drawing manager is called')
            setDrawingManager(drawingManager);
          }}
          onOverlayComplete={onOverlayComplete}
          options={{
            ...drawingManagerOptions,
            drawingControl: !polygonDrawn, // Disable drawing control if a polygon is drawn
          }}
        />
        {polygons.map((polygon, index) => (
          <Polygon key={index} paths={polygon} options={polygonOptions} />
        ))}
      </GoogleMap>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button onClick={sendToDb}>send polygon to db</button>
        <button onClick={DisplayPolygon}>Display all polygons</button>
        <button onClick={resetMap}>Reset Map</button>
      </div>
    </div>
  ) : null;
};

export default DrawableMap;