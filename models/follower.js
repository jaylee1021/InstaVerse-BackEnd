const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;