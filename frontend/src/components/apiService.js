export const savePolygon = async (coordinates, name, userId) => {
    try {
      const response = await fetch(
        "https://densefusion.vercel.app/api/save-single-polygon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates,
            name,
            userId,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
      } else {
        const errorData = await response.json();
        console.error("Failed to save polygon:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  export const sendToDb = async (polygons) => {
    try {
      const response = await fetch("https://densefusion.vercel.app/api/fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ polygons }),
      });

      if (response.ok) {
        console.log("Polygons saved successfully!");
      } else {
        console.error("Failed to save polygons");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
export const loadPolygon = async (userId) => {
    try {
      const response = await fetch(
        `https://densefusion.vercel.app/api/load-polygons/${encodeURIComponent(userId)}`
      );
      if (response.ok) {
        const result = await response.json();
        const transformedPolygons = result.map((polygon) => ({
          path: polygon.coordinates.map((coord) => ({
            lat: coord.lat,
            lng: coord.lng,
          })),
          name: polygon.name,
        }));
        return transformedPolygons;
      } else {
        console.error("Failed to load polygons");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };