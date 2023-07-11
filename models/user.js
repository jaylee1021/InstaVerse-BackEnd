const mongoose = require('mongoose');

// create user schema
const userSchema = new mongoose.Schema({
    fullName: String,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: String,
    pronouns: String,
    profilePicture: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Follower' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Following' }],
    bio: String,
    gender: String
}, { timestamps: true });

// create user model
const User = mongoose.model('User', userSchema);

// export user model
module.exports = User;