const axios = require("axios");
require("dotenv").config(); // Ensure env variables are loaded

const instance_id = "8ea582ad-8f40-4237-8ef7-eac1ac938858";

// Function to get access token
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://services.sentinel-hub.com/oauth/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SENTINEL_HUB_CLIENT_KEY,
        client_secret: process.env.SENTINEL_HUB_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error obtaining access token:",
      error.response ? error.response.data : error.message
    );
  }
};

// Function to construct the URL for WMS request
const getWMSImageUrl = (accessToken, bbox) => {
  const baseUrl = `https://services.sentinel-hub.com/ogc/wms/${instance_id}`;
  const layer = "NDVI"; // Example layer
  const width = 512; // Image width
  const height = 512; // Image height
  const time = "2024-01-01/2024-01-31"; // Time range
  const format = "image/png"; // Image format

  return (
    `${baseUrl}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap` +
    `&LAYERS=${layer}&BBOX=${bbox}&WIDTH=${width}` +
    `&HEIGHT=${height}&FORMAT=${format}` +
    `&TIME=${time}&CRS=EPSG:4326&SHOWLOGO=false`
  );
};

// Express controller function to handle image request
exports.getImageUrl = async (req, res) => {
  try {
    console.log("\n");
    const { coordinates } = req.body;

    // Ensure coordinates is an array of objects with lng and lat properties
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      throw new Error("Invalid coordinates format.");
    }

    // Calculate BBOX values
    const lons = coordinates.map((coord) => coord.lng);
    const lats = coordinates.map((coord) => coord.lat);
    let minLon = Math.min(...lons);
    let maxLon = Math.max(...lons);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);

    const bbox = `${minLat},${minLon},${maxLat},${maxLon}`;
    // const bbox = "32.1,72.4,33.1,73.4";

    // Obtain the access token
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("No access token obtained.");
    }

    // Construct WMS URL with access token and BBOX
    const wmsUrl = getWMSImageUrl(accessToken, bbox);
    console.log("BBOX:", bbox);
    console.log("Image URL:", wmsUrl);

    // Make a request to the WMS URL to fetch the image
    const response = await axios.get(wmsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "arraybuffer", // To handle binary image data
    });

    // Respond with the WMS URL or the saved image path
    res.json({ imageUrl: wmsUrl });
  } catch (error) {
    console.error("Error obtaining image URL:", error.message);
    res.status(500).json({ error: error.message });
  }
};
