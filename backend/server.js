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
require("./passport"); // Import Passport configuration

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
const db = process.env.MONGO_URI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Import models
const Polygon = mongoose.model("Polygon");

// Route to save fields data to the database
app.post("/api/fields", async (req, res) => {
  try {
    const { polygons } = req.body;

    // Create Polygon documents for each polygon
    const polygonDocuments = polygons.map((polygon) => ({
      coordinates: polygon.path,
      name: polygon.name,
    }));

    await Polygon.insertMany(polygonDocuments);

    res.status(201).json({ message: "Polygons saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/save-single-polygon', async (req, res) => {
  const { coordinates, name, userId } = req.body;

  try {
    // Validate input
    if (!coordinates || !name || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new polygon with the userId
    const polygon = new Polygon({
      coordinates,
      name,
      userId, // Add userId to the polygon data
    });

    await polygon.save();
    res.status(200).json({ message: 'Polygon saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});






// Route to reset the database for a specific user
app.post('/api/reset/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete polygons that match the userId
    const result = await Polygon.deleteMany({ userId });

    res.status(200).json({ message: `Database reset for user ${userId}.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all polygons from the database
app.get('/api/load-polygons/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find polygons that match the userId
    const polygons = await Polygon.find({ userId });

    res.status(200).json(polygons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to update a field name
app.patch('/api/update-field/:name', async (req, res) => {
    const { name } = req.params;
    const { name: newName } = req.body;

    try {
      const polygon = await Polygon.findOne({ name });
        if (!polygon) {
            return res.status(404).json({ message: 'Field not found' });
        }

        polygon.name = newName;
        await polygon.save();
        
        res.status(200).json({ message: 'Field updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a field
app.delete('/api/delete-field/:name', async (req, res) => {
    const { name } = req.params;
    
    try {
        const result = await Polygon.deleteOne({ name });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Field not found' });
        }
        
        res.status(200).json({ message: 'Field deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
//handling /auth/google/callback
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const user = req.user;
    const redirectUrl = `http://localhost:3001/dashboard?name=${encodeURIComponent(user.displayName)}&id=${encodeURIComponent(user.id)}&image=${encodeURIComponent(user.image)}`;
    res.redirect(redirectUrl);
});


app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.redirect('//localhost:3001'); // Adjust the redirect path as needed
  });
});

app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});

// Route handler for /dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      "<h1>Welcome to the Dashboard</h1><p>You are logged in as " +
        req.user.displayName +
        "</p>"
    );
  } else {
    res.redirect("/");
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
