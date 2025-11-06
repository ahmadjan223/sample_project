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
const allowedOrigins = [
  'https://cropmon.vercel.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin without Origin header
    if (!origin) return callback(null, true);
    const isPreview = /https?:\/\/cropmon-[a-z0-9-]+-.*\.vercel\.app$/i.test(origin);
    if (allowedOrigins.includes(origin) || isPreview) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
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
  res.send('TEST Dear user, \nWelcome to the DenseFusion backend.. \nPlease go to https://cropmon.vercel.app/ for the website. \n\nThanks!');
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
// Ensure CORS preflight (OPTIONS) is handled for all routes
app.options('*', cors(corsOptions));

// Start the server locally; export app for serverless (Vercel)
const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
