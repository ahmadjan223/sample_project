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
const connectDB = require('./config/db');
// code starts here
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
// MongoDB connection
connectDB();
// Route to save fields data to the database
app.use(fieldRoutes);
// Google authentication routes
app.use(authRoutes);
//user routes
app.use(userRoutes);
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
