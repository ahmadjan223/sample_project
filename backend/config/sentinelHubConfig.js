const axios = require('axios');
require('dotenv').config(); // Ensure env variables are loaded

const instance_id = "8ea582ad-8f40-4237-8ef7-eac1ac938858";

// Function to get access token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://services.sentinel-hub.com/oauth/token', 
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SENTINEL_HUB_CLIENT_KEY,
        client_secret: process.env.SENTINEL_HUB_CLIENT_SECRET
      }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
  }
};

// Function to construct the URL for WMS request
const getWMSImageUrl = (accessToken) => {
  const baseUrl = `https://services.sentinel-hub.com/ogc/wms/${instance_id}`;
  const layer = 'NDVI'; // Example layer
  const bbox= '23.303643,42.679295,23.313643,42.699295' // Bounding box coordinates
  const width = 512; // Image width
  const height = 512; // Image height
  const time = '2023-01-01/2023-01-31'; // Time range
  const format = 'image/png'; // Image format
  
  const geometry=encodeURIComponent("POLYGON((23.303643 42.696295,23.303643 42.699295,23.313643 42.699295,23.313643 42.679295,23.303643 42.696295))");

  return `${baseUrl}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap` +
  `&LAYERS=${layer}&BBOX=${bbox}&WIDTH=${width}` +
  `&HEIGHT=${height}&FORMAT=${format}` +
  `&TIME=${time}&CRS=EPSG:4326` +
  `&GEOMETRY=${geometry}` +
  `&MAXCC=20&TRANSPARENT=TRUE&SHOWLOGO=false`;

};

// Function to get image URL
const getImageUrl = async () => {/* The code snippet you provided is using a `try...catch` block in
JavaScript to handle asynchronous code. Here's a breakdown of
what's happening: */

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('No access token obtained.');
    }

    // Construct WMS URL with access token
    const wmsUrl = getWMSImageUrl(accessToken);

    // Log URL and make a request to test
    console.log('Hardcoded:::', wmsUrl);

    // Optionally, you can make a request to the WMS URL to test if it's working
    const response = await axios.get(wmsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      responseType: 'arraybuffer' // To handle binary image data
    });

    // Save the image to a file
    const fs = require('fs');
    fs.writeFileSync('output_image.png', response.data);
    console.log('Imagery downloaded and saved as output_image.png');
    
  } catch (error) {
    console.error('Error obtaining image URL:', error.response ? error.response.data : error.message);
  }
};

getImageUrl();
