require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('./models/User'); // Ensure the User model is imported and registered
require('./models/Field'); // Ensure the Field model is imported and registered
require('./models/Polygon'); // Ensure the Polygon model is imported and registered
require('./passport'); // Import Passport configuration

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
const db = process.env.MONGO_URI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Import models
const Field = mongoose.model('Field');
const Polygon = mongoose.model('Polygon');

// Route to save fields data to the database
app.post('/api/fields', async (req, res) => {
    try {
        const { polygons } = req.body;

        // Create Polygon documents for each polygon
        const polygonDocuments = polygons.map(polygon => ({
            coordinates: polygon
        }));

        await Polygon.insertMany(polygonDocuments);

        res.status(201).json({ message: 'Polygons saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to reset the database
app.post('/api/reset', async (req, res) => {
    try {
        await Polygon.deleteMany(); // Remove all documents from the Polygon collection
        res.status(200).json({ message: 'Database reset successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all polygons from the database
app.get('/api/load-polygons', async (req, res) => {
    try {
        const polygons = await Polygon.find();
        res.status(200).json(polygons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
//handling /auth/google/callback
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const user = req.user;
    const redirectUrl = `http://localhost:3001/dashboard?name=${encodeURIComponent(user.displayName)}&id=${encodeURIComponent(user.id)}&image=${encodeURIComponent(user.image)}`;
    res.redirect(redirectUrl);
});


app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/api/current_user', (req, res) => {
    res.send(req.user);
});

// Route handler for /dashboard
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('<h1>Welcome to the Dashboard</h1><p>You are logged in as ' + req.user.displayName + '</p>');
    } else {
        res.redirect('/');
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
