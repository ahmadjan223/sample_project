

const mongoose = require('mongoose');

const PolygonSchema = new mongoose.Schema({
    coordinates: [{ lat: Number, lng: Number }],
    name: { type: String, required: true } // Add the name field
});

module.exports = mongoose.model('Polygon', PolygonSchema);
