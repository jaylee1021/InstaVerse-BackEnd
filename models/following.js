const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
    username: String,
    following: String
}, { timestamps: true });

const Following = mongoose.model('Following', followingSchema);

module.exports = Following;