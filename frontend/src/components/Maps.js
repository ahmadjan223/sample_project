import React, { useState, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

import { DrawingManager, GoogleMap, Polygon } from "@react-google-maps/api";
import { savePolygon, sendToDb, loadPolygon } from "./apiService";
import InputModal from "./inputModal";
import Button from "@mui/material/Button";

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
  indexValues,
  isDrawing,
  setIsDrawing,
  addField,
  setAddField,
  mapType,
  setMapType,
}) => {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [polygonBoundary, setPolygoneBoundary] = useState([]);
  const [groundOverlay, setGroundOverlay] = useState(null);
  const [newFieldName, setNewFieldName] = useState("");
  const [openInputModal, setOpenInputModal] = useState(false);
  const [overlayEvent, setOverlayEvent] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 33.639777,
    lng: 72.985718,
  });
  //saving image on canvas ofr mouse hover
  let [cachedImage, setCachedImage] = useState(null); // Store the loaded image globally
  let [cachedCanvas, setCachedCanvas] = useState(null);

  const [autocomplete, setAutocomplete] = useState(null);
  const inputRef = useRef();
  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setDefaultCenter(newCenter);
        map.panTo(newCenter);
      }
    }
  };

  //map ki height waghera yahan maps se change hogi
  //lekin agar wo scroll bar aana shuru ho jaye
  //right side pe ya neeche ki taraf to wo bottombar mki waja se khap hogi
  const containerStyle = {
    width: "100%",
    height: "88.3vh",
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
  const polygonOptions = {
    fillOpacity: 0,
    fillColor: "#ff0000",
    strokeColor: "#fafafa",
    strokeWeight: 3,
    draggable: false,
    editable: false,
    clickable: false,
  };

  const drawingManagerOptions = {
    polygonOptions: polygonOptions,
    drawingControl: false,
  };

  useEffect(() => {
    if (drawingManager) {
      if (isDrawing) {
        drawingManager.setOptions({
          drawingMode: window.google.maps.drawing.OverlayType.POLYGON, // Enable drawing mode
          drawingControl: false, // Show the drawing control when in drawing mode
          drawingControlOptions: {
            drawingModes: [window.google.maps.drawing.OverlayType.POLYGON], // Only polygon drawing
          },
        });
      } else {
        drawingManager.setOptions({
          drawingMode: null, // Disable drawing mode
          drawingControl: false, // Hide drawing control when not in drawing mode
        });
      }
    }
  }, [isDrawing, drawingManager]);
  // Trigger useEffect when isDrawing or drawingManager changes

  //for clearing map
  useEffect(() => {
    if (!selectedFieldName) {
      setPolygoneBoundary([]);
    }
    if (groundOverlay) {
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
    if (polygons){
      return polygons.some((polygon) => polygon.name === name);
    }
    else return false;
  };
  const onOverlayComplete = async (event) => {
    setOpenInputModal(true);
    setOverlayEvent(event);
    setAddField(!addField); // Set the overlay event state
  };
  const saveField = async () => {
    const name = newFieldName;
    const event = overlayEvent; // Use the state variable
    if (nameExists(name)) {
      alert("name already exists");
      return;
    }
    setIsDrawing(false);
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
  //getting index values for mouse hover

  //mouseHover on image layer
  const handleMouseHover = (event) => {
    hideTooltip();
    if (!groundOverlay) {
      console.error("groundOverlay is is not loaded.");
      return;
    }

    // Check if cachedImage and cachedCanvas are initialized
    if (!cachedCanvas || !indexValues) {
      console.error("Cached canvas or NDVI values are not available.");
      return;
    }

    const latLng = event.latLng;
    const { lat, lng } = latLng.toJSON();
    console.log("Hovered at Lat:", lat, "Lng:", lng);

    // Bounds of the overlay
    const bounds = groundOverlay.getBounds();
    const northEast = bounds.getNorthEast(); // maxLat, maxLon
    const southWest = bounds.getSouthWest(); // minLat, minLon
    const minLat = southWest.lat();
    const minLon = southWest.lng();
    const maxLat = northEast.lat();
    const maxLon = northEast.lng();

    // Get canvas dimensions
    const width = cachedCanvas.width;
    const height = cachedCanvas.height;

    // Process the click
    console.log("sent for calculating");
    calculateIndexValue(
      lat,
      lng,
      minLat,
      minLon,
      maxLat,
      maxLon,
      width,
      height,
      event
    );
  };
  //code for calculating the index value on mouse hover

  const calculateIndexValue = (
    lat,
    lng,
    minLat,
    minLon,
    maxLat,
    maxLon,
    width,
    height,
    event
  ) => {
    console.log(
      "IndexValue:",
      indexValues,
      lat,
      lng,
      minLat,
      minLon,
      maxLat,
      maxLon,
      width,
      height
    );
    // Validate input values

    // Check if the ranges are valid
    const lonRange = maxLon - minLon;
    const latRange = maxLat - minLat;

    if (lonRange <= 0 || latRange <= 0) {
      console.error("Invalid latitude or longitude range.");
      return;
    }

    // Convert lat/lng to pixel coordinates
    const x = ((lng - minLon) / lonRange) * width;
    const y = ((lat - maxLat) / -latRange) * height; // Invert latRange to correctly scale the Y axis

    // Check if the conversion resulted in valid numbers
    if (isNaN(x) || isNaN(y)) {
      console.error("Conversion to pixel coordinates resulted in NaN values.");
      console.error(
        `lng: ${lng}, minLon: ${minLon}, maxLon: ${maxLon}, width: ${width}`
      );
      console.error(
        `lat: ${lat}, minLat: ${minLat}, maxLat: ${maxLat}, height: ${height}`
      );
      return;
    }

    // Round x and y to the nearest integers
    const pixelX = Math.round(x);
    const pixelY = Math.round(y);

    console.log("NDVI Array Length:", indexValues.length);
    console.log("Canvas Width:", width, "Canvas Height:", height);
    console.log("Index Calculation: ", pixelY * width + pixelX);

    // Ensure x and y are within the bounds of the image dimensions
    if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
      // Calculate the index in the NDVI values array
      const index = pixelY * width + pixelX;

      // Ensure the index is within bounds
      if (index >= 0 && index < indexValues.length) {
        const ndviValue = indexValues[index];

        // NDVI values are typically in the range [-1, 1], adjust if necessary
        console.log(
          `NDVI Value at (${pixelX}, ${pixelY}) [lat: ${lat}, lng: ${lng}] is: ${ndviValue}`
        );

        // Trigger function after 1 second (assuming you want to use ndviValue in the tooltip)
        updateTooltip(event, ndviValue);
      } else {
        console.error(
          "Index is out of bounds in the NDVI values array. Length: ",
          indexValues.length,
          " Index: ",
          index
        );
      }
    } else {
      console.error("Coordinates are out of bounds");
    }
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
    tooltip.style.display = "none";
    tooltip.textContent = "";
    // Hide tooltip
  };
  if (map) {
    let timer;
    map.addListener("mousemove", (event) => {
      hideTooltip();
      // Clear the timer if the mouse keeps moving
      clearTimeout(timer);
      // hideTooltip();
      // Start a 1 second timer to check if the mouse stays
      timer = setTimeout(() => {
        // setEvent(event);
        handleMouseHover(event);
      }, 100);
    });

    // Mouseout event to cancel the timer if the mouse leaves the map
    map.addListener("mouseout", () => {
      clearTimeout(timer); // Clear the timer if the mouse moves out too soon
      // console.log("hide tooltip");
      // setEvent(null);
      hideTooltip(); // Hide tooltip when mouse leaves the map
    });
  }

  const mapTypeMapping = {
    ROADMAP: window.google.maps.MapTypeId.ROADMAP,
    SATELLITE: window.google.maps.MapTypeId.SATELLITE,
    HYBRID: window.google.maps.MapTypeId.HYBRID,
    TERRAIN: window.google.maps.MapTypeId.TERRAIN,
  };

  useEffect(() => {
    if (window.google) {
      // alert(mapType);
    }
  }, [mapType]);

  return (
    <div className="map-container" style={{ flex: 1, position: "relative" }}>
      <InputModal
        setNewFieldName={setNewFieldName}
        saveField={saveField}
        setOpenInputModal={setOpenInputModal}
        openInputModal={openInputModal}
      ></InputModal>

      <Autocomplete
        onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search a place"
          ref={inputRef}
          style={{
            position: "absolute",

            top: "8px",
            right: "16px",

            width: "320px",
            height: "48px",

            padding: "10px",
            borderRadius: "4px",
            zIndex: 1, // Ensure the input is above the map
          }}
        />
      </Autocomplete>
      <GoogleMap
        mapTypeId={mapTypeMapping[mapType]}
        zoom={13}
        center={defaultCenter}
        onLoad={(map) => setMap(map)}
        mapContainerStyle={containerStyle}
        options={{
          zoomControl: true,
          fullscreenControl: false, 
          scaleControl: true, 
          
        //   zoomControlOptions: {
        //     style: window.google.maps.ZoomControlStyle.SMALL
        // },



          // mapTypeControl: true,
          // mapTypeControlOptions: {
          //   style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          // },
          // mapTypeControlOptions: {
          //   style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          //   position: window.google.maps.ControlPosition.CENTER,
          // },

          // streetViewControl: false,
          // panControl: true,
          // overviewMapControl: true,
          // rotateControl: true,
        }}
      >
        <div style={{ margin: "8px 16px" }}>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => setMapType("SATELLITE")}
            sx={{ borderRadius: "4px 0px 0px 4px" }}
          >
            SATELLITE
          </Button>

          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => setMapType("ROADMAP")}
            sx={{ borderRadius: "0px 4px 4px 0px" }}
          >
            ROAD
          </Button>
        </div>

        <DrawingManager
          onLoad={(drawingManager) => setDrawingManager(drawingManager)}
          onOverlayComplete={onOverlayComplete}
          options={drawingManagerOptions}
        />
        <Polygon
          handleMouseHover={(event) => handleMouseHover(event)}
          // onClick={(event) => handleMouseHover(event)}
          paths={polygonBoundary}
          options={polygonOptions}
          visible={true}
        />
      </GoogleMap>
    </div>
  );
};

export default Maps;