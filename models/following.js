const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Following = mongoose.model('Following', followingSchema);

module.exports = Following;