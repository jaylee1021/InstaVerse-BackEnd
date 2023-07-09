const mongoose = require('mongoose');

// create comment schema
const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    likes: Number
}, { timestamps: true });


// create post schema
const postSchema = new mongoose.Schema({
    username: String,
    caption: String,
    photo: String,
    likes: Number,
    comments: [commentSchema]
}, { timestamps: true });

// create post model
const Post = mongoose.model('Post', postSchema);

// export post model
module.exports = Post;