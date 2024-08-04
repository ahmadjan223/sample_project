const mongoose = require('mongoose');
const { Schema } = mongoose;

const PolygonSchema = new Schema({
    coordinates: [
        {
            lat: { type: Number },
            lng: { type: Number }
        }
    ]
});

mongoose.model('Polygon', PolygonSchema);
