const mongoose = require('mongoose');

const PolygonSchema = new mongoose.Schema({
  coordinates: [{ lat: Number, lng: Number }],
  name: { type: String, required: true },
  userId: { type: String, required: true }, // Add userId field
});

module.exports = mongoose.model('Polygon', PolygonSchema);
