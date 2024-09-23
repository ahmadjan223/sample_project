const axios = require("axios");
require("dotenv").config(); // Ensure env variables are loaded
// const GeoTIFF = require('geotiff'); // For parsing GeoTIFF data
const fs = require("fs"); // For saving GeoTIFF image (optional)

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
const getWMSImageUrl = (accessToken, bbox, geometry, layer, time) => {
  const baseUrl = `https://services.sentinel-hub.com/ogc/wms/${instance_id}`;
  const width = 512;
  const height = 512;
  const format = "image/png";

  return (
    `${baseUrl}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap` +
    `&LAYERS=${layer}&BBOX=${bbox}&WIDTH=${width}` +
    `&HEIGHT=${height}&FORMAT=${format}` +
    `&TIME=${time}&CRS=EPSG:4326` +
    `&GEOMETRY=${geometry}` + // Uncomment if needed
    `&MAXCC=20&TRANSPARENT=TRUE&SHOWLOGO=false`
  );
};

// Express controller function to handle image request
exports.getImageUrl = async (req, res) => {
  try {
    // console.log("\n");
    const { coordinates, layer, time } = req.body;

    // Ensure coordinates is an array of objects with lng and lat properties
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      throw new Error("Invalid coordinates format.");
    }
    const lons = coordinates.map((coord) => coord.lng);
    const lats = coordinates.map((coord) => coord.lat);
    let minLon = Math.min(...lons);
    let maxLon = Math.max(...lons);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    const box = `${minLat},${minLon},${maxLat},${maxLon}`;

    let geomPoints = coordinates
      .map((coord) => `${coord.lat} ${coord.lng}`)
      .join(",");
    geomPoints += `,${coordinates[0].lat} ${coordinates[0].lng}`;
    const geometry = `POLYGON((${geomPoints}))`;

    // console.log(box);
    // console.log(geometry);

    // Obtain the access token
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("No access token obtained.");
    }

    // Construct WMS URL with access token and BBOX
    const wmsUrl = getWMSImageUrl(accessToken, box, geometry, layer, time);

    console.log("Image URL:", wmsUrl);
    console.log("\n" + time);

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
    console.log("Coordinates at error:", coordinates);
    console.error("Error obtaining image URL:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Function to construct the URL for WMS request (GeoTIFF)
const getGeoTIFFUrl = (accessToken, bbox, geometry, layer, time) => {
  const baseUrl = `https://services.sentinel-hub.com/ogc/wms/${instance_id}`;
  const width = 512;
  const height = 512;
  const format = "image/tiff";  // GeoTIFF format

  return (
    `${baseUrl}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap` +
    `&LAYERS=${layer}&BBOX=${bbox}&WIDTH=${width}` +
    `&HEIGHT=${height}&FORMAT=${format}` +
    `&TIME=${time}&CRS=EPSG:4326` +
    `&GEOMETRY=${geometry}` +
    `&MAXCC=20&TRANSPARENT=TRUE&SHOWLOGO=false`
  );
};

// Express controller function to handle GeoTIFF request and send index values
// Express controller function to handle GeoTIFF request and send index values
exports.getIndexValues = async (req, res) => {
  try {
    const { coordinates, layer, time } = req.body;

    // Ensure coordinates are valid
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      throw new Error("Invalid coordinates format.");
    }

    // Extract longitude and latitude ranges
    const lons = coordinates.map((coord) => coord.lng);
    const lats = coordinates.map((coord) => coord.lat);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const bbox = `${minLat},${minLon},${maxLat},${maxLon}`;

    // Create a geometry string for the polygon
    let geomPoints = coordinates
      .map((coord) => `${coord.lat} ${coord.lng}`)
      .join(",");
    geomPoints += `,${coordinates[0].lat} ${coordinates[0].lng}`; // Close the polygon
    const geometry = `POLYGON((${geomPoints}))`;

    // Obtain the access token
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("No access token obtained.");
    }

    console.log("Access token received");

    // Dynamically import GeoTIFF module
    const GeoTIFF = await import('geotiff'); // Dynamic import for ES module
    console.log("GeoTIFF module imported");

    // Construct WMS URL for GeoTIFF
    const geotiffUrl = getGeoTIFFUrl(accessToken, bbox, geometry, layer, time);
    console.log("GeoTIFF URL:", geotiffUrl);

    // Make a request to the WMS URL to fetch the GeoTIFF image
    const response = await axios.get(geotiffUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "arraybuffer", // To handle binary image data (GeoTIFF)
    });

    // Check and log the response
    console.log("Response Headers:", response.headers);
    console.log("Response Data Type:", typeof response.data);

    // Log first few bytes of data to see its structure
    console.log("Response Data (first 100 bytes):", response.data.slice(0, 1000));

    // Check if response.data is an ArrayBuffer
    if (!(response.data instanceof ArrayBuffer)) {
      // Convert response data to ArrayBuffer if it is not
      console.warn("Response is not an ArrayBuffer. Attempting to convert.");

      // Forcefully convert it to an ArrayBuffer if it is a Buffer (Node.js)
      if (Buffer.isBuffer(response.data)) {
        response.data = response.data.buffer.slice(
          response.data.byteOffset,
          response.data.byteOffset + response.data.byteLength
        );
        console.log("Successfully converted Buffer to ArrayBuffer.");
      } else {
        throw new Error("The response could not be converted to an ArrayBuffer.");
      }
    }

    // Parse the GeoTIFF image and extract index values
    try {
      const tiff = await GeoTIFF.fromArrayBuffer(response.data);
      const image = await tiff.getImage();
      const rasters = await image.readRasters();

      // Assuming index values are in the first raster band
      const indexValues = rasters[0];
      console.log("index values:", indexValues);
      const uniqueValues = new Set(indexValues);
      console.log("Unique index values:", uniqueValues);

      // Respond with index values
      res.json({ message: 'Index values extracted successfully', indexValues });
    } catch (error) {
      console.error("Error extracting INdex values:", error.message);
      res.status(500).json({ error: 'Error extracting INdex values' });
    }

  } catch (error) {
    console.error("Error obtaining GeoTIFF image:", error.message);
    res.status(500).json({ error: error.message });
  }
};