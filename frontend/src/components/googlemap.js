import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import Sidebar from "./sidebar"; // Adjust the import path if needed

const containerStyle = {
  width: "100%",
  height: "100%", // Make the height fill the container
};

const center = {
  lat: 33.639887,
  lng: 72.986013,
};

const MyComponent = () => {
const apiKey = 'AIzaSyDTpcRPc-44RydvSTDu6Oh8lrSuw2vSE_Q';

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [fields, setFields] = useState([]);
  const [addingMode, setAddingMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const inputRef = useRef(null);

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onLoadAutocomplete = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        map.panTo(location);
        map.setZoom(15); // Adjust zoom level as needed
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };
  const drawPolylines = (updatedMarkers) => {
    const newPolylines = [];
    const numMarkers = updatedMarkers.length;
  
    // Process markers in groups of markerCount
    for (let i = 0; i < numMarkers; i += markerCount) {
      // Extract the current group of up to markerCount markers
      const group = updatedMarkers.slice(i, i + markerCount);
  
      // Draw polylines for the current group
      if (group.length === 2) {
        newPolylines.push({
          path: [group[0], group[1]],
        });
      } else if (group.length === 3) {
        newPolylines.push({
          path: [group[0], group[1]],
        });
        newPolylines.push({
          path: [group[1], group[2]],
        });
      } else if (group.length === 4) {
        newPolylines.push({
          path: [group[0], group[1]],
        });
        newPolylines.push({
          path: [group[1], group[2]],
        });
        newPolylines.push({
          path: [group[2], group[3]],
        });
        newPolylines.push({
          path: [group[3], group[0]],
        });
      }
    }
  
    return newPolylines;
  };
  

  // Function to handle marker addition
  const handleAddMarker = (newMarker) => {
    setMarkers((currentMarkers) => {
      const updatedMarkers = [...currentMarkers, newMarker];
      const newPolylines = drawPolylines(updatedMarkers);

      setPolylines(newPolylines);

      if (updatedMarkers.length % markerCount === 0) {
        
        updateFieldsAndClearMarkers(updatedMarkers);
      }

      return updatedMarkers;
    });
  };
const fieldCount =5;
const markerCount =4
 // Function to update fields and clear markers
const updateFieldsAndClearMarkers = (updatedMarkers) => {
  setFields((currentFields) => {
    if (currentFields.length <= fieldCount) { // Limit fields to 3
      const newField = updatedMarkers.slice(-markerCount); // Get only the last markerCount markers
      return [...currentFields, newField];
    } else {
      alert('Maximum of 5 fields allowed.');
      return currentFields;
    }
  });

  setAddingMode(false); // Exit adding mode
  showNotification('Field saved! Click "Add Location" to start a new field.');
};


  // Function to handle notifications
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000); // Hide after 5 seconds
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    if (addingMode) {
      const newMarker = { lat, lng };

      if (markers.length % markerCount < markerCount) { // Check if there are fewer than markerCount markers
        handleAddMarker(newMarker);
        showNotification(`Latitude: ${lat}, Longitude: ${lng}`);
      } else {
        alert('Maximum of 4 markers allowed.');
      }
    }
  };
  const handleAddLocation = () => {

    setAddingMode(true); // Enable adding mode
  };

  return (
    <LoadScript
      googleMapsApiKey={apiKey}// Use environment variable
      libraries={["places"]}
    >
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Map Container */}
        <div style={{ flex: 1, position: "relative" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15} // Adjust zoom level as needed
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick} // Handle map clicks
          >
            <Autocomplete
              onLoad={onLoadAutocomplete}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder="Search for places"
                ref={inputRef}
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `240px`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-120px",
                  top: "10px",
                }}
              />
            </Autocomplete>
            {/* Render markers */}
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
              />
            ))}
            {/* Render polylines */}
            {polylines.map((polyline, index) => (
              <Polyline
                key={index}
                path={polyline.path}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1.0,
                  strokeWeight: 2,
                  icons: [
                    {
                      icon: "●", // Dotted icon
                      offset: "0%",
                      repeat: "20px", // Adjust spacing of dots
                    },
                  ],
                }}
              />
            ))}
          </GoogleMap>
        </div>

        {/* Sidebar Component */}
        <Sidebar
          fields={fields}
          onAddLocation={handleAddLocation}
          addingMode={addingMode}
        />

        {/* Notification */}
        {notification && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              zIndex: 1000,
            }}
          >
            {notification}
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default MyComponent;
