const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
    username: String,
    follower: String
}, { timestamps: true });

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;