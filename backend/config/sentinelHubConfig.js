// config/sentinelHubConfig.js
const axios = require('axios');
require('dotenv').config(); // Ensure env variables are loaded

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

    const accessToken = response.data.access_token;
    console.log('Access Token:', accessToken);

    return accessToken;
  } catch (error) {
    console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
  }
};

module.exports = { getAccessToken };
