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
  const fieldCount = 5;
  const markerCount = 4;
  const apiKey = "AIzaSyDTpcRPc-44RydvSTDu6Oh8lrSuw2vSE_Q";

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [fields, setFields] = useState([]);
  const [addingMode, setAddingMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const inputRef = useRef(null);
  const [mapKey, setMapKey] = useState(0);

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

  // Function to update fields and clear markers
  const updateFieldsAndClearMarkers = (updatedMarkers) => {
    setFields((currentFields) => {
      if (currentFields.length <= fieldCount) {
        // Limit fields to 5
        const newField = updatedMarkers.slice(-markerCount); // Get only the last markerCount markers
        return [...currentFields, newField];
      } else {
        alert("Maximum of 5 fields allowed.");
        return currentFields;
      }
    });

    // console.log(fields)
    setAddingMode(false); // Exit adding mode
    showNotification('Field saved! Click "Add Location" to start a new field.');
  };

  // Function to handle notifications
  const showNotification = (message, timeout = 1000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), timeout); // Use the provided timeout
  };
  

  // Function to handle map click
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    if (addingMode) {
      const newMarker = { lat, lng };

      if (markers.length % markerCount < markerCount) {
        // Check if there are fewer than markerCount markers
        handleAddMarker(newMarker);
        showNotification(`Latitude: ${lat}, Longitude: ${lng}`);
      } else {
        alert("Maximum of 4 markers allowed.");
      }
    }
  };

  // Function to handle adding a new location
  const handleAddLocation = () => {
    console.log("Adding. . . ");
    if (fields.length < fieldCount) {
      setAddingMode(true);
    } else {
      setAddingMode(false);
      showNotification(`You have already added ${fieldCount} fields`);
    }
  };

  const sendToDatabase = async () => {
    fields.forEach((field, fieldIndex) => {
      console.log(`Field: ${fieldIndex + 1}`);

      field.forEach((marker, markerIndex) => {
        console.log(`Cord${markerIndex + 1}: (${marker.lng}, ${marker.lat})`);
      });

      // If there are fewer than 4 coordinates, fill in with placeholders
      for (let i = field.length; i < 4; i++) {
        console.log(`Cord${i + 1}: (N/A, N/A)`);
      }

      console.log(""); // Add a blank line for separation
    });
    try {
      const response = await fetch("http://localhost:3000/api/fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setFields([]);
        // setMarkers([]);
        // setPolylines([]);
        // setMapKey(prevKey => prevKey + 1);
        showNotification("Fields saved successfully!",5000);
      } else {
        console.error("Failed to save fields");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const resetDatabase = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reset", {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        // Optionally, clear fields and markers in the UI
        setFields([]);
        setMarkers([]);
        setPolylines([]);
        setMapKey(prevKey => prevKey + 1);
        showNotification("Database reset successfully!",5000);
      } else {
        console.error("Failed to reset database");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={apiKey} // Use environment variable
      libraries={["places"]}
    >
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Map Container */}
        <div style={{ flex: 1, position: "relative" }}>
          <GoogleMap
            key={mapKey}
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
          onSendToDatabase={sendToDatabase}
          addingMode={addingMode}
          onResetDatabase={resetDatabase}
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
