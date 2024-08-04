const mongoose = require('mongoose');
const { Schema } = mongoose;

const FieldSchema = new Schema({
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

module.exports = mongoose.model('Field', FieldSchema);
