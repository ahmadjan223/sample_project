require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

require("./models/User"); // Ensure the User model is imported and registered
require("./models/Field"); // Ensure the Field model is imported and registered
require("./models/Polygon"); // Ensure the Polygon model is imported and registered
require("./config/passport"); // Import Passport configuration

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const fieldRoutes = require('./routes/fieldRoutes');
const sentinelRoutes = require('./routes/sentinelRoutes');

const connectDB = require('./config/db');
const { getAccessToken, downloadImagery } = require('./config/sentinelHubConfig');
// code starts here
const app = express();
// Middleware
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
  origin: 'https://densefusion-3001.vercel.app', // Replace with your client's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials (if needed)
};

app.use(cors(corsOptions));

app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
// MongoDB connection
connectDB();

app.get('/', (req, res) => {
  res.send('TEST Dear user, \nWelcome to the DenseFusion backend. \nPlease go to https://densefusion-3001.vercel.app for the website. \n\nThanks!');
});


//sentinel acess token
app.get('/test-token', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.send(`Access Token: ${token}`);
  } catch (error) {
    res.status(500).send('Error obtaining token');
  }
});
// downloadImagery();

// Route to save fields data to the database
app.use(fieldRoutes);
// Google authentication routes
app.use(authRoutes);
//user routes
app.use(userRoutes);
//user routes
app.use(sentinelRoutes);
// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
