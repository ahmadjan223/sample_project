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

// Define a simple schema and model
// Define a schema and model for Fields
const FieldSchema = new mongoose.Schema({
    fieldNumber: Number,
    cords: [
      {
        cord1: { type: [Number] },
        cord2: { type: [Number] },
        cord3: { type: [Number] },
        cord4: { type: [Number] },
      }
    ]
  });
  
  const Field = mongoose.model('Field', FieldSchema);
  
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
  

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
