require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const db = process.env.MONGO_URI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Define a schema and model for Polygons
const PolygonSchema = new mongoose.Schema({
    coordinates: [
      {
        lat: { type: Number },
        lng: { type: Number }
      }
    ]
});

const Polygon = mongoose.model('Polygon', PolygonSchema);

// Route to save polygons data to the database
app.post('/api/save-polygons', async (req, res) => {
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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
