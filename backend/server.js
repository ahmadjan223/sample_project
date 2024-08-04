require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('./models/User'); // Ensure the User model is imported and registered
require('./models/Field'); // Ensure the Field model is imported and registered
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

// Import Field model
const Field = mongoose.model('Field');

// Route to save fields data to the database
app.post('/api/fields', async (req, res) => {
    try {
      const { fields } = req.body;
  
      // Create Field documents for each field
      const fieldDocuments = fields.map((field, index) => ({
        fieldNumber: index + 1,
        cords: {
          cord1: field[0] ? [field[0].lng, field[0].lat] : [null, null],
          cord2: field[1] ? [field[1].lng, field[1].lat] : [null, null],
          cord3: field[2] ? [field[2].lng, field[2].lat] : [null, null],
          cord4: field[3] ? [field[3].lng, field[3].lat] : [null, null],
        }
      }));
  
      await Field.insertMany(fieldDocuments);
  
      res.status(201).json({ message: 'Fields saved successfully!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Route to reset the database
app.post('/api/reset', async (req, res) => {
    try {
      await Field.deleteMany(); // Remove all documents from the Field collection
      res.status(200).json({ message: 'Database reset successfully!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard'); // Redirect after successful login
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
