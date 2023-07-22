const mongoose = require('mongoose');

// create comment schema
const commentSchema = new mongoose.Schema({
    comment: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// create post schema
const postSchema = new mongoose.Schema({
    caption: String,
    photo: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// create post model
const Post = mongoose.model('Post', postSchema);

// export post model
module.exports = Post;