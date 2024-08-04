const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    displayName: String,
    email: String,
    image: String
});

module.exports = mongoose.model('User', userSchema);
