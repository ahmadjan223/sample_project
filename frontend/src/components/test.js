const handleFieldClick = async (name) => {
    const selectedPolygon = polygons.find((polygon) => polygon.name === name);
    
    if (!selectedPolygon) {
      console.error("Polygon not found!");
      return;
    }
    
    // Convert the coordinates to GeoJSON format
    const geoJsonPolygon = {
      type: "Polygon",
      coordinates: [
        selectedPolygon.path.map(coord => [coord.lng, coord.lat])
      ]
    };
  
    try {
      const response = await fetch(
        "http://localhost:3000/sentinel/getImageUrl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coordinates: geoJsonPolygon }),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.imageUrl);
      }
    } catch (error) {
      console.error("Error fetching image URL:", error.message);
    }
  };
  