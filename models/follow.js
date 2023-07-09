import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    username: String,
    following: String,
    followers: String
}, { timestamps: true });

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;